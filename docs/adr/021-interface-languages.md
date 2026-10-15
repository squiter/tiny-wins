# ADR-021: Interface language boundary

Status: accepted; expo-localization ~57.0.2 explicitly authorized by owner on 2026-10-15

The owner approved languages, editable suggestions, flexible weekly goals, then a session timer on 2026-10-15. Translate presentation only. Habit names, notes, identifiers, stored local dates, timestamps, schedules and week-start preferences retain their original meaning.

Use a typed language preference: `system`, `en`, or `pt-BR`. Inject the device's first preferred language into a pure resolver. English variants resolve to English, Portuguese variants resolve to Brazilian Portuguese, and unsupported/missing/malformed language tags fall back to English. An explicit saved choice takes precedence. Do not choose a lower-ranked supported language over the user's first preference. Language names in the eventual selector remain self-identifying: English and Português (Brasil).

Use built-in Intl for display formatting and plural rules. A local date is validated and formatted at UTC noon with an explicit UTC timezone. It is never interpreted as a device-local timestamp. Weekday headings use the separately saved week start; translating the headings does not change calendar alignment. Full localized weekday names accompany short visual labels. Never derive business rules, database keys or backup dates from formatted strings.

No translation framework is needed. The interface catalog will have matching typed keys in English and Portuguese, including accessibility, error and plural copy. Pure formatting helpers take the resolved language explicitly, without a global mutable locale. Loading/recovery before preferences are available will use device language with the same fallback.

Native detection needs Expo SDK-compatible `expo-localization ~57.0.2`, documented for iOS, Android and web. The owner explicitly authorized this package; it is installed with the SDK-compatible version. Android foreground language changes and iOS relaunch behavior require native acceptance; a helper unit test is not device-language evidence. No OS permission, release setting or static supported-language configuration is changed. See the [Expo SDK 57 localization documentation](https://docs.expo.dev/versions/v57.0.0/sdk/localization/).

Task 025 covers the pure boundary; task 017 still owns saved preferences, additive SQLite migration, full UI copy, loading/recovery and browser/native acceptance. Do not describe the app as translated until those gates pass.

Migration 8 adds the constrained device language preference. A shared localization provider resolves the saved override with expo-localization useLocales, updating the catalog and formatters immediately. Backup merge retains this device preference. Loading and recovery outside the database use system language, since a saved override may be unreadable. Native share-sheet title is passed as presentation copy; OS-provided file picker and share targets follow the OS language. Known domain/backup validation errors are translated at the UI boundary; unknown failures use a translated actionable fallback instead of exposing platform error details.

Transient notices retain a message key and literal interpolation values rather than translated strings, so changing language also updates visible feedback. Restore results retain numeric counts and format their plural nouns at render time. Portuguese weekday choice buttons use three-letter forms (Dom/Seg/Ter/Qua/Qui/Sex/Sáb) to distinguish Monday from Friday and Wednesday from Thursday; full accessible names remain available. Calendar-axis initials remain compact and dates have explicit localized state labels.
