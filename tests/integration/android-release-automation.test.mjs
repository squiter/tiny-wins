import { Buffer } from 'node:buffer';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { afterEach, expect, it } from 'vitest';
import { parse } from 'yaml';
import { releasePlan } from '../../scripts/android-release-plan.mjs';
import { publishInternal } from '../../scripts/publish-play-internal.mjs';

const cleanups = [];
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});
const planInput = {
  repository: 'squiter/tiny-wins',
  eventName: 'push',
  ref: 'refs/tags/android-v0.1.0-beta.1',
  runNumber: '1',
  version: '0.1.0',
  packageName: 'app.tinywins.mobile',
};
it('allocates increasing release codes outside the manual candidate range', () => {
  expect(releasePlan(planInput).versionCode).toBe(100001);
  expect(releasePlan({ ...planInput, runNumber: '2' }).versionCode).toBe(100002);
});
it.each([
  { repository: 'outsider/tiny-wins' },
  { eventName: 'pull_request' },
  { eventName: 'pull_request_target' },
  { ref: 'refs/heads/main' },
  { ref: 'refs/tags/android-v9.0.0' },
  { ref: 'refs/tags/android-v0.1.0\nunsafe' },
  { runNumber: '0' },
  { runNumber: '2100000000' },
])('rejects untrusted release context %j', (override) => {
  expect(() => releasePlan({ ...planInput, ...override })).toThrow();
});
async function fixture() {
  const folder = await mkdtemp(join(tmpdir(), 'tiny-wins-play-test-'));
  cleanups.push(folder);
  const bytes = Buffer.from('synthetic AAB fixture, no credentials');
  const metadata = {
    package: 'app.tinywins.mobile',
    versionCode: 100001,
    versionName: '0.1.0',
    source: 'a'.repeat(40),
    aabSha256: createHash('sha256').update(bytes).digest('hex'),
  };
  const bundlePath = join(folder, 'app.aab');
  const metadataPath = join(folder, 'metadata.json');
  await writeFile(bundlePath, bytes);
  await writeFile(metadataPath, JSON.stringify(metadata));
  return {
    bundlePath,
    metadataPath,
    packageName: metadata.package,
    versionCode: metadata.versionCode,
    source: metadata.source,
    token: 'synthetic-test-token',
  };
}
function mockApi({ activeCode = '1', failAt = '', wrongUpload = false } = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, ...options });
    expect(options.redirect).toBe('error');
    if (failAt && url.endsWith(failAt))
      return new Response('sensitive server text must not reach error logs', { status: 403 });
    if (options.method === 'DELETE') return new Response(null, { status: 204 });
    let value = {};
    if (url.endsWith('/edits')) value = { id: 'edit_1' };
    else if (url.endsWith('/tracks'))
      value = { tracks: [{ track: 'production', releases: [{ versionCodes: [activeCode] }] }] };
    else if (url.endsWith('uploadType=media')) value = { versionCode: wrongUpload ? 123 : 100001 };
    return new Response(JSON.stringify(value), { status: 200 });
  };
  return { calls, fetchImpl };
}
it('uploads only the verified candidate and commits only internal testing', async () => {
  const input = await fixture();
  const api = mockApi();
  await expect(publishInternal({ ...input, fetchImpl: api.fetchImpl })).resolves.toEqual({
    track: 'internal',
    versionCode: 100001,
    committed: true,
  });
  const update = api.calls.find((c) => c.method === 'PUT');
  expect(update.url).toMatch(/\/tracks\/internal$/);
  expect(JSON.parse(update.body).releases[0].versionCodes).toEqual(['100001']);
  expect(api.calls.at(-1).url).toMatch(/:commit$/);
  expect(api.calls.some((c) => c.method === 'DELETE')).toBe(false);
});
it('rejects tampered artifacts or mismatched workflow source before contacting Google', async () => {
  const input = await fixture();
  const api = mockApi();
  await writeFile(input.bundlePath, 'tampered');
  await expect(publishInternal({ ...input, fetchImpl: api.fetchImpl })).rejects.toThrow(
    'identity/hash',
  );
  expect(api.calls).toHaveLength(0);
});
it('blocks reused/lower version codes and deletes only its uncommitted edit', async () => {
  const input = await fixture();
  const api = mockApi({ activeCode: '100001' });
  await expect(publishInternal({ ...input, fetchImpl: api.fetchImpl })).rejects.toThrow('higher');
  expect(api.calls.some((c) => c.url.includes('/upload/'))).toBe(false);
  expect(api.calls.at(-1).method).toBe('DELETE');
  expect(api.calls.at(-1).url).toMatch(/\/edits\/edit_1$/);
});
it.each([':validate', ':commit'])(
  'fails closed on %s without token disclosure, retry or production fallback',
  async (failAt) => {
    const input = await fixture();
    const api = mockApi({ failAt });
    await expect(publishInternal({ ...input, fetchImpl: api.fetchImpl })).rejects.toThrow(
      'HTTP 403',
    );
    expect(api.calls.filter((c) => c.url.endsWith(failAt))).toHaveLength(1);
    expect(
      api.calls.filter((c) => c.method === 'PUT').every((c) => c.url.endsWith('/tracks/internal')),
    ).toBe(true);
  },
);
it('does not update a track if Google returns a different uploaded version', async () => {
  const input = await fixture();
  const api = mockApi({ wrongUpload: true });
  await expect(publishInternal({ ...input, fetchImpl: api.fetchImpl })).rejects.toThrow(
    'version code mismatch',
  );
  expect(api.calls.some((c) => c.method === 'PUT')).toBe(false);
});
it('keeps verification credential-free, signing environment-restricted and OIDC limited to publishing', async () => {
  const workflow = parse(await readFile('.github/workflows/android-release.yml', 'utf8'));
  expect(workflow.on).toEqual({
    push: { tags: ['android-v*', '!android-voidc-check-*'] },
    workflow_dispatch: null,
  });
  expect(workflow.jobs.verify.if).toContain("github.event_name == 'push'");
  expect(JSON.stringify(workflow.jobs.verify)).not.toContain('secrets.');
  expect(workflow.jobs.verify.steps.some((s) => s.run?.includes('merge-base --is-ancestor'))).toBe(
    true,
  );
  expect(workflow.jobs.build.needs).toBe('verify');
  expect(workflow.jobs.build.environment).toBe('android-signing');
  expect(workflow.jobs.publish.environment).toBe('android-publish');
  expect(workflow.jobs.publish.permissions['id-token']).toBe('write');
  expect(workflow.jobs.publish.if).toContain("PLAY_INTERNAL_ENABLED == 'true'");
  expect(JSON.stringify(workflow.jobs.publish)).not.toContain('secrets.');
  const auth = workflow.jobs.publish.steps.find((s) => s.id === 'auth');
  expect(auth.with.create_credentials_file).toBe(false);
  expect(auth.with.access_token_scopes).toBe('https://www.googleapis.com/auth/androidpublisher');
  for (const job of Object.values(workflow.jobs))
    for (const step of job.steps) if (step.uses) expect(step.uses).toMatch(/@[a-f0-9]{40}$/);
});

it('isolates the manual OIDC diagnostic from signing, release jobs and token output', async () => {
  const workflow = parse(await readFile('.github/workflows/android-release.yml', 'utf8'));
  const check = workflow.jobs['auth-check'];
  expect(check.if).toContain("github.event_name == 'workflow_dispatch'");
  expect(check.if).toContain("github.repository == 'squiter/tiny-wins'");
  expect(check.if).toContain('refs/tags/android-voidc-check-');
  expect(check.environment).toBe('android-publish');
  expect(check.permissions).toEqual({ contents: 'read', 'id-token': 'write' });
  expect(check.steps.some((step) => step.run?.includes('merge-base --is-ancestor'))).toBe(true);
  expect(JSON.stringify(check)).not.toContain('secrets.');
  expect(check.steps.some((step) => step.uses?.includes('upload-artifact'))).toBe(false);
  const auth = check.steps.find((step) => step.id === 'auth');
  expect(auth.with).toEqual(workflow.jobs.publish.steps.find((step) => step.id === 'auth').with);
  expect(auth.with.access_token_lifetime).toBe('600s');
  const confirmation = check.steps.at(-1);
  expect(confirmation.env.GOOGLE_ACCESS_TOKEN).toBe('${{ steps.auth.outputs.access_token }}');
  expect(confirmation.run).toContain('test -n "$GOOGLE_ACCESS_TOKEN"');
  expect(confirmation.run).not.toMatch(/(?:echo|printf).*\$GOOGLE_ACCESS_TOKEN/);
  expect(workflow.jobs.verify.if).toContain("github.event_name == 'push'");
  expect(workflow.jobs.publish.needs).toContain('verify');
});
