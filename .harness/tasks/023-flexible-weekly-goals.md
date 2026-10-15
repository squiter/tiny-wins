# Task: 023 — Flexible weekly goals

Status: ready for ADR and scoped implementation
Goal: Let a habit aim for a number of completed days each week without choosing fixed weekdays.
Non-goals: Counting multiple wins per day, quantities, timers, notifications or changing existing daily schedules.
Files/modules allowed: Schedule and metric domain, versioned backup/storage adapters, editor, Today/detail/Insights, deterministic and real SQLite tests, native flows, docs/ADR.
Dependencies: No new dependency authorized. Record an ADR defining weekly boundaries, history and streak semantics before implementation.
Acceptance criteria:

- Choose a target of 1–7 completed days per week, with at most one win per local date.
- Show progress toward the weekly target and preserve exactly 14 date cells on Today.
- Keep existing daily/weekday habits and historical wins unchanged; schedule edits have an effective date.
- Define partial first weeks, pending current weeks, week boundaries and interaction with streak flexibility explicitly in the ADR and deterministic examples.
- Preserve existing weekly boundaries when the display week-start preference changes; no silent reinterpretation of history.
- Backup round trips retain weekly policies; older backups remain importable and atomic restore stays safe.
- Use accessible, non-color goal/completion cues and reduced-motion feedback without counting uncompleted dates as wins.

Required tests: Deterministic week/year boundary, timezone, partial-week, history/edit and goal/streak tests; real SQLite migration/reopen/backup; npm run verify; browser narrow/enlarged text and native create/check-in/restart flows.
Commands executed / results: Planning only, reordered ahead of timer by owner request on 2026-10-15. Prerequisite 018 is complete with local/hosted verification, both builds and ten-flow iPhone acceptance 38800367178. No weekly-goal implementation started.
Open questions: Resolve weekly streak and partial-week semantics in an ADR before selecting the implementation slice.
Handoff summary: Third in the approved sequence: languages → suggestions → weekly goals → timer. This task is not implemented.
