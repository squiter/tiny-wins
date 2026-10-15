# Task: 022 — Verified temporary tooling audit policy

Status: in progress
Goal: Apply the owner's conditional approval of a temporary patch policy after checking App Store requirements and production module reachability.
Non-goals: Store approval guarantee, release upload, general audit suppression, dependency downgrades or fabricated versions.
Files/modules allowed: Pure security-policy scripts/manifest, focused policy tests/fixture, Vitest discovery for mjs tests, generated report ignore, package script, CI audit job and harness/ADR/release evidence.
Dependencies: Existing Node/npm/Vitest only.
Acceptance criteria:

- Record Apple security responsibility and distinguish the npm scanner from App Review. Record source-map inspection and retain signed-candidate inspection as a release gate.
- CI production JS source-map inventory must exclude braces/node-forge and fail for missing/malformed inventory or affected modules. Retain signed-archive inspection as a separate release gate.
- Keep raw npm run security/report/nonzero result visible. CI uses a separately named policy check with expiry 2026-10-22T00:00:00Z.
- Allow only the two reviewed advisory IDs on exact patched packages/files, including proven derived alerts; reject unknown findings, malformed/missing audit data, scanner/network failures, tampered/missing patches and expiry.
- Require mitigation regressions and full verify before an exception passes CI. Hash/version manifest matches the reviewed ADR-020 bytes.
- Tests cover clean reports, current known findings, unknown/direct/derived alerts, cycles/missing roots, patch failures, invalid dates/reports and expiration.
- No auth, dependency, permission, app source or user-data change. Update ADR-020 with the conditional authorization and residual limitations; do not represent raw audit as clean.

Required tests: Deterministic policy tests, installed patch verification, raw audit exit/report, policy command, npm run verify, CI validation.
Commands executed / results: iOS production export with source maps PASS; 1,685 module sources, no braces/node-forge modules. This is JavaScript reachability evidence, not signed IPA inspection or guaranteed App Review acceptance.
Open questions: Signed archive and final runtime/network/privacy acceptance remain release gates.
Handoff summary: Separate security:policy command retains raw JSON/status and permits only exact reviewed patched sources/versions/paths/propagation until 2026-10-22T00:00:00Z. CI mitigation regressions run first; unknown/critical alerts, invalid scanner output, patch mismatch and expiry fail. Local policy PASS with raw audit exit 1 / 18 high. First sandboxed scanner request returned an error and correctly failed closed; real registry request succeeds with explicit policy exception. Tests discovered after adding mjs to Vitest include: 86 unit + 23 integration PASS, including 16 new policy cases and real patch-byte rejection. Final npm run verify PASS: 109 tests, strict checks and all platform exports. security:bundle PASS: 1,685 sources and no affected modules. Hosted CI pending. Signed-candidate package inspection remains a release gate; no App Review guarantee or upload.
