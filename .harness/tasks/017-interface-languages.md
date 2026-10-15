# Task: 017 — English and Brazilian Portuguese

Status: in progress
Goal: Follow supported device language and offer a saved interface-language override, starting with English and Brazilian Portuguese.
Non-goals: Translating user habit names/notes, changing calendar dates/schedules/week start, translation services, store metadata or release settings.
Files/modules allowed: Typed interface copy/formatters, preference domain/repository/context and additive migration, UI strings/accessibility/errors, deterministic tests, native flows and documentation/ADR.
Dependencies: Prefer existing platform/Intl APIs; verify device-language detection on native platforms before implementation. A new module or release-setting change needs explicit owner authorization.
Acceptance criteria:

- Centralize visible copy, validation/errors, empty states, state descriptions, accessibility labels and plural forms for both languages.
- System follows a supported device language; unsupported languages fall back to English. Settings saves System/English/Português (Brasil), with immediate updates and restart persistence.
- Format displayed dates/numbers for the selected locale; stored ISO local dates, timestamps, timezone context and week-start choice remain unchanged.
- Preserve user-entered names/notes and all wins, tolerance rules, appearance and motion preferences. Backup restore retains device preferences.
- Loading/recovery has a documented locale fallback when saved preferences cannot be read.
- Review longer Portuguese copy and enlarged text in all main screens, dialogs and controls, retaining 48-point primary controls, exactly 14 Today dates and non-color cues.
- Keep existing English native regressions and add Portuguese selection/restart/check-in/note acceptance. Document actual system-language detection evidence and unavailable Android/physical checks.

Required tests: Typed key coverage and deterministic plurals/date/number/fallback tests; real SQLite additive migration/reopen/restore preservation; npm run verify; browser English/Portuguese 360/390 and native language/restart/enlarged-text flows.
Commands executed / results: Task 025 implements the pure locale boundary, with six new tests; npm run verify PASS (92 unit + 23 integration, strict checks and all three JS exports). ADR-021 records fallback and date safety. Full catalog/UI, saved preference migration and native detection/acceptance are not yet implemented. No dependency change.
Open questions: Native detection uses Expo SDK 57-compatible expo-localization (~57.0.2), pending explicit dependency authorization under AGENTS.md. Pure locale resolution/formatting can proceed independently.
Handoff summary: First in the owner-approved sequence: languages → suggestions → flexible weekly goals → timer. Pure foundation complete in task 025; finish native detection authorization, catalog/UI and saved preference next. User data keeps its original text and calendar meaning.
