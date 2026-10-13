# Task: 003 — Compact Today and habit management

Status: verified locally and in browser; native/security gates remain open

Goal: apply docs/inspirations' compact, warm design direction and deliver icon selection, rename/color editing, archive/restore and accessible ordering.
Non-goals: schedules, detail/insights, historical editing, release, backend, new dependencies.
Files/modules allowed: domain/features/database, Today/components/theme, tests, docs and harness.
Dependencies: existing Expo stack; additive schema v2 migration only.
Acceptance criteria: existing v1 data survives; edits retain dates/check-ins; archive hides a habit without deleting history; restore retains history; move up/down persists ordering; exactly 14 days and one-tap check-in; layout remains readable at 360px/390px; no placeholder navigation.
Required tests: file-backed upgrade/reopen, edit/archive/restore/order validation, unchanged calendar tests; visible browser journey and screenshots; npm run verify.
Commands executed / results: clean npm ci + npm run verify on Node 24 passed (25 tests and all-platform exports). Browser edit/archive/restore/order/reload journeys passed. v1 data survived the live migration. The worker regression failed before the guarded fix and passed after. See docs/HABIT_MANAGEMENT_REPORT.md.
Open questions: native validation and dependency audit remain open from bootstrap.
Handoff summary: preview updated and retained with six demonstration habits. Core management is complete for daily habits. Next product slice is weekday scheduling; native/large-text/accessibility and dependency security acceptance remain open.
