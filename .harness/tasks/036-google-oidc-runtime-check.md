# Task: 036 — Validate GitHub → Google OIDC at runtime

Status: in progress
Goal: Prove the restricted GitHub release identity can mint a short-lived Google access token in a real hosted Action.
Non-goals: Play API edits/upload, enabling publishing, signing/building an AAB, broadening Google trust, changing prior audit work or owner plan edits.
Files/modules allowed: Android release workflow and its already prepared helper/test dependencies, focused test assertions and runtime evidence/documentation.
Dependencies: Owner requested this authentication test after explicitly authorizing the restricted Google identity binding. Existing Google condition requires the exact release workflow path, android-v* tag and android-publish environment.
Acceptance criteria:

- Keep the exact existing Google trust. Add a manual-only probe in the release workflow; restrict it to dedicated android-voidc-check-* tags, excluded from automatic release pushes.
- Ensure diagnostic execution skips verification/build/publish jobs, uses no signing secrets, uploads no artifacts and prints no token.
- Publish only the required workflow/dependencies and test on a fresh immutable diagnostic tag from main.
- Verify a real hosted Google auth step succeeds and returns a nonempty short-lived token; preserve safe run metadata only.
- Verify PLAY_INTERNAL_ENABLED stays false and report that Play permissions/publication remain untested.

Required tests: Workflow security regressions, npm run verify, staged diff checks, hosted run/job/step readback and safe-log inspection.
Commands executed / results:

- Main workspace verify stopped at formatting of the concurrent security-audit report; it was left untouched. Prepared an isolated publication snapshot from HEAD plus only the required workflow/helpers/tests/docs.
- Snapshot initially used the shell's old Node 22 runtime, exposing require(ESM)/SQLite failures; diagnosed runtime mismatch and selected Node 26 (project requires >=24). No dependency changes or weakened assertions.
- Final isolated `npm run verify`: PASS, 118 unit + 55 integration tests, types/lint/format and iOS/Android/web exports. Log: /private/tmp/tiny-wins-oidc-036-snapshot-verify.log.
- Shell/JS syntax and diff checks PASS. Workflow probe uses identical Google auth settings to publish; source/tag guard, no signing secrets/artifact uploads and release exclusion covered by regression test.
- Remote main confirmed at 1101b2881b301929ba8ca91b0c11f4d4a2d05bdf before publication. Runtime proof pending the authorized workflow dispatch.
  Open questions: Initial Play app/permissions and pilot remain task 034 prerequisites.
  Handoff summary: Pending.
