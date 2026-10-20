# Task: 041 — Make the signed archive check portable on hosted runners

Status: in progress
Goal: Let the existing protected Android workflow finish its verified candidate after a successful native build, without requiring ripgrep on the hosted runner.
Non-goals: App dependency/permission changes, weakening archive/signature checks, changing credential scope, publishing to Play or retagging an existing release.
Files/modules allowed: scripts/build-android-candidate.sh, this task and focused evidence/release documentation.
Dependencies: Owner requested the internal-test version. Run 39490972112 attempt 2 completed the native build (21m57s), verified the signed JAR/certificate, then failed at the archive-entry check because `rg` is absent on ubuntu-latest. The failure occurred before candidate metadata/artifact upload; no AAB is downloadable from that attempt.
Acceptance criteria:

- Keep the runtime-entry gate and fail-closed shell semantics, using standard tools already on the runner; no dependency installation.
- Confirm the archive check accepts the real AAB and rejects a synthetic ZIP missing the runtime with a minimal standard PATH.
- Run aggregate verification, review the focused diff and publish only this compatibility fix/task, preserving other dirty files.
- Create a new immutable beta tag and obtain the signed AAB/metadata through the unchanged restricted workflow; validate its identity/certificate/hash before task 039 native acceptance.

Required tests: Positive/negative archive-entry checks, npm run verify, protected hosted candidate build and artifact identity inspection. App UI/source is unchanged from 2563e3d; native acceptance belongs to task 039.
Commands executed / results:

- Replaced the ripgrep command with `grep -Fx`, keeping the exact path match and `set -euo pipefail` failure semantics. No dependency or permission added.
- Executed the actual helper archive-entry command against a positive synthetic ZIP and a missing-runtime negative ZIP with PATH=/usr/bin:/bin: PASS. Original real AAB also passes the exact entry check.
- `npm run verify` PASS: 118 unit + 57 integration tests, types/lint/format and all exports. Reviewed one-line script diff; no app/native inputs changed from 2563e3d.
- Published focused helper/task commit c9e1ef2 and immutable tag android-v0.1.0-beta.2. New protected run 39495461832 (run number 3, expected versionCode 100003) is in progress; PLAY_INTERNAL_ENABLED freshly confirmed false. No native/app inputs differ from 2563e3d.
- Cancelled only the redundant helper-only Android/iOS development builds 39495456195/39495456129; same app's native builds at 2563e3d already PASS. Keep protected release build, Validate and the existing UI-revision iOS smoke running. Do not report cancellations as passes.
- New hosted release artifact/metadata acceptance pending; preserve both failed beta.1 attempts and their logs.
  Open questions: Play legal confirmation and optional system-navigation contrast dependency remain pending under tasks 038/040. No Play rollout attempted.
  Handoff summary: Do not retry the unchanged failing script or move android-v0.1.0-beta.1; publish the portable check in a new beta revision.
