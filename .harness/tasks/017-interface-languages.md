# Task: 017 — English and Brazilian Portuguese

Status: in progress
Goal: Follow supported device language and offer a saved interface-language override, starting with English and Brazilian Portuguese.
Non-goals: Translating user habit names/notes, changing calendar dates/schedules/week start, translation services, store metadata or release settings.
Files/modules allowed: Typed interface copy/formatters, preference domain/repository/context and additive migration, UI strings/accessibility/errors, deterministic tests, native flows and documentation/ADR.
Dependencies: Owner explicitly authorized expo-localization ~57.0.2 on 2026-10-15; useLocales reads preferred native/browser languages. Built-in Intl formats copy. No other dependency, permission or release-setting change.
Acceptance criteria:

- Centralize visible copy, validation/errors, empty states, state descriptions, accessibility labels and plural forms for both languages.
- System follows a supported device language; unsupported languages fall back to English. Settings saves System/English/Português (Brasil), with immediate updates and restart persistence.
- Format displayed dates/numbers for the selected locale; stored ISO local dates, timestamps, timezone context and week-start choice remain unchanged.
- Preserve user-entered names/notes and all wins, tolerance rules, appearance and motion preferences. Backup restore retains device preferences.
- Loading/recovery has a documented locale fallback when saved preferences cannot be read.
- Review longer Portuguese copy and enlarged text in all main screens, dialogs and controls, retaining 48-point primary controls, exactly 14 Today dates and non-color cues.
- Keep existing English native regressions and add Portuguese selection/restart/check-in/note acceptance. Document actual system-language detection evidence and unavailable Android/physical checks.

Required tests: Typed key coverage and deterministic plurals/date/number/fallback tests; real SQLite additive migration/reopen/restore preservation; npm run verify; browser English/Portuguese 360/390 and native language/restart/enlarged-text flows.
Commands executed / results: Pure foundation task 025 passed. Full implementation adds a typed English/Portuguese catalog, shared provider, Settings selector and additive SQLite migration 8. npm run verify PASS (96 unit + 24 SQLite integration, strict types/lint/format and iOS/Android/web exports). npm run security:policy PASS with unchanged raw 18 high/0 critical; security:bundle PASS, 1,692 production iOS sources and no affected tooling modules. Browser 8091 confirms immediate Portuguese selection, persistence after reload, unchanged names/history and localized completion; screenshots language-settings-pt-390.jpg and language-today-pt-390.jpg. Expanded browser 360/390 review confirms note persistence with accents, distinct Portuguese weekday choices, editor cancellation, translated detail/Insights and exactly 14 dates per habit. Visible notices now follow language changes; restored record counts remain raw until display. Final local npm run verify PASS: 97 unit + 24 integration (121 total). Matching hosted acceptance follows.
Open questions: Matching native compilation and runtime are pending. Added language-override.yaml plus dedicated simulator OS Portuguese/readback/enlarged-text flow, retaining all eight existing native flows. Android runtime, physical screen readers and native file dialogs remain explicit release gates.
Handoff summary: First in the owner-approved sequence: languages → suggestions → flexible weekly goals → timer. Implementation is ready for final-source browser/native validation, not marked complete from exports. User names/notes/calendar history are never translated or rewritten; backup restore keeps the device language. Owner implementation-plan edits are preserved.
