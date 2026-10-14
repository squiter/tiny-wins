# Task: 016 — Deliberate visual celebrations

Status: in progress
Goal: Make successful individual/today-complete check-ins feel rewarding and let the user disable celebration animation.
Non-goals: Audio, haptics, reminders, sync, quantity goals or new animation dependencies. Optional sound gets a separate dependency/platform slice.
Files/modules allowed: Pure feedback policy, completion outcomes/use cases, feedback provider, preference migration/repository, completion surfaces, Settings, tests/flows/docs.
Dependencies: Existing Reanimated only; additive preference column.
Acceptance criteria:

- Emit feedback from a successful changed completion outcome, never from merely reading/restoring/reloading data, failed writes or duplicate marks.
- Distinguish an individual win from completing all positive scheduled opportunities today; tolerated gaps/rest days never count as wins.
- Undo is static state restoration; re-completion can celebrate again. Past wins get individual feedback only.
- Saved animation switch defaults to enabled, respects OS reduced motion and survives restart. Off keeps static state/messages; re-enabling does not replay an old event.
- Feedback is brief, non-blocking and does not obscure controls. No new completion record is created by an effect.
- Update harness tasks/backlog/checks and ADRs with actual evidence and remaining native limitations.

Required tests: Deterministic outcome/policy tests; SQLite migration/reopen/preferences/backup preservation; browser event/disable/no-replay checks; native preference/restart flow; npm run verify.
Commands executed / results: `npm run verify` PASS: strict types, lint, formatting, 70 unit + 22 real SQLite integration tests and iOS/Android/web exports. Isolated browser localhost:8091 reviewed at 360/390 using six synthetic habits; owner localhost:8090 data untouched. Native flows added; fresh matching build/runtime pending.
Open questions: Sound remains in the plan; no audio dependency or permission is introduced in this slice.
Handoff summary: Implementation and local/browser checks complete; native acceptance remains in progress.

Browser evidence: animation-off saved through reload; undo/re-complete still updates the win and all-done copy with both sparkle styles at opacity 0. Re-enabling and changing appearance do not replay the event. Native flow verifies saved off through app restart and static completion.
