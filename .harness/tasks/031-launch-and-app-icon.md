# Task: 031 — Branded native launch and app icon

Status: complete
Goal: Replace the abrupt startup with a coherent native splash/loading-to-Today transition and configure the Tiny Wins launcher icon.
Non-goals: New onboarding, fake progress/delays, account/signing/store publishing, unrelated release changes or data migration.
Files/modules allowed: Branding vector/PNG assets and reproducible asset helper, shared startup UI/lifecycle, root layout/SQLite loading boundary, app icon/splash configuration and compatible Expo splash dependency, focused native acceptance and documentation.
Dependencies: Owner explicitly requested splash/loading and icon implementation on 2026-10-16, authorizing the necessary native branding configuration and compatible Expo splash dependency. Preserve task 028–030 and owner plan edits.
Acceptance criteria:

- Use the existing four rounded squares, sage/forest/apricot, consistently in launcher icon and launch UI; retain editable vector masters and correct adaptive safe area/monochrome icon.
- Native light/dark splash is visible during real initialization; branded loading fills font/SQLite gaps. Transition to usable content promptly, with no artificial minimum delay or fabricated progress.
- Respect reduced motion, localization, large text and recoverable startup errors; no infinite splash over the error screen.
- Compile/install a fresh standalone Android test APK and inspect real launcher/cold/warm launch, persistence, light/dark and offline behavior on the dedicated emulator. Record iOS limits honestly.
- Run npm run verify and appropriate native journeys; review app config/native generated resources and dependency/security implications without weakening gates.

Required tests: npm run verify; compatible dependency/security checks; native launch video/screenshots and first-win/restart; icon dimensions/alpha/safe-zone inspection; startup error/retry review.
Commands executed / results:

- `node scripts/generate-branding.mjs`: deterministic SVG/PNG assets; `npm run verify` PASS, 118 unit + 38 integration tests (156), types/lint/format and all exports.
- `npx expo prebuild --platform android --no-install` and iOS equivalent: generated native light/dark splash and icons. iOS prebuild is not an iOS build/runtime claim.
- `./gradlew assembleRelease --no-daemon --console=plain -PreactNativeArchitectures=arm64-v8a --max-workers=4`: PASS; final incremental build 38s. `adb install -r` PASS, existing synthetic record/win/note retained. APK bundled-source/hash inspection PASS, 1,783 Android production modules, no affected tooling or added permissions. Template development signature only.
- Serialized Maestro: launch-preserves-data 21s, launch-error 4s, launch-retry 4s and first-win 43s, all PASS offline on Android 16/API 36. Fault injection changed only the isolated synthetic database version, restored before retry. Recovery exposed and fixed cached-connection teardown race with a separate connection per provider lifetime; no migration changed.
- Actual native launcher/cold-launch videos and light/dark screenshots reviewed. Dark pt-BR per-app locale, 360 dp, font 150%, OS animations disabled PASS; warm resume returns existing task (33ms), no fake replay. Cold activity times 1,273ms light / 721ms dark are Android activity timing, not end-to-end readiness metrics.
- `npm run security:policy` PASS under existing owner exception (raw 18 high / 0 critical, expiry 2026-10-22); `npm run security:bundle` PASS. Final native sourcemap checked separately. No new permission or store credentials.
- Reports, source fingerprints and diagnostics: `.harness/evidence/031-launch/`; screenshots/video in `docs/screenshots/android-launch*` and `android-loading-dark-large.png`. Emulator settings restored; original synthetic fixture restored and app runnable without Metro.

Open questions: None for local implementation. Store signing/account and physical iOS/Android checks remain release work.
Handoff summary: Existing four-square identity configured throughout native launch and launcher; real loading, localization/motion/error recovery verified. Next release task remains owner Play account/signing and signed update acceptance (task 030); physical accessibility and new iOS runtime acceptance remain open. Prior task 028–030 and owner implementation-plan edits preserved.
