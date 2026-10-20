#!/usr/bin/env bash
set -euo pipefail
umask 077
export TW_ANDROID_UPLOAD_KEYSTORE="$RUNNER_TEMP/tiny-wins-upload.jks"
trap 'rm -f "$TW_ANDROID_UPLOAD_KEYSTORE" "$RUNNER_TEMP/tiny-wins-upload.der" "$RUNNER_TEMP/tiny-wins-aab-cert.pem"' EXIT
node --input-type=module <<'JS'
import { writeFileSync } from 'node:fs';
const encoded = process.env.TW_ANDROID_UPLOAD_KEYSTORE_BASE64;
if (!encoded || !/^[A-Za-z0-9+/=\r\n]+$/.test(encoded)) throw new Error('Missing/invalid upload keystore secret.');
writeFileSync(process.env.TW_ANDROID_UPLOAD_KEYSTORE, Buffer.from(encoded, 'base64'), { mode: 0o600 });
JS
keytool -exportcert -keystore "$TW_ANDROID_UPLOAD_KEYSTORE" \
  -storepass:env TW_ANDROID_UPLOAD_STORE_PASSWORD \
  -alias "$TW_ANDROID_UPLOAD_KEY_ALIAS" \
  -file "$RUNNER_TEMP/tiny-wins-upload.der" >/dev/null 2>&1
node --input-type=module <<'JS'
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const expected = (process.env.TW_ANDROID_UPLOAD_CERT_SHA256 ?? '').replaceAll(':', '').toLowerCase();
const actual = createHash('sha256').update(readFileSync(`${process.env.RUNNER_TEMP}/tiny-wins-upload.der`)).digest('hex');
if (!/^[a-f0-9]{64}$/.test(expected) || actual !== expected) throw new Error('Upload certificate fingerprint not confirmed.');
JS
node scripts/prepare-android-release.mjs
cd android
./gradlew bundleRelease --no-daemon --console=plain --max-workers=2
cd ..
jarsigner -verify android/app/build/outputs/bundle/release/app-release.aab
keytool -printcert -rfc -jarfile android/app/build/outputs/bundle/release/app-release.aab > "$RUNNER_TEMP/tiny-wins-aab-cert.pem"
node --input-type=module <<'JS'
import { readFileSync } from 'node:fs';
import { X509Certificate } from 'node:crypto';
const cert = new X509Certificate(readFileSync(`${process.env.RUNNER_TEMP}/tiny-wins-aab-cert.pem`));
const expected = process.env.TW_ANDROID_UPLOAD_CERT_SHA256.replaceAll(':', '').toLowerCase();
if (cert.fingerprint256.replaceAll(':', '').toLowerCase() !== expected) throw new Error('AAB signing certificate mismatch.');
JS
unzip -Z1 android/app/build/outputs/bundle/release/app-release.aab | grep -Fx 'base/assets/index.android.bundle'
mkdir -p candidate
cp android/app/build/outputs/bundle/release/app-release.aab candidate/tiny-wins.aab
node --input-type=module <<'JS'
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const metadata = {
  source: process.env.GITHUB_SHA,
  package: process.env.TW_ANDROID_CONFIRMED_PACKAGE,
  versionCode: Number(process.env.TW_ANDROID_VERSION_CODE),
  versionName: JSON.parse(readFileSync('app.json')).expo.version,
  uploadCertificateSha256: process.env.TW_ANDROID_UPLOAD_CERT_SHA256,
  aabSha256: createHash('sha256').update(readFileSync('candidate/tiny-wins.aab')).digest('hex'),
  status: 'Built candidate only; Play upload, runtime/offline/update acceptance and distribution are pending.'
};
writeFileSync('candidate/metadata.json', JSON.stringify(metadata, null, 2) + '\n');
JS
