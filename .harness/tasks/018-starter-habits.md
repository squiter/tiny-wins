# Task: 018 — Editable starter habit ideas

Status: ready
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
Commands executed / results: Planning only; reviewed owner suggestions priority and existing explicit creation contract. No records, implementation or dependencies added.
Open questions: Final idea copy and placement are resolved within the scoped editor/design review.
Handoff summary: Follow task 017 so suggestions are localized from the start. Every tile still represents one deliberate binary win.
