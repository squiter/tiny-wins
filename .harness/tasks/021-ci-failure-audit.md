# Task: 021 — Resolve current CI failures

Status: in progress (audit policy decision pending)
Goal: Establish current compilation/runtime results, reproduce the remaining failure and prepare a concrete remediation decision without hiding security findings.
Non-goals: Features, store setup, forced SDK downgrade, dependency renaming, automatic advisory exceptions or weakened security checks.
Files/modules allowed: CI audit evidence output, scoped proposed ADR, harness tasks/backlog and security/delivery/release evidence.
Dependencies: Existing npm/GitHub tools; no dependency changes.
Acceptance criteria:

- Inspect current main jobs/logs and native JUnit/screenshots; do not confuse an audit failure with compilation.
- Reproduce npm ci, npm run verify and raw npm security; verify existing mitigations and current upstream patched-version availability.
- Preserve raw high/critical failure semantics. Save the machine-readable audit as a CI artifact even on failure, without continue-on-error or exit-code suppression.
- Prepare a reviewable, explicitly unapproved policy proposal if patched installed source cannot be represented by version-based audit. Never activate exceptions without owner approval.
- Update final-source native evidence for tasks 015/020 only after reviewing actual artifacts.

Required tests: Clean install, aggregate verify, audit command exit status/JSON validity, native JUnit/capture review, workflow syntax/format/diff checks.
Commands executed / results: Clean npm ci PASS; npm run verify PASS (70 unit + 22 SQLite integration including mitigation regressions, types/lint/format, three exports). npm run --silent security -- --json exits 1 with valid JSON: 18 high / 0 moderate / 0 critical. Registry still reports braces 3.0.3 / node-forge 1.4.0; GitHub advisories list no patched release. ca24722 iOS/Android builds and eight-flow native JUnit/capture review PASS. Workflow audit remains blocking and now preserves its JSON artifact. Proposed ADR-020 includes exact patched-file hashes and expiration; unapproved, no exception implemented.
Open questions: No published corrected braces/node-forge release on 2026-10-15. Raw audit remains a release gate; a separately reviewed policy decision is required by ADR-012 before any exception.
Handoff summary: No security exception approved or applied.
