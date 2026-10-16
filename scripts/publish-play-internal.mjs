import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const api = 'https://androidpublisher.googleapis.com';
export async function publishInternal({
  bundlePath,
  metadataPath,
  packageName,
  versionCode,
  source,
  token,
  fetchImpl = fetch,
}) {
  if (!token || !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageName ?? ''))
    throw new Error('Missing publication identity.');
  if (
    !Number.isSafeInteger(versionCode) ||
    versionCode < 1 ||
    versionCode > 2100000000 ||
    !/^[a-f0-9]{40}$/.test(source ?? '')
  )
    throw new Error('Invalid publication version/source.');
  const bundle = await readFile(bundlePath);
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
  if (
    metadata.package !== packageName ||
    metadata.versionCode !== versionCode ||
    metadata.source !== source ||
    metadata.aabSha256 !== createHash('sha256').update(bundle).digest('hex')
  )
    throw new Error('Candidate identity/hash does not match this workflow.');
  const base = `/androidpublisher/v3/applications/${packageName}/edits`;
  async function request(path, method = 'GET', body) {
    const binary = Buffer.isBuffer(body);
    const response = await fetchImpl(`${api}${path}`, {
      method,
      redirect: 'error',
      signal: AbortSignal.timeout(180000),
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body === undefined
          ? {}
          : { 'Content-Type': binary ? 'application/octet-stream' : 'application/json' }),
      },
      ...(body === undefined ? {} : { body: binary ? body : JSON.stringify(body) }),
    });
    if (!response.ok)
      throw new Error(
        `Google Play ${method} failed (HTTP ${response.status}); inspect Console before retrying.`,
      );
    return response.status === 204 ? {} : response.json();
  }
  let edit;
  let committed = false;
  try {
    const opened = await request(base, 'POST', {});
    if (!/^[a-zA-Z0-9_-]+$/.test(opened.id ?? ''))
      throw new Error('Invalid Google Play edit identifier.');
    edit = `${base}/${opened.id}`;
    const tracks = await request(`${edit}/tracks`);
    const versions = (tracks.tracks ?? []).flatMap((track) =>
      (track.releases ?? []).flatMap((release) => release.versionCodes ?? []),
    );
    if (versions.some((value) => !/^[1-9]\d*$/.test(String(value)) || Number(value) >= versionCode))
      throw new Error('Candidate version must be higher than every active Play version.');
    const uploaded = await request(`/upload${edit}/bundles?uploadType=media`, 'POST', bundle);
    if (Number(uploaded.versionCode) !== versionCode)
      throw new Error('Uploaded version code mismatch.');
    await request(`${edit}/tracks/internal`, 'PUT', {
      track: 'internal',
      releases: [
        {
          name: `${metadata.versionName} (${versionCode})`,
          versionCodes: [String(versionCode)],
          status: 'completed',
        },
      ],
    });
    await request(`${edit}:validate`, 'POST');
    await request(`${edit}:commit`, 'POST');
    committed = true;
    return { track: 'internal', versionCode, committed: true };
  } finally {
    if (edit && !committed) {
      // Delete only this uncommitted API edit; never delete a release or retry a commit.
      try {
        await request(edit, 'DELETE');
      } catch {
        /* A committed/expired edit may no longer exist. */
      }
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await publishInternal({
      bundlePath: 'candidate/tiny-wins.aab',
      metadataPath: 'candidate/metadata.json',
      packageName: process.env.TW_ANDROID_CONFIRMED_PACKAGE,
      versionCode: Number(process.env.TW_ANDROID_VERSION_CODE),
      source: process.env.GITHUB_SHA,
      token: process.env.PLAY_ACCESS_TOKEN,
    });
    console.log(
      `Committed Google Play ${result.track} version ${result.versionCode}; store processing may still be pending.`,
    );
  } catch (error) {
    // Network errors may contain request headers/cause objects. Never dump them or tokens.
    console.error(
      error instanceof Error &&
        /^(Google Play |Candidate |Uploaded |Invalid |Missing )/.test(error.message)
        ? error.message
        : 'Play publication failed; inspect Console before retrying.',
    );
    process.exitCode = 1;
  }
}
