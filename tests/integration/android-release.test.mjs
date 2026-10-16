import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { prepareAndroidRelease } from '../../scripts/prepare-android-release.mjs';

const roots = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'tiny-wins-release-'));
  roots.push(root);
  await mkdir(join(root, 'android/app'), { recursive: true });
  await writeFile(
    join(root, 'app.json'),
    JSON.stringify({ expo: { android: { package: 'app.tinywins.mobile' } } }),
  );
  await writeFile(
    join(root, 'android/app/build.gradle'),
    "android { defaultConfig { applicationId 'app.tinywins.mobile' } }\n",
  );
  await writeFile(join(root, 'upload.jks'), 'synthetic test credential, not a real key');
  return {
    root,
    packageName: 'app.tinywins.mobile',
    versionCode: '2',
    env: {
      TW_ANDROID_UPLOAD_KEYSTORE: join(root, 'upload.jks'),
      TW_ANDROID_UPLOAD_STORE_PASSWORD: 'synthetic-store-password',
      TW_ANDROID_UPLOAD_KEY_ALIAS: 'upload',
      TW_ANDROID_UPLOAD_KEY_PASSWORD: 'synthetic-key-password',
    },
  };
}
it('prepares an idempotent native signing override without persisting credential values', async () => {
  const input = await fixture();
  await prepareAndroidRelease(input);
  const once = await readFile(join(input.root, 'android/app/build.gradle'), 'utf8');
  await prepareAndroidRelease(input);
  expect(await readFile(join(input.root, 'android/app/build.gradle'), 'utf8')).toBe(once);
  expect(once).toContain("apply from: rootProject.file('../scripts/android-release.gradle')");
  for (const secret of Object.values(input.env)) expect(once).not.toContain(secret);
});
it.each(['0', '-1', '2.1', '2100000001', '1; echo unsafe'])(
  'rejects invalid version code %s without editing native files',
  async (versionCode) => {
    const input = await fixture();
    const path = join(input.root, 'android/app/build.gradle');
    const before = await readFile(path, 'utf8');
    await expect(prepareAndroidRelease({ ...input, versionCode })).rejects.toThrow('Version code');
    expect(await readFile(path, 'utf8')).toBe(before);
  },
);
it('rejects unconfirmed package identity and stale generated native identity', async () => {
  const input = await fixture();
  await expect(
    prepareAndroidRelease({ ...input, packageName: 'app.other.mobile' }),
  ).rejects.toThrow('app.json');
  await writeFile(join(input.root, 'android/app/build.gradle'), "applicationId 'app.old.mobile'\n");
  await expect(prepareAndroidRelease(input)).rejects.toThrow('Generated native package');
});
it('fails closed with missing credentials, an unavailable keystore or the debug key alias', async () => {
  const input = await fixture();
  const path = join(input.root, 'android/app/build.gradle');
  const before = await readFile(path, 'utf8');
  await expect(prepareAndroidRelease({ ...input, env: {} })).rejects.toThrow(
    'Missing TW_ANDROID_UPLOAD_KEYSTORE',
  );
  await expect(
    prepareAndroidRelease({
      ...input,
      env: { ...input.env, TW_ANDROID_UPLOAD_KEY_ALIAS: 'androiddebugkey' },
    }),
  ).rejects.toThrow('debug key');
  await rm(input.env.TW_ANDROID_UPLOAD_KEYSTORE);
  await expect(prepareAndroidRelease(input)).rejects.toThrow();
  expect(await readFile(path, 'utf8')).toBe(before);
});
