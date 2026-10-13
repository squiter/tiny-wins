# Contributing

Read the plan and AGENTS.md. Select one task using .harness/templates/task.md; keep its scope and acceptance criteria concrete. Run npm ci and npm run verify before submitting a focused pull request. Include command results, relevant screenshots/device evidence and any unavailable validation. CI also runs npm run security.

Business rules belong in src/domain; use fixed dates and explicit timezones in tests. Persistence changes must include migration, idempotency and restart tests. Never commit personal databases. Screens should expose accessible controls and preserve all 14 history dates at narrow widths and enlarged text sizes.

Record an ADR when changing storage, platform behavior, product semantics or distribution. Do not introduce new dependencies or permissions without explaining their purpose. Release/signing and destructive operations require owner authorization. Branch protection and repository security settings must be enabled by a repository administrator once hosted.
