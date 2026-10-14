# Task: 015 — Cozy visual refinement

Status: in progress
Goal: Express the owner's saved botanical design board across the actual app.
Non-goals: Navigation changes, new icon dependencies, generated UI mockups, sound.
Files/modules allowed: Bundled decorative asset, shared illustration/footer/tab icons, theme tokens, main screens/cards/editors and documentation.
Dependencies: None. Use existing React Native Image/View and bundled fonts.
Acceptance criteria:

- Add a restrained, warm botanical/rabbit illustration inspired by the saved board; decorative, non-interactive and hidden from accessibility.
- Reserve the rabbit for the all-done daily banner. Shared page footers use quiet typography and generous spacing, without repeating the image or adding another colored card (owner refinement, 2026-10-14).
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

Run 38622065385 again passes the five feature/core flows. Centering the reading target succeeds, and the native enlarged editor capture is legible; the separate detail layout defect is documented below. The next failure is `No visible element found: Cancel` from forcing centerElement=true at the end of the full-screen editor. Screenshot/hierarchy prove Cancel is fully visible at [16,760][386,808] within the 874-point window, with 66 points below it and no tab bar. There is no further content to scroll for centering. Use centerElement=false for this last item, assert Save changes / Archive habit / Cancel, and capture the editor actions before tapping. Keep the off-screen reading row centered. No production source or assertion is removed.

Manual enlarged screenshot review also finds an actual layout defect: the unbounded YOUR PROGRESS / Edit habit header and month label run past the right edge. Do not call the detail capture legible merely because Edit habit opens. Scope a responsive flex caption/edit action and flex calendar title, preserving font scaling and 48-point controls. Fixed-size decorative chevrons keep user text available. Add enlarged Insights/Settings captures to the same native review; new production source needs fresh verification and matching compilation.

Responsive-header verification: `npm run verify` PASS again (70 unit + 22 real SQLite integration, types/lint/format and all platform exports). Native source revalidation is pending the fresh build. Enlarged review now asserts the month controls, Save/Archive/Cancel, captures the victory wall and the saved-animation row in Settings.

Focused normal-font browser check after responsive fix (isolated 8091, 360 × 844): Edit habit stays 48 points high inside x270.22–329; October title spans x72–273 and both arrows remain visible. Screenshot: `docs/screenshots/cozy-detail-light-360.png`. Browser override/tab/server cleaned up. This normal-font check is separate from the pending native enlarged-text gate.

Native run 38629308028 on a4c985c PASSED all six flows: features 3/0 failures, regressions 2/0, enlarged text 1/0; simulator readback accessibility-large. Reviewed detail, editor actions, day inspector, Insights/wall and Settings captures. The detail caption and October/2026 wrap inside the screen, both arrows remain visible, editor actions remain readable, and the animation switch stays separate from its wrapped label. This evidence precedes the footer refinement below.

Owner footer refinement implemented in shared CozyNote: remove the duplicate rabbit and colored card; retain muted serif encouragement with breathable spacing across Today/detail/Insights/Settings. `npm run verify` PASS (70 unit + 22 SQLite tests, types/lint/format, web/iOS/Android exports). Browser captures reviewed at light 360/390 and dark 360: `cozy-typographic-footer-light-390.png`, `cozy-typographic-footer-light-360.png`, `cozy-typographic-footer-dark-360.png`. Six-of-six banner retains the sole rabbit illustration; all rows keep 14 dates. Synthetic preview only; owner data unchanged. New footer native runtime validation awaits a fresh matching build, so task remains in progress. Next product slice: task 017 interface languages, then task 018 starter ideas.
