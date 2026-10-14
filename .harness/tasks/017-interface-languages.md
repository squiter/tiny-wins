# Task: 017 — English and Brazilian Portuguese

Status: ready
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
Commands executed / results: Planning only; reviewed owner language refinement and current preference/appearance/feedback boundaries. No implementation or dependency change.
Open questions: Confirm native device-language API feasibility and system-change behavior; record an ADR before preference/UI implementation.
Handoff summary: Selected next slice after tasks 015/016. Scope is interface language; user data keeps its original text and calendar meaning.
