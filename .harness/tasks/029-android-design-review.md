# Task: 029 — Android tile geometry and visual review

Status: complete
Goal: Fix the oversized Today tile reported by the owner and inspect related Android screens for inconsistent geometry, clipping and alignment.
Non-goals: Redesign, new features, dependencies, permissions, release settings or data changes.
Files/modules allowed: HabitCard, VictoryWall, MonthCalendar, YearGrid and StatsGrid; focused native review flow; design documentation and task evidence.
Dependencies: Existing task 028 dedicated API 36 emulator, native APK and production Metro proxy; synthetic data only.
Acceptance criteria:

- Today retains exactly 14 square cells with matching outer sizes (at most one physical pixel rounding difference), including today, pending/completed and notes; today retains its outline and state marker.
- Inspect Insights week/month/year, detail month/year, editor, note dialog and Settings on Android. Correct any confirmed related layout defects without changing behavior.
- Review narrow display, Portuguese and enlarged text, light/dark states; retain native screenshots and measured bounds.
- Plain statistic symbols remain visible in light/dark themes through explicit theme color.
- Completion/undo and inspection remain functional; npm run verify and relevant native flows pass.
- Preserve existing owner changes and task 028 evidence; distinguish emulator results from physical-device acceptance.

Required tests: npm run verify; first-win, management, notes and dedicated visual-review native flows; UI hierarchy geometry comparison and screenshot review.
Commands executed / results:

- Before fix, API 36 UI hierarchy: Today historic cells 37–38 × 38 px; today 49 × 49 px. Border contributes extra flex basis.
- Insights before fix: today 26 × 27 px versus ordinary 21–22 px cells; partial rows also changed column widths.
- Detail year before fix: ordinary October cells 52 × 40 px, current-day row 52 × 46 px. Month/calendar percentage wrapping and borders produced non-square, uneven rows.
- First exploratory visual flow stopped at the 20-second year-scroll deadline; retained diagnostics. Final flow uses state + resource selector (no fixed date) and a 60-second scroll deadline; destination assertions retained.
- A second exploratory visual run reached the calendar inspector but its header Back action was off-screen after closing the modal. Added explicit upward scrolling; the complete final design-review flow passes in 2m49s.
- Android 10 auxiliary AVD initially retained Portuguese system locale; normalizing the actual framework locale to en-US fixed the English-selector setup. Android 16 enlarged editing also surfaced a Gboard stylus onboarding overlay; disable secure stylus_handwriting_enabled only in this test AVD and retain app Done typing/keyboard assertions.
- Dark enlarged Insights review found plain statistics glyphs (✓/◎) inheriting Android black text. StatsGrid now uses the theme foreground color so these marks remain visible on dark surfaces.
- Enlarged Portuguese fixture diagnostics also exposed an incorrect harness scroll direction (Appearance follows Language), and editing a reused fixture left one trailing character after cursor-based erase. Final flow creates a fresh long-name habit and asserts the entire literal input before saving; it passes. These diagnostics are retained separately from accepted reports.
- Initial typecheck rejected removed React Native StyleSheet.absoluteFillObject; corrected to the installed version’s StyleSheet.absoluteFill.

- Final npm run verify: PASS, 115 unit + 26 real SQLite integration tests, strict types/lint/format and iOS/Android/web exports.
- Accepted native reports: design-review 2m49s (includes first-win/restart/undo), notes 1m40s, management 2m50s, enlarged text 1m16s, Portuguese long-name 1m39s, final note/contrast follow-up 1m31s.
- Frozen bounds checker: PASS for 14 Today cells, 365 Insights cells, 31 detail October cells, and 14 enlarged Portuguese Today cells including note. Final sizes vary by at most one physical pixel; enlarged Today is 32–33 × 32 px.
- Final StatsGrid color change was followed by a fresh aggregate verify and native note/contrast flow; earlier grid journeys retained the same four grid sources. Bundle/source hashes and separate accepted/diagnostic JUnit reports are in .harness/evidence/029-android.
- Diff reviewed; owner implementation-plan diff remains 79 insertions / 1 deletion. No dependency, permission, schema or release-setting change.

Open questions: None; owner authorized emulator validation, no physical device available.
Handoff summary: Five UI modules corrected; six accepted native executions on API 29/36 plus native bounds/screenshot review. Exactly 14 Today cells remain equal at normal and enlarged text, including a saved note. No physical-device or fresh iPhone runtime claim. Next: signed release/offline/update and physical accessibility when available.
