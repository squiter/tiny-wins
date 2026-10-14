# ADR-010: Versioned local backup files

Status: accepted

Tiny Wins remains local-first. Users can export a JSON file and select it on another device; there is no service, account or automatic sync. Native Expo FileSystem, DocumentPicker and Sharing provide local file access. The browser adapter uses download and file input APIs. Both feed the same pure validator and repository transaction.

Version 1 uses `format: tiny-wins`, `version: 1`, a UTC export timestamp, habits (including effective schedules/archive state) and completions (including their original timezone). Validation checks dates, timestamps, enums, IDs, duplicates, schedule order, references and timezones before any write. Limits are 5 MiB UTF-8, 500 habits, 50,000 completions and 200 schedule versions per habit. Oversized or unsupported files produce an error without writing. These bounds should be revisited with performance evidence before expansion.

The user reviews counts and confirms restore. Existing metadata/order/wins are retained; only missing records are appended. Repeated imports are idempotent. A reused habit ID with a different creation day rejects the entire transaction instead of attaching wins to a different timeline. This is a merge, not a full overwrite or snapshot rollback. Browser/native data stores are separate. Export files contain readable personal habit data and are ignored by Git.

Dependencies were added within the user's authorization to continue implementation. Native file dialogs still require device acceptance; browser download/select/review/restore and real SQLite rollback/reopen are verified.
