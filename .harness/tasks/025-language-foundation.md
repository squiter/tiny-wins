# Task: 025 — Deterministic interface locale foundation

Status: complete
Goal: Prepare the pure, dependency-free locale boundary for task 017 while native detection authorization is pending.
Non-goals: Claiming interface translation, changing UI/storage, installing a dependency, or altering stored dates and week-start rules.
Files/modules allowed: Pure localization helpers, deterministic unit tests, ADR-021, tasks/backlog and delivery documentation.
Dependencies: Existing Intl APIs only. Native expo-localization authorization is requested separately in task 017.
Acceptance criteria:

- Define and validate System/English/Português (Brasil) preference values and resolve an explicitly injected preferred device language with a documented English fallback.
- Support Portuguese language variants through Brazilian Portuguese interface copy; explicit overrides win over device language.
- Format a validated local date using UTC only as its display container, preventing the device timezone from moving it.
- Format numbers and select singular/plural forms for English and Brazilian Portuguese without mutating user data.
- Localized calendar headings rotate using the existing week-start preference and expose full weekday names for accessibility.
- Verify invalid values, unsupported locales, leap dates, plural zero/one/many, number formatting and both calendar alignments deterministically.
- Record the approved delivery order and keep broader task 017 in progress until UI, persistence and native acceptance are implemented.

Required tests: npm run verify, focused locale unit tests and diff review. No UI/persistence behavior changes in this foundation; native acceptance belongs to 017.
Commands executed / results: npm run verify PASS: 92 unit + 23 real SQLite integration tests, strict types, lint, format and iOS/Android/web JS exports. Six new deterministic locale cases cover fallback/overrides, local-date safety, plural and numeric formatting, and calendar headings. Initial excess-property test typing corrected before final successful aggregate. git diff --check PASS. No runtime UI change; Maestro is unavailable locally and Xcode points to CommandLineTools. No device claim.
Open questions: Native module authorization remains pending separately; no dependency is added in this task.
Handoff summary: First implementation increment of 017. The app remains English until the full interface slice passes its acceptance gates.
