# Task: 030 — Prepare Google Play internal testing

Status: complete — repository preparation only; account/signing/Play acceptance pending
Goal: Prepare a signed standalone Android App Bundle build path and owner/tester instructions for official Google Play internal testing when the app is ready.
Non-goals: Account registration/payment, agreement acceptance, publishing, inviting testers, generating permanent credentials, app UI/data changes, or continuing task 029.
Files/modules allowed: New manual Android candidate workflow, release helper/Gradle configuration and integration tests, Git ignore rules, this task, release guide/ADR and additive backlog entry. Preserve existing concurrent changes.
Dependencies: Owner has no Google developer account. Owner explicitly chose Google Play preparation and acknowledged the one-time US$25 fee on 2026-10-16. Credentials, final package ownership, account verification and signed-device acceptance remain external prerequisites.
Acceptance criteria:

- Document why free limited distribution is not the recommended path for the planned commercial app; distinguish internal testing from internal app sharing and production eligibility.
- Provide a manual-only workflow configured to produce a signed release AAB with bundled JavaScript, explicit package confirmation and monotonically chosen version code; no debug-signing fallback, uploads to Play or new dependencies.
- Keep upload credentials out of source/logs/artifacts and separate upload signing from Google-managed app signing.
- Explain continuity of local records through internal → production updates, with required same app/signing identity and a real update test before any claim.
- Provide Portuguese owner setup, tester instructions and exact remaining gates, including physical Android account verification.
- Validate helper failure cases and run npm run verify; document unexecuted signing/build/Play checks honestly.

Required tests: Release preparation integration tests; npm run verify; workflow and diff review. A real signed AAB build/upload/install/update remains pending account/credentials and app readiness.
Commands executed / results:

- `npx vitest run tests/integration/android-release.test.mjs`: PASS, 8 tests; validates credential-free/idempotent setup and rejects missing credentials/debug alias, invalid version codes, wrong app identity and stale generated identity before editing native inputs.
- `npm run verify`: PASS, strict types/lint/format, 115 unit + 34 integration tests (149 total; existing 26 real-SQLite/security integration cases plus 8 release preparation cases), iOS/Android/web JS exports. Log: /private/tmp/tiny-wins-play-preparation-030-verify.log.
- Node YAML parser with unique keys: PASS; manual-only workflow trigger and read-only repository permissions checked.
- `bash -n /private/tmp/tiny-wins-play-030-build-step.sh`, `node --check scripts/prepare-android-release.mjs`, `git diff --check`: PASS.
- Local Java 17 `keytool -printcert --help` confirms the signed-archive certificate extraction options used in the workflow.
- Diff reviewed: new build/release files, credential ignore rules and additive backlog entry only. Existing Android debug workflow, app.json, dependency files, UI, emulator state and owner plan edits are untouched by task 030.
- Not executed: permanent key creation, real Gradle signed AAB build, GitHub workflow dispatch, account registration/payment, Play App Signing, upload, tester invite/install/offline/update. No signing credentials or Play account exist for this slice. AAB workflow is prepared and statically checked, not claimed as a successful native build.
- No device E2E for this preparation: no UI/persistence change; task 029 remains independent in the main chat.
  Open questions: Final package registration/ownership, upload credentials, Android pricing, account verification and release readiness.
  Handoff summary: New manual candidate workflow, guarded Expo-generated Gradle signing override, eight regression cases and Portuguese Google Play guide are prepared locally. Owner next creates/verifies the Play Console account and confirms the final package. Then create/back up upload credentials privately, configure GitHub secrets/fingerprint, review/publish these source changes to GitHub, compile an actual candidate, upload to internal testing and validate the Play-delivered update on a pilot physical device before rollout. No account, payment, agreement, upload, launch or link is complete.
