# ADR-003: SQLite and Drizzle

Status: accepted.

Expo SQLite provides device-private persistence; Drizzle provides typed queries. Use a small repository contract and transactional, versioned SQL migrations. Test the shared repository and migration on file-backed SQLite through better-sqlite3. This verifies storage semantics without pretending to exercise the native bridge. Native restart testing remains required. Portability/export belongs to a later slice, as excluded by the bootstrap request.
