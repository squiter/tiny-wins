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

This Mac lacks the full native toolchains. Maestro flows are prepared but unexecuted; native restart/persistence, file dialogs, accessibility readers, enlarged system text and reduced-motion behavior require iPhone/Android acceptance. Browser SQLite is alpha and single-tab only.

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
