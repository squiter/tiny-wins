# Task: 005 — Versioned local backups

Status: verified locally and in browser; native file dialogs await device acceptance
Goal: export user-owned JSON backup files and merge a reviewed backup without replacing existing data.
Non-goals: cloud storage, accounts, synchronization, destructive reset, silent overwrites.
Allowed modules: backup domain/files/UI, repository transaction, tests/docs.
Acceptance: validate file version/size/types/dates/IDs/foreign keys/schedules/timezones; show record counts before restore; atomic merge, duplicate imports idempotent; retain existing names/order/check-ins; export/reopen/restore roundtrip; cross-platform file interface.
Tests: malformed and future schemas, duplicate/dangling records, schedules, deterministic serialization, rollback/conflicts, repeated restore, real SQLite pagination/reopen; visible browser file download and restore.
Results: npm run verify passed with 55 tests and all-platform exports. Browser download reopened with 6 habits/3 wins, explicit restore added 0/0 without duplicates. SQLite import/reopen/rollback and 205-record pagination passed. Native picker/share dialogs require iPhone/Android acceptance.
