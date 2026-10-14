# Task: 015 — Cozy visual refinement

Status: in progress
Goal: Express the owner's saved botanical design board across the actual app.
Non-goals: Navigation changes, new icon dependencies, generated UI mockups, sound.
Files/modules allowed: Bundled decorative asset, shared illustration/footer/tab icons, theme tokens, main screens/cards/editors and documentation.
Dependencies: None. Use existing React Native Image/View and bundled fonts.
Acceptance criteria:

- Add a restrained, warm botanical/rabbit illustration inspired by the saved board; decorative, non-interactive and hidden from accessibility.
- Apply shared card shapes, gentle depth and consistent navigation icons across Today/detail/Insights/Settings/editors.
- Keep both palettes legible; preserve habit hue identity, binary/grace/note cues and exactly 14 Today dates.
- Main controls remain 48 points; illustration never obscures copy/controls or expands compact rows.
- Review real screens at 360/390 and enlarged text, with synthetic data only. Bundle the selected image in assets.

Required tests: npm run verify, contrast checks, browser layout screenshots, native regressions when available.
Commands executed / results: `npm run verify` PASS: strict types, lint, formatting, 70 unit + 22 real SQLite integration tests and iOS/Android/web exports. Isolated browser localhost:8091 reviewed at 360/390 using six synthetic habits; owner localhost:8090 data untouched. Native flows added; fresh matching build/runtime pending.
Open questions: Physical-device accessibility and Android runtime remain separate gates.
Handoff summary: Implementation and local/browser checks complete; native acceptance remains in progress.

Browser evidence: `docs/screenshots/cozy-today-light-390.png`, `cozy-today-light-360.png`, `cozy-today-dark-390.png`. All 14 date cells fit. Reorder retains the tested card dimensions (313 × 92.36 at 360); light Insights is legible. Enlarged native text has a dedicated read-only Maestro flow and simulator content-size readback.

Six-habit check: each row exposes exactly 14 date labels. All six completed updates the banner to 6 of 6, with warm background and rabbit; `docs/screenshots/cozy-all-day-light-390.png`. Long-name row wraps while its completion control remains separate. Browser preview tab/server and viewport override cleaned up; owner preview stays available.

Native follow-up: run 38616623661 passes all five feature/core flows (iPhone 17 Pro / iOS 26.5), but enlarged text fails before opening the editor. The simulator readback is `accessibility-large`. Screenshot and hierarchy show the reading target at bounds [29,796][315,908], below the scroll viewport and behind the tab bar; direct tap did not navigate. Center the target with scrollUntilVisible before tapping and assert the detail’s Edit habit control. No assertion/source/artifact guard changed. Native illustration rendering is confirmed in `docs/screenshots/cozy-ios-all-day.png`; enlarged editor/day review awaits the flow repair.
