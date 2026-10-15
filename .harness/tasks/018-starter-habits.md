# Task: 018 — Editable starter habit ideas

Status: in progress
Goal: Offer a small optional selection of localized habit ideas while creating a new habit.
Non-goals: Onboarding, automatic sample records, quantity goals, suggested history/wins, recommendation services or changing existing habits.
Files/modules allowed: Small typed idea catalog, localized names/copy, new-habit editor draft selection, tests/native flow and documentation.
Dependencies: Task 017 language layer; existing habit/icon/color/creation APIs only. No new package or permission.
Acceptance criteria:

- Offer a restrained set of binary ideas such as reading a page, drinking water and walking, with existing icons/colors and English/Portuguese names.
- Selection fills only the editable draft name/icon/color; it never creates a habit or completion. Keep any explicitly configured schedule/tolerance.
- Suggestions appear only during new-habit creation, remain optional and require no onboarding. Users can enter their own idea directly.
- Name/icon/color remain editable after selection; creation uses the existing validated use case and injected clock/ID provider only on explicit Save.
- Cancel leaves storage unchanged. A saved title becomes user data and is never rewritten when interface language changes.
- Keep accessible choice labels/state cues, 48-point controls, reduced-motion support and usable 360/390/enlarged-text layouts.
- Update harness/ADR or design notes with actual selection/edit/save/cancel/restart evidence.

Required tests: Catalog uses valid existing icons/colors; draft selection has no persistence side effect; native choose idea → customize → save → restart, plus cancel/no-record acceptance; npm run verify and layout review.
Commands executed / results: Implementation started after completed task 017. Selected slice: three collapsed, optional editor ideas (read a page, drink water, short walk), localized draft fields only. Preserve uncontrolled native name typing, explicit Save, schedule/tolerance and owner plan edits. npm run verify PASS (99 unit + 24 real SQLite = 123, types/lint/format and all three exports). Browser 8091 synthetic fixtures confirm all three Portuguese ideas, repeated selection preserving five weekdays and tolerance 2, cancellation/reload with blank new draft, fully editable name/icon/color, explicit Save with zero wins and literal title retained after reload/English switch. Reviewed Portuguese 390/360 wrapping and English copy. Added native assertions to retained first-win, language override and OS Portuguese/enlarged-text flows; hosted evidence pending. Final aggregate rerun after the explicit web expansion cue PASS. Existing habit editor hides ideas; customized title/icon/color survive reopen and language change. Native job budget is 50 minutes because the previous ten-flow baseline already took 41m27s; all ten cases and exact assertions are retained.
Open questions: Hosted native acceptance and enlarged-text screenshot review pending. Local Maestro is not installed and Xcode selects CommandLineTools; no local device acceptance claimed. No new dependency, schema, permission or release configuration required.
Handoff summary: Follow task 017 so suggestions are localized from the start. Every tile still represents one deliberate binary win.
