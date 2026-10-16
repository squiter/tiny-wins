# ADR-024: Google Play internal testing and signing continuity

Status: accepted for preparation, 2026-10-16. The owner explicitly requested official Android testing preparation, has no Google developer account and chose Google Play after disclosure of the one-time US$25 registration fee. No payment, agreement acceptance or publication is authorized by this preparation.

Use the Google Play **internal testing track**, followed by closed testing/production when ready. Friends join using the Google account registered as a tester and install/update through Google Play. Do not use Internal App Sharing as the durable beta channel: its separate signing can break the intended production update path. No app login, purchase SDK or telemetry is added.

The free Android Developer Console limited account is intended for noncommercial hobby/learning apps on up to 20 authorized devices and accepts only previously unseen package names. Tiny Wins has a planned official commercial release; the owner chose Play Console instead. Limited distribution is neither a Play storefront nor a substitute for its account.

Generate a release Android App Bundle using the existing GitHub/Expo/Gradle toolchain, with embedded JS/assets and no Metro dependency. The new manual-only workflow requires explicit package and version-code inputs and owner-provided upload credentials/fingerprint; it builds an artifact only. It does not create an account, upload a bundle, notify testers or roll out any track. Keep the existing debug build workflow unchanged.

Keep one final application ID across internal/closed/production. The current app.tinywins.mobile remains provisional until ownership/registration is confirmed; this task does not change app.json or register it. Use Google-managed Play App Signing from the first Play-distributed build. The CI upload key authenticates uploads; it is not the certificate of APKs delivered by Google. Never distribute a debug/upload-key-signed APK as if it had the Google-managed app signature. If an APK is needed outside Play later, obtain Google's signed universal APK or explicitly plan signing continuity before distribution.

Every upload needs a higher unused version code; the owner selects it from Play history because this manual workflow has no Play credentials/API access. Same identity/signature and compatible SQLite migrations allow updates to retain local data. Verify internal build N → N+1 without uninstalling, including notes, wins, archived/weekly history and preferences, then verify track promotion before promising continuity. Backup export remains a fallback; reinstalling or clearing app storage can erase local records. Pricing/access to a future paid Android listing remains an owner decision; beta participation does not itself grant a paid production license.

Signed artifact/runtime/offline/update/security acceptance remains a gate. A passing source/export check does not certify an AAB or Play-delivered APK. No permanent keys are generated here; credentials must be backed up privately and never committed or placed in artifacts. Existing temporary security policy expiry is preserved.

Sources checked 2026-10-16:

- https://developer.android.com/developer-verification/guides/limited-distribution
- https://support.google.com/android-developer-console/answer/17131204
- https://support.google.com/googleplay/android-developer/answer/9845334
- https://support.google.com/googleplay/android-developer/answer/9842756
- https://developer.android.com/google/play/app-updates
- https://support.google.com/googleplay/android-developer/answer/6112435
- https://support.google.com/googleplay/android-developer/answer/14151465
- https://support.google.com/googleplay/android-developer/answer/14316361
