# Task: 011 — Streak flexibility

Status: in progress
Goal: per-habit automatic allowance for consecutive missed scheduled dates, renewed by a real win, with softly colored grace tiles.
Non-goals: weekly credits, fabricated completions, changed consistency denominator, notifications, retrospective policy edits.
Files/modules allowed: domain schedule/streak/history/backup, habit services/editor/calendars/inspector, deterministic and SQLite tests, Maestro flows, docs.
Dependencies: none added. Existing JSON schedule storage accepts an optional field; no destructive schema change.
Acceptance criteria: default zero preserves legacy behavior; advanced controls allow 0–7 scheduled misses; each real scheduled win renews allowance; rest/paused dates do not consume it; no grace before first win or for pending today/future; exceeding allowance breaks current streak; past grace tiles remain visible. Count real wins, never grace as a win. Effective changes begin tomorrow and preserve historical rules. Archive/restore retains allowance. Backups v2 retain settings and v1 remains importable. Accessible soft tile + distinct symbol/legend/inspection on Today, month/year/detail and Insights; exactly 14 Today dates. Verify deterministic edge cases and real SQLite reopen/legacy compatibility; run aggregate and hosted iOS E2E when available.
Required tests: npm run verify; matching hosted iOS simulator flows; browser editor/preview QA without altering owner history.
Commands executed / results: npm run verify passes 77 tests (59 unit, 18 integration), types/lint/format and all-platform exports. Browser on isolated localhost:8091 confirms Sunday/Tuesday bridge, soft Monday/○, unchanged actual-win percentage, 14 Today dates, grace inspection, and tolerance saved across reopen; owner data remains untouched. Hosted iOS result pending.
Open questions: physical-device accessibility, Android runtime and upstream audit remain separate gates.
Handoff summary: implementation, local and browser verification delivered; waiting for matching hosted iOS acceptance.

Native run 38558317364: both app compilations and hosted verify passed. First-win preserved undo/restart (failure screenshot/tree shows the expected 0-win label) but the label arrived beyond the standard assertion wait; use bounded post-restart waits. Advanced control incremented to 1 (captured label/copy), but the value/control lay below the visible viewport; explicitly scroll to controls/value and expose numeric Text to accessibility. Capture also shows editor header overlapping the iOS status bar; add a provider at each modal root before repeating acceptance.

Run 38562219217 confirms the safe-area repair visually. Both flows stopped at Maestro hideKeyboard: its heuristic tapped the Study icon while the software keyboard stayed open. Provide an explicit cross-platform Done typing action using Keyboard.dismiss; keyboard Done also dismisses instead of prematurely submitting the whole habit. Flows use this real control, keeping all assertions.
