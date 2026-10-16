import { readFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function releasePlan({ repository, eventName, ref, runNumber, version, packageName }) {
  if (repository !== 'squiter/tiny-wins' || eventName !== 'push')
    throw new Error('Only release-tag pushes in the owner repository are allowed.');
  const match = /^refs\/tags\/android-v(\d+\.\d+\.\d+)(?:-(?:beta|rc)\.([1-9]\d*))?$/.exec(
    ref ?? '',
  );
  if (!match || match[1] !== version) throw new Error('Release tag must match the app version.');
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageName ?? ''))
    throw new Error('Invalid Android package.');
  if (!/^[1-9]\d*$/.test(String(runNumber))) throw new Error('Invalid workflow run number.');
  // Reserve codes 100001+ for this workflow. Play rejects collisions/downgrades too.
  const versionCode = 100000 + Number(runNumber);
  if (!Number.isSafeInteger(versionCode) || versionCode > 2100000000)
    throw new Error('Android version-code range exhausted.');
  return { packageName, versionCode, tag: ref.slice('refs/tags/'.length) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const app = JSON.parse(await readFile('app.json', 'utf8')).expo;
    const plan = releasePlan({
      repository: process.env.GITHUB_REPOSITORY,
      eventName: process.env.GITHUB_EVENT_NAME,
      ref: process.env.GITHUB_REF,
      runNumber: process.env.GITHUB_RUN_NUMBER,
      version: app.version,
      packageName: app.android.package,
    });
    if (!process.env.GITHUB_OUTPUT) throw new Error('GitHub output destination missing.');
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `package_name=${plan.packageName}\nversion_code=${plan.versionCode}\ntag=${plan.tag}\n`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Release planning failed.');
    process.exitCode = 1;
  }
}
