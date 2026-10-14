# Task: 013 — System and dark appearance

Status: complete
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
Commands executed / results: `npm run verify` PASS: 66 unit + 20 integration tests, strict types/lint/format and all-platform exports. Contrast tests cover both palettes, text/actions and all habit hues/state cues. SQLite v5 upgrade/reopen preserves wins/notes/week-start; backup restore retains override. Browser localhost:8091: Dark selected, refresh retains Dark, Today/Insights/note/editor reviewed at 360/390; Light selection restores light palette without changing data. Screenshots in docs/screenshots/appearance-*. Hosted verify PASS (run 38575037072, separate audit FAIL); Android native compile PASS (38575036565). iOS native compile PASS (38575036909). Four-flow iPhone runtime run 38577008176 failed on 577c189.
Open questions: Native screen-reader/enlarged-text and Android runtime evidence remain separate gates.
Handoff summary: Local and browser acceptance passed. Native appearance/restart acceptance will run with the matching app artifact.

Native diagnosis (run 38577008176): first-win and management passed. The note keyboard covered offscreen actions; taps produced extra letters instead of saving. The Settings tab's actual native label includes “tab, 3 of 3”, so the exact selector missed it. Inspector actions now live in a fixed footer above the keyboard, with bounded height/automatic keyboard insets. Note flow additionally asserts exact text before saving; appearance selects the observed tab label. Run new feature flows before regression flows, with separate JUnit reports; all four remain required. Second execution pending.

Second diagnosis (38584048001): note flow PASSED. Appearance did not activate Dark because Maestro considered a partly clipped radio fully visible and tapped the tab-bar inset. Hierarchy retained System checked and Dark unchecked; no persistence failure occurred. Center the radio during scrolling before tapping, retaining exact selected-state/restart assertions. [Maestro scrolling reference](https://docs.maestro.dev/reference/commands-available/scrolluntilvisible). Reuse the matching 38dfc28 build for this flow-only repair.

Final native acceptance: run 38606371018 PASSED all four flows on iPhone 17 Pro / iOS 26.5. Both JUnit suites report 2 tests / 0 failures. Appearance verifies Dark selection, restart persistence, Light and System; reviewed native captures are docs/screenshots/appearance-ios-dark.png and appearance-ios-light.png. The matching app artifact is 38dfc28 (build 38582089439), and the flow-only workflow commit is f52d657. Physical accessibility and Android runtime remain separate gates.
