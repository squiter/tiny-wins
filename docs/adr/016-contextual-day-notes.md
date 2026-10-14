# ADR-016: Contextual day notes

Status: accepted

Deliver the owner's high-priority short note slice before widgets and dark mode. A note is independent of a binary completion: one plain-text value per habit/local date, up to 280 UTF-16 code units, trimmed on save. Empty text explicitly clears the note. Save timestamps describe editing time, never the calendar placement. Active habits can annotate elapsed dates from creation, including rest days; archived notes remain readable and editable after restoring the habit. Future and pre-creation dates cannot be annotated.

Use a separate notes table with composite habit/date primary key and foreign key, in additive migration 5. Repository methods isolate SQLite from UI. Use cases validate dates against an injected clock/timezone. Calendar cells carry only note presence, not note text; markers never replace completion/tolerance state cues or change metrics. The day inspector offers a separate explicit save action and closes without saving drafts.

Backup v3 requires a notes array, bounded to 50,000 records and the existing overall 5 MiB limit. Validate note length, timestamp, owner/date references and duplicate keys before writes. Formats 1 and 2 import with an empty notes array. Exports retain schedule tolerance in v3. Restore appends missing notes and keeps existing note text, including newer local edits; repeated restore is idempotent and all habit/win/note writes are one transaction. This merge does not resurrect a cleared note if the backup omits it, but importing an older backup containing a cleared note can add it again, consistent with additive restore semantics. No tombstones or speculative sync.

Use the shared React Native inspector with safe areas, a scroll view and keyboard avoidance. Add a small corner marker plus accessible “has note” labels on Today, month, year and Insights grids. No new dependencies, permissions or release configuration.
