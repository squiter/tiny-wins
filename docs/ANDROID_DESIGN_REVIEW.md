# Android design review — task 029

The owner reported an oversized current-day square in Today. Native measurements confirmed that the outline contributed to flex sizing. Related review also found changing column widths in Insights and non-square, uneven rows in the detail calendars.

## Changes

- `HabitCard`: equal 14-day flex slots; backgrounds and outlines render inside each slot without affecting its dimensions.
- `VictoryWall`: equal columns across ordinary/today cells and leading/trailing empty slots, including the annual wall.
- `MonthCalendar` and `YearGrid`: seven explicit equal columns per week instead of percentage widths inside a wrapping container. Weekday labels share the same columns; borders render independently of geometry.
- `StatsGrid`: plain statistic glyphs now use the theme foreground instead of Android’s default black, improving visibility on dark cards.
- Existing completion, note, rest/grace/weekly cues and accessibility labels remain. No storage, dependency, permission or release configuration change.

## Evidence

Dedicated task 028 API 29/36 ARM64 emulators, native debug APK and working-tree production JavaScript via the existing local proxy; synthetic records only. This is emulator validation, not a physical-device or signed release claim.

Before: Today history 37–38 × 38 px versus today 49 × 49 px. Insights annual current day 26 × 27 px versus ordinary 21–22 px, and partial rows changed widths. Detail October ordinary cells 52 × 40 px versus current-day row 52 × 46 px.

Final native measurements are retained in `.harness/evidence/029-android/geometry.json` and can be checked with `python3 .harness/evidence/029-android/check-geometry.py`:

| Surface                         | Measured cells | Final dimensions (physical px) |
| ------------------------------- | -------------- | ------------------------------ |
| Today                           | 14             | 38–39 × 39                     |
| Insights year                   | 365            | 20–21 × 20–21                  |
| Detail October in year calendar | 31             | 53–54 × 53–54                  |

All final measured cells are square/equal within one physical pixel of rounding. The complete API 36 visual flow passes, including nested first-win/restart/undo, week/month/year, calendar inspection, Settings and light/dark review. `npm run verify` passes with 115 unit + 26 SQLite integration tests, strict types, lint, formatting and exports for iOS/Android/web.

Reviewed captures: [Today](screenshots/android-design-today.png), [month detail](screenshots/android-design-month.png), [year detail](screenshots/android-design-year.png), [Insights year](screenshots/android-design-insights.png). The first exploratory visual run stopped at its 20-second scrolling deadline; final review uses a 60-second deadline and selects the current completed date without a hard-coded calendar date. The required destination assertion is retained.

## Limits and next task

These changes share React Native code across platforms. This slice records Android runtime evidence and cross-platform JavaScript exports; it does not rerun an iPhone simulator or physical device. Next release work remains signed standalone/offline/update validation and physical accessibility when a device becomes available, as listed in the release readiness checklist. No owner data or existing personal AVD was used.

API 29 also passes `day-notes` (1m40s), `habit-management` (2m50s) and `large-text` (1m16s), covering keyboard note actions, restart/clear, editing/reorder/archive/restore and Today/detail/editor/day/Insights/Settings at 360 dp with 150% system text. API 36 Portuguese long-name creation verifies the full literal input before saving, then reviews Today and month/year Insights in dark mode (1m39s). Original diagnostic runs remain in the temporary task directory; accepted JUnit reports are kept separately.

The final API 36 note/contrast flow passes (1m31s): visible green statistics glyphs on dark surfaces, full long-name header, detail calendar, real keyboard, note save and 14 equal Today cells with the note marker. It serves the final StatsGrid color adjustment; a fresh `npm run verify` also passes after that last change. Six accepted native executions are stored separately from exploratory failures. See [enlarged Portuguese Today](screenshots/android-design-portuguese-large.png), [note marker](screenshots/android-design-note-large.png), [dark statistics](screenshots/android-design-statistics-dark.png) and [enlarged editor actions](screenshots/android-design-editor-large.png).
