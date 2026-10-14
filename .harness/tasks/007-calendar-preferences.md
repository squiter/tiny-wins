# Task 007: Saved calendar week start

Status: implemented, locally verified and browser verified; native runtime pending

Goal: finish the MVP week-start preference and deliver directly on main as requested.
Acceptance: choose Sunday/Monday in Settings, save locally across restart, align monthly/yearly labels and padding, preserve every habit/schedule/win; default Monday on upgrades; invalid settings rejected; 48-point labeled selection controls.
Non-goals: theme changes, timezone overrides, notifications, synchronization, account settings.
Scope: preference domain/repository/context, additive SQLite v4, Settings/calendar presentation, tests/docs.
Verification: deterministic alignment and real SQLite v3→v4/reopen/constraint tests; aggregate gate; browser change→detail→reload and existing wins.

Results: 47 unit + 14 integration tests pass. Browser Sunday selection survived reload and aligned monthly/yearly headings while retaining 6 habits/3 wins. SQLite v3→v4 migration and reopen passed without changed history. Choice includes native and web checked semantics.

Browser evidence: screenshots/preferences-390.png; selected radio exposes aria-checked=true. Monday default restored after testing; 365 yearly dates and 31 October dates remain present.
