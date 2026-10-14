# Task: 009 — CI diagnosis and dependency remediation

Status: implemented and locally verified; upstream audit/native hosted gates remain open
Goal: diagnose each GitHub job, fix compatible dependency vulnerabilities and retain meaningful security gates.
Non-goals: forced Expo/RN downgrade, audit suppression, signed/store release, Insights UI implementation.
Files/modules allowed: dependencies/lockfile, guarded dependency patches with regression tests, CI workflows, harness/docs.
Dependencies: changes explicitly authorized by owner request to fix vulnerabilities.
Acceptance criteria: record exact failing jobs; fix available findings with verified compatibility; test any local mitigation against the vulnerable installed source; preserve failing audit for upstream packages without released fixes; avoid duplicate native builds; verify clean install and all-platform exports; publish direct main commits.
Required tests: actual affected dependency behavior, existing aggregate gate, native prebuild/build CI where available.
Commands executed / results: initial audit 33 findings (18 high, 15 moderate); Validate failure isolated to dependency-audit, native builds still running or superseded/cancelled.
Open questions: braces/node-forge advisories report no patched published versions; keep this distinction visible.
Handoff summary: 15 moderate findings eliminated; two guarded local high-severity root mitigations reproduce and reject the vulnerable behaviors, while raw audit retains 18 propagated high alerts. Clean Node 24/26 gates pass (64 tests), native prebuilds pass, browser Router/date inspection passes. Next hosted runs verify compilation; Insights task 008 remains planned. See docs/CI_SECURITY_REPORT.md and ADR-012.
