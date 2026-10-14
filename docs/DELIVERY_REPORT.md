# Tiny Wins delivery evidence

Implementation follows the supplied plan and the design board in `docs/inspirations`, keeping the ivory/forest palette, editorial headings, colored habit identity and compact Today list.

## Delivered

- Habit creation, name/icon/color editing, reordering, archive and restore with retained history.
- Daily/selected weekdays, effective schedule changes from tomorrow, pause intervals and eligible-day streaks.
- Today/Insights/Settings destinations; monthly and 365/366-day yearly detail; explicit confirmation to edit past eligible wins.
- Versioned JSON export and reviewed atomic merge restore. Existing names, order, schedules and wins stay intact; repeated import adds no duplicates.
- SQLite migrations through version 3, bounded repository reads, guarded Expo SQLite web worker repair and fresh typed-route generation.
- Public GitHub repository, locked dependencies, Node 24 validation/audit, Android debug and unsigned iOS simulator build workflows with pinned actions.

## Actual verification

`npm run verify` passes strict types, lint, formatting, 43 unit tests, 12 real SQLite/worker integration tests and production JS exports for all platforms. Tests include schedules, leap years, eligibility, backup malformed input, atomic rollback, repeated restore, close/reopen, legacy migration and 205-record pagination.

Browser review confirms persisted schedule edits, explicit day undo/re-mark, real aggregate metrics and readable detail/insights at 390/360 px. An exported demo backup reopened with six habits and three wins, and confirmed restore reported zero habits/zero wins added. Screenshots: `screenshots/progress-390.png`, `screenshots/insights-360.png`, `screenshots/backup-390.png`. This is preview evidence, not native runtime evidence.

Android native compilation **passed** on commit `d5af507`: [run 38486599080](https://github.com/squiter/tiny-wins/actions/runs/38486599080), artifact `tiny-wins-android-debug`. This precedes the new backup native dependencies; the next push triggers a fresh build. iOS workflow compiles the generated TinyWins workspace on macOS 26 and has not yet been observed passing. Debug/simulator artifacts need Metro; neither is a store release.

## Open gates

Dependency audit reports 33 findings (18 high, 15 moderate) in the current dependency tree. Its separate CI job intentionally fails; verification success is not a security pass. No unsafe forced downgrade or blanket suppression was applied.

Expo Doctor passes 20/21 checks; the remaining native tooling check reports missing CocoaPods (recommended 1.15.2+). Dependency compatibility passed. Hosted Node 24 verification also passed on `d5af507` in run 38486599035; its overall failure comes from the separate audit job.

This Mac lacks the full native toolchains. At initial delivery, Maestro flows were prepared but unexecuted; iOS restart/management acceptance now passes in task 010 below. Native file dialogs, accessibility readers, enlarged system text, reduced-motion behavior and Android runtime remain unverified. Browser SQLite is alpha and single-tab only.

Backup limits: 5 MiB, 500 habits, 50,000 wins, 200 schedule versions per habit. Merge retains existing metadata and rejects conflicting creation dates atomically. See ADR-010.

License, final bundle identifiers, trademark rights, paid store price and signing/store accounts remain owner decisions. No release or store publication was performed.

## Completion feedback refinement

Task 006 replaces the ambiguous Insights glyph with a drawn bar chart. Check-ins pulse the check control and animate the daily progress fill. The final scheduled win changes banner color/icon/copy, while undo immediately returns to pending progress. Reopening a completed day retains the completed message without replaying the transition pulse; a zero-opportunity day never counts as complete. New animations respect the system reduced-motion setting.

Reorder arrows replace existing icon/check slots, avoiding the extra row that changed every card's height. Browser bounds are identical before/after entering the mode, and moving up/down remains functional. 360 px evidence: `screenshots/day-complete-360.png`, `screenshots/reorder-stable-360.png`. The original demo order and three wins were restored after QA. Native motion/accessibility acceptance remains pending.

The Android build including backup modules passed on `01501e9`: [run 38491267666](https://github.com/squiter/tiny-wins/actions/runs/38491267666). This precedes the feedback refinement. iOS build was still running at this review.

## Direct main delivery and calendar preferences

PR #1 was merged at the owner's request (merge commit `818295f`), and subsequent prototype work uses locally verified direct main commits. Contributing guidance records this preference; no new PR is required for owner work.

Task 007 adds saved Sunday/Monday calendar layout preferences. Migration v4 adds a constrained singleton row without rewriting habit/completion data. Monthly and yearly grids share pure label/offset logic. Version 1 habit backups do not replace device presentation preferences.

Validation: 61 tests (47 unit, 14 integration), strict types/lint/format and all-platform exports; browser Sunday selection survives reload and keeps six habits/three wins. No additional dependency. Native runtime, dependency audit, licensing and store gates remain as described above.

## Security follow-up

Task 009 removed all 15 moderate audit findings and added tested, guarded local mitigations for the two high-severity root advisories. Raw audit retains 18 propagated high alerts because upstream corrected releases are unavailable; no suppression was applied. Clean Node 24/26 verification passes 64 tests and all-platform exports. Current evidence and limits are in CI_SECURITY_REPORT.md and ADR-012. Insights victory tiles are planned in task 008 per the owner reference, and deferred for this slice.

## Insights victory walls

Task 008 / ADR-013 delivers the requested per-habit binary wall as the primary Insights surface, with Year default, Week/Month, aligned period navigation and Today. Only real wins fill tiles; archived histories persist and rest/future/pre-creation states remain distinct. Explicit date confirmation uses the existing service and names the habit.

Validation: 71 tests (54 unit, 17 integration), strict types/lint/format and all-platform exports. Browser confirms 365 dates in the annual wall, month/week layouts, explicit undo/re-mark and preservation of the original six habits/three wins. Screenshots: `screenshots/insights-tiles-year-390.png`, `screenshots/insights-tiles-month-360.png`. Annual tiny tiles have a larger calendar alternative; native screen-reader, enlarged text and motion acceptance remain pending. Security audit retains its documented upstream blockers.

## Native compilation and simulator acceptance

iOS [run 38495190148](https://github.com/squiter/tiny-wins/actions/runs/38495190148) and Android [run 38495190217](https://github.com/squiter/tiny-wins/actions/runs/38495190217) both compiled successfully on `886e0a7`. The same commit’s verify job passed; its audit job failed on the documented upstream version findings. Task 010 adds a matching-artifact iPhone simulator smoke gate with pinned Maestro, local Metro and persistent test diagnostics. Execution status is recorded in task 010; physical-device/accessibility and Android runtime remain separate gates.

## iOS runtime gate follow-up

Task 010 adds a pinned, isolated Maestro simulator workflow with matching-artifact validation, local Metro, JUnit and retained diagnostics. Real iPhone 17 Pro / iOS 26.5 execution exposed cold bundle startup timing and a habit-button accessibility label that omitted the visible streak. The label now includes the streak/schedule, and flows assert the complete habit/streak label across restarts; cold bundling is prepared before interaction. No habit storage or dependency changes.

`npm run verify` passes 71 tests and all platform exports on `7f390cc`; hosted verification also passed in [run 38512075828](https://github.com/squiter/tiny-wins/actions/runs/38512075828). The separate dependency audit retains its documented failures. Both [iOS compilation](https://github.com/squiter/tiny-wins/actions/runs/38512075736) and [Android compilation](https://github.com/squiter/tiny-wins/actions/runs/38512075726) passed on this commit. Runtime [run 38513101044](https://github.com/squiter/tiny-wins/actions/runs/38513101044): management PASSED, including retained streak across restarts/archive/restore; first-win failed at an early cold-start editor tap. The targeted startup repair is recorded in task 010. Final [run 38515314849](https://github.com/squiter/tiny-wins/actions/runs/38515314849) PASSED both first-win and management on iPhone 17 Pro / iOS 26.5, with JUnit reporting zero failures. Reviewed screenshot: `screenshots/ios-smoke-accepted.png`, confirming retained order, renamed habit, win and 14-date rows. The tested workflow commit is `5157553` and its matching app artifact is `7f390cc`. Physical-device accessibility, backup file dialogs and Android runtime remain unverified.

## Streak flexibility

Task 011 / ADR-015 adds advanced per-habit tolerance (0–7 consecutive missing scheduled dates), renewed by a real eligible win. Current/best streak share the chronological evaluator, and count actual wins. Grace dates remain softly colored with ○ and explicit accessible/inspection descriptions on Today, Insights and month/year calendars. Today's unfinished date remains pending; rest/pause dates spend no allowance. Total wins, daily celebration and consistency remain based on completions. Existing zero-default data and original dates remain intact; policy edits begin tomorrow. Backups v2 preserve settings and v1 remains importable. No new dependency or destructive schema change.

`npm run verify` passes 77 tests (59 unit, 18 real SQLite/worker/integration), strict types/lint/format and all-platform exports. SQLite tests cover legacy JSON unchanged, reopen, pause/restore, future policy versions and v2 backup/restore. Browser QA uses isolated localhost:8091 and a synthetic Sunday/Tuesday scenario, preserving the owner's localhost:8090 data: two wins, a soft Monday tile, 50% consistency through pending Wednesday, exact 14 Today dates, explicit day inspection and saved tolerance after reopening. Screenshots: `screenshots/streak-flexibility-today-390.png`, `screenshots/streak-flexibility-editor-desktop.png`, `screenshots/streak-flexibility-insights-360.png`. Hosted iOS [run 38565803661](https://github.com/squiter/tiny-wins/actions/runs/38565803661) PASSED both flows on `37e0f1d`, including advanced tolerance creation/edit retention and persistence through restart/archive/restore. Both native compilations and hosted verify passed; the separate audit remained red. Native captures `screenshots/streak-flexibility-ios-editor.png` and `screenshots/streak-flexibility-ios-controls.png` confirm modal safe areas and visible controls. The editor now offers Done typing; keyboard Done dismisses without prematurely saving. Historical grace rendering has browser/domain/SQLite evidence; it was not seeded in the native smoke scenario. Physical accessibility/Android runtime and upstream audit remain separate gates.
