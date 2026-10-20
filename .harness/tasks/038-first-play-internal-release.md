# Task: 038 — Revalidate and create first Play internal test

Status: in progress — original candidate superseded; task 039 fixes native tab geometry
Goal: Revalidate the prepared Android candidate, register Tiny Wins as paid with internal testing only, and provide verified installation/share instructions.
Non-goals: Production rollout, choosing/charging a public price, weakening security gates, unrelated feature work or exposing upload credentials.
Files/modules allowed: Focused release validation/evidence, this task, existing release documentation; preserve all prior dirty release/owner roadmap changes.
Dependencies: Owner explicitly requested revalidation and internal-test release on 2026-10-20. Prior identity verification is complete; Firefox Console allows first-app creation. Existing owner preference is a paid app with free internal testing. Legally binding Play terms require action-time owner confirmation under computer-use policy.
Acceptance criteria:

- Fresh npm run verify and applicable security checks pass without weakening the existing policy.
- Verify candidate hash, upload certificate, package/version, bundled runtime provenance and native Android acceptance; distinguish emulator and Play-delivered evidence.
- Register the same package only after availability is checked, retain Paid model and limit rollout to internal testing.
- Inspect the actual Console release state and errors; record publication/processing/tester prerequisites honestly.
- Provide exact opt-in/install/update instructions and the verified tester link when available; never invent tester email addresses or claim delivery not observed.

Required tests: verify/security, candidate signature/provenance and native acceptance, real Console/readback.
Commands executed / results:

- `npm run verify` PASS: 118 unit + 57 integration tests (including real SQLite), types, lint, formatting and Android/iOS/web exports. Logs in `.harness/evidence/038-play`.
- `npm run security:policy` PASS under the existing reviewed tooling exception (18 high/0 critical; expires 2026-10-22T00:00:00Z). `npm run security:bundle` PASS: 1701 fresh iOS production modules; native Android source map inspection: 1783 modules, no affected tooling modules.
- Actual Java runtime verified as Homebrew OpenJDK 25.0.1 despite the openjdk@21 filesystem alias. Official bundletool 1.18.3 `validate`, manifest dump, ZIP integrity, `jarsigner -verify`, public-certificate SHA comparison and AAB/runtime byte hashes PASS. Retained upload-certificate/self-signing, timestamp, POSIX and streaming manifest-order warnings; bundletool accepts the original AAB and produces APKs successfully. Original upload-signed AAB remains unchanged.
- Compared source/assets/dependencies/native configuration with candidate source 1101b28: unchanged. The runtime in the AAB, preserved native release APK and new emulator APK matches exactly.
- Official Maestro 2.11.0 archive digest verified. Running native acceptance on a new isolated API 29 ARM64 Pixel 3a emulator, with Wi-Fi/mobile data off and no Metro reverse. APK derives directly from the AAB using a temporary test-only signing key; no real upload-key access required.
- Firefox Console: account permits creation; exact package availability confirmed; App/Paid/pt-BR form prepared. Three legal declarations remain unchecked. Requested action-time owner confirmation; no app creation, AAB upload, tester invitation or store release performed yet.
- Added Portuguese tester guide and updated the Play guide's current account checkpoint; relative document links, targeted Prettier and `git diff --check` PASS. Preserved unrelated source/workflow/owner roadmap changes.
  Open questions: Owner's required legal confirmations at submission time; testers list and Play-delivered pilot acceptance.
  Handoff summary: Native visual review found a release-blocking normal-font three-button navigation defect. Task 039 prepares a corrected signed candidate. Do not upload the original version-code 1 AAB. Legal confirmation and the optional task 040 dependency decision remain pending; no app/release has been created. Layout correction is published (2563e3d), portable release-helper fix published (c9e1ef2); beta.2 run 39495461832 is generating the replacement. After download, verify artifact and native upgrade before Play upload.
