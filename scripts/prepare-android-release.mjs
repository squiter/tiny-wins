import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const marker = "apply from: rootProject.file('../scripts/android-release.gradle')";

export async function prepareAndroidRelease({ root, packageName, versionCode, env }) {
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(packageName ?? ''))
    throw new Error('Confirm a valid Android package name.');
  if (!/^[1-9]\d*$/.test(versionCode ?? '') || Number(versionCode) > 2100000000)
    throw new Error('Version code must be an integer between 1 and 2100000000.');
  const config = JSON.parse(await readFile(resolve(root, 'app.json'), 'utf8'));
  if (config.expo?.android?.package !== packageName)
    throw new Error(
      'Confirmed package does not match app.json. Register and confirm the final ID first.',
    );
  for (const name of [
    'TW_ANDROID_UPLOAD_KEYSTORE',
    'TW_ANDROID_UPLOAD_STORE_PASSWORD',
    'TW_ANDROID_UPLOAD_KEY_ALIAS',
    'TW_ANDROID_UPLOAD_KEY_PASSWORD',
  ]) {
    if (!env[name]) throw new Error(`Missing ${name}; debug signing is never a release fallback.`);
  }
  if (env.TW_ANDROID_UPLOAD_KEY_ALIAS.toLowerCase() === 'androiddebugkey')
    throw new Error('The Android debug key is not a release credential.');
  await access(env.TW_ANDROID_UPLOAD_KEYSTORE);
  const gradlePath = resolve(root, 'android/app/build.gradle');
  const gradle = await readFile(gradlePath, 'utf8');
  const generatedPackage = gradle.match(/\bapplicationId\s+['"]([^'"]+)['"]/);
  if (generatedPackage?.[1] !== packageName)
    throw new Error('Generated native package does not match the confirmed package.');
  if (!gradle.includes(marker)) await writeFile(gradlePath, `${gradle.trimEnd()}\n\n${marker}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    await prepareAndroidRelease({
      root: process.cwd(),
      packageName: process.env.TW_ANDROID_CONFIRMED_PACKAGE,
      versionCode: process.env.TW_ANDROID_VERSION_CODE,
      env: process.env,
    });
    console.log('Release signing override prepared; no credentials written to Gradle.');
  } catch (error) {
    // Do not print filesystem/child-process diagnostics that might contain credentials.
    const safe =
      error instanceof Error && !('code' in error) ? error.message : 'Release inputs unavailable.';
    console.error(safe);
    process.exitCode = 1;
  }
}
