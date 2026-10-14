# Task: 013 — System and dark appearance

Status: in progress
Goal: Deliver the high-priority dark mode slice with saved System/Light/Dark selection.
Non-goals: Widgets, localization, custom themes or motion changes.
Files/modules allowed: Theme tokens/hooks, preferences domain/repository/provider/migration, app layouts/screens/components, tests, Maestro and documentation.
Dependencies: None added. Additive preference column only.
Acceptance criteria:

- Default follows system scheme and reacts to changes; explicit Light/Dark persists across restart.
- All screens, modals, navigation, inputs, feedback and errors use the selected palette.
- Habit colors retain their hue identities; solid wins, soft tolerance, pending/rest/future and note markers keep explicit cues.
- Text and state marks meet 4.5:1 contrast against relevant backgrounds; 48-point controls and larger text remain usable.
- Migration preserves habits, wins, notes and week-start selection. Backup restore does not replace device appearance.

Required tests: Pure preference resolution and contrast tests, real SQLite upgrade/reopen, browser visual review of Today/Insights/Settings/editors at 360/390, native restart preference flow when available, npm run verify.
Commands executed / results: `npm run verify` PASS: 66 unit + 20 integration tests, strict types/lint/format and all-platform exports. Contrast tests cover both palettes, text/actions and all habit hues/state cues. SQLite v5 upgrade/reopen preserves wins/notes/week-start; backup restore retains override. Browser localhost:8091: Dark selected, refresh retains Dark, Today/Insights/note/editor reviewed at 360/390; Light selection restores light palette without changing data. Screenshots in docs/screenshots/appearance-*. Native flow added, execution pending.
Open questions: Native screen-reader/enlarged-text and Android runtime evidence remain separate gates.
Handoff summary: Local and browser acceptance passed. Native appearance/restart acceptance will run with the matching app artifact.
