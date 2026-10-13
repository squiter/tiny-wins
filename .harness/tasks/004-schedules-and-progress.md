# Task: 004 — Schedules, habit detail and insights

Status: verified locally and in browser; native build is tracked separately
Goal: deliver selected weekdays, date-aligned progress/detail and aggregate insights using pure tested metrics.
Non-goals: backend, authentication, notifications, paid features, release.
Files/modules allowed: domain/database/features, routes/components/theme, tests, docs/harness/CI.
Acceptance criteria: daily and selected-weekday schedules; edits affect only tomorrow onward; unscheduled dates do not break streaks; yearly grid has 365/366 dates; metrics exclude future/pre-creation/unscheduled dates; today remains one-tap; previous data survives migrations; working Today/Insights/Settings destinations with no placeholders.
Required tests: schedule/date eligibility, pending scheduled-day streaks, best streak, weighted consistency, leap-year grids, versioned schedule persistence/reopen, native exports and visible browser flows.
Commands/results: npm run verify passed (40 tests, all-platform exports); visible monthly/yearly detail (365 cells), explicit date undo/re-mark, persisted weekday changes and real insights passed. GitHub verify job passed on the baseline; dependency audit remains failing.
Handoff: effective weekdays, date inspection/editing, Today/Insights/Settings and progress metrics implemented. Continue backup portability and native build verification.
