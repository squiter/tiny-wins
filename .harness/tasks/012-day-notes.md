# Task: 012 — Contextual day notes

Status: in progress
Goal: Save a short plain-text note for each habit/date through the day inspector.
Non-goals: Rich journal, reminders, widgets, synchronization, translated interface.
Files/modules allowed: Domain notes/backups/calendars, habit repository and SQLite adapter, day inspector and calendar surfaces, backup controls, tests/flows/docs.
Dependencies: None added. Additive SQLite migration only.
Acceptance criteria:

- One optional note per habit/local date, maximum 280 characters; explicit save, clear and cancel preserve completion independently.
- Active habits allow notes from creation through today, including rest days. Archived histories display saved notes without editing. No future/pre-creation notes.
- Notes remain on their original dates after schedule changes, win/undo, archive/restore and restart.
- Every calendar surface shows a non-color note marker and accessible description; Today retains exactly 14 cells.
- Backup v3 includes validated notes; v1/v2 import with no notes; restore adds missing notes, preserves existing text and remains atomic/idempotent.
- Keyboard-safe scrollable inspector, 48-point actions; no additional animation.

Required tests: Deterministic date/validation/backup tests; real SQLite migration, reopen, independent win/undo and merge rollback; browser 360/390 visual/reopen acceptance; hosted native flow when available; npm run verify.

Commands executed / results: `npm run verify` PASS: 63 unit + 19 integration tests, strict types/lint/format and iOS/Android/web exports. Browser localhost:8091 QA: note save/cancel/reload, mark/undo independent, Today exactly 14 dates, Insights inspection, 360/390 screenshots. Exported JSON v3 includes original note/date; selecting and restoring it reports 0 added records (idempotent).

Open questions: Native accessibility and Android runtime remain separate acceptance gates.

Handoff summary: Local and browser gates pass. Hosted native note/restart/clear flow added; execution pending. Owner planning edits in IMPLEMENTATION_PLAN.md are preserved unstaged.
