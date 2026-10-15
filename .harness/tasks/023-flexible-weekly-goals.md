# Task: 023 — Flexible weekly goals

Status: in progress
Goal: Let a habit aim for a number of completed days each week without choosing fixed weekdays.
Non-goals: Counting multiple wins per day, quantities, timers, notifications or changing existing daily schedules.
Files/modules allowed: Schedule and metric domain, versioned backup/storage adapters, editor, Today/detail/Insights, deterministic and real SQLite tests, native flows, docs/ADR.
Dependencies: No new dependency authorized. ADR-022 defines fixed saved boundaries, capped short-week targets, week-based streaks, closed-week consistency and effective changes; implement without new packages or destructive schema.
Acceptance criteria:

- Choose a target of 1–7 completed days per week, with at most one win per local date.
- Show progress toward the weekly target and preserve exactly 14 date cells on Today.
- Keep existing daily/weekday habits and historical wins unchanged; schedule edits have an effective date.
- Define partial first weeks, pending current weeks, week boundaries and interaction with streak flexibility explicitly in the ADR and deterministic examples.
- Preserve existing weekly boundaries when the display week-start preference changes; no silent reinterpretation of history.
- Backup round trips retain weekly policies; older backups remain importable and atomic restore stays safe.
- Use accessible, non-color goal/completion cues and reduced-motion feedback without counting uncompleted dates as wins.

Required tests: Deterministic week/year boundary, timezone, partial-week, history/edit and goal/streak tests; real SQLite migration/reopen/backup; npm run verify; browser narrow/enlarged text and native create/check-in/restart flows.
Commands executed / results: ADR-022 recorded before implementation. Implemented pure weekly evaluator, effective policies, weekly streaks/closed-week assessment, neutral flexible tiles, editor/progress UI, archive/restore preservation and backup v4. Migration 9 advances metadata only to protect against older app interpretation; real SQLite v8 upgrade preserves legacy JSON bytes. Local npm run verify PASS on the implementation: 115 unit + 26 integration tests including real SQLite (141 total), strict types/lint/format and all platform exports. New future-version guard fixture uses 10, since 9 is now supported; retains rejection and asserts stored user records unchanged. Final matching-source hosted evidence follows.

Browser evidence: isolated synthetic 8092, English/Portuguese; goal creation/check-in/reload, saved target edit beginning Oct 19 while the current Oct 12–18 goal stays intact, unchanged names through language changes, Sunday calendar display with preserved Monday policy and distinct newly created Sunday weekly policy. Target upper bound disabled at 7; a new seven-day goal caps at three available Thursday–Saturday dates. Reviewed 390/360 layouts and exactly 13 historical buttons plus today's cell. Final screenshots/evidence and cancel/archive/restore/Insights review pending closure.

Native harness: retains all ten previous cases and adds weekly-goals.yaml for create/win/restart/future edit/undo/restart; OS-Portuguese enlarged-text review includes weekly configuration. Job cap is 55 minutes (last ten-case baseline 42m45s, plus focused weekly interactions); assertion deadlines unchanged. A compact JUnit/readback/screenshot artifact complements, rather than replaces, full diagnostics. Hosted native compilation/runtime pending; no physical/Android-runtime claim.
Open questions: Finish matching-source native/browser visual acceptance. Physical screen readers, Android runtime, native file dialogs and signed-release checks remain separate release gates. No new dependency or permission needed. Owner implementation-plan edits are untouched.
Handoff summary: Weekly goals precede timer 024. All user wins stay binary and on their original dates. Do not mark complete until required acceptance is actually green.
