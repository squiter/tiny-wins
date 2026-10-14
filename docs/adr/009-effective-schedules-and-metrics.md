# ADR-009: Effective weekday schedules and progress metrics

Status: accepted. Date: 2026-10-13.

The owner authorized continued roadmap implementation. Schema v3 stores ordered schedule versions as JSON: each contains an immutable local effective date and a set of weekdays (Sunday=0). Existing records start with their original daily schedule. Creating a habit starts its selected schedule today; editing applies it tomorrow and preserves earlier versions. Repeated edits on the same day replace the planned future version. At least one weekday is required for user-selected schedules.

New archives pause eligibility from tomorrow using an internal empty weekday set. Restoration reactivates the last non-paused selection from tomorrow and appends the habit to the active order. Stored wins never move or disappear. Legacy v2 archives did not record local pause intervals; migration does not fabricate them. Only newly recorded pauses can be excluded from eligible-day metrics. Archived habits are read-only until restored.

Streaks count completed consecutive eligible dates, skipping rest/paused dates. A scheduled today may remain pending without breaking yesterday's eligible streak. A missing earlier eligible date breaks it. Best streak uses the selected period. Consistency is eligible completions / elapsed eligible opportunities through today, including a pending today and excluding future/pre-creation/rest/paused dates. Empty denominators display no percentage. Aggregate 30-day consistency weights opportunities, rather than averaging per-habit percentages; all-time wins include archived records.

The yearly wall contains exactly 365/366 dates; the monthly calendar makes the current period easier to inspect. Past-date changes require selecting a date and then a separate explicit mark/undo action. Future and pre-creation dates cannot be edited; archived habits are read-only, and new off-schedule completions are rejected. Existing off-schedule wins stay visible and can be undone.

Pure tests cover weekly gaps, pending today, leap years, changing schedules, pause periods, best streak and weighted consistency. Persistence tests cover schema upgrade, effective versions/reopen and rejected writes.
