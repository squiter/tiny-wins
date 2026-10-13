# ADR-004: Immutable local completion dates

Status: accepted.

Store the local YYYY-MM-DD and IANA timezone at completion alongside a UTC timestamp. Placement and streaks use the date key; moving timezones does not move previous squares. Current day is derived from an injected instant/timezone. Daily schedules only in this slice; schedule changes and eligible-day consistency require a later decision/test scope. See ARCHITECTURE.md for exact streak and start-date semantics.
