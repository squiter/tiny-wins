# ADR-011: Device calendar preferences

Status: accepted

The owner requested direct main implementation after merging PR #1. The MVP plan includes a week-start preference. Settings now chooses Sunday or Monday, with Monday retaining the existing default. SQLite migration v4 adds a single constrained preferences row without changing habits or wins. A separate preference repository contract keeps presentation settings out of habit use cases.

A shared context updates monthly and annual calendars immediately; the stored setting survives restart. Pure functions rotate labels and compute padding from immutable local dates. Eligibility, streaks, schedules, timezone context and the rolling 14-day Today history do not depend on this setting.

The choice belongs to the current device. Version 1 habit backups retain their existing format and merge behavior; importing habit data does not overwrite device preferences. Theme remains the MVP light palette and reduced motion follows the operating system. No new dependency or permission.

Verification covers Sunday/Monday alignment, leap-day padding, schema v3 upgrade, invalid database/repository values, idempotent migration, close/reopen and unchanged existing wins. Browser selection and refresh/detail layout are verified separately in task 007; native runtime acceptance remains open.
