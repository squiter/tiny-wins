# Tiny Wins agent contract

Read README.md, docs/IMPLEMENTATION_PLAN.md, relevant ADRs and .harness/checks.md first.

- Scope each change with explicit acceptance criteria in .harness/tasks; use the task template.
- Keep diffs focused; preserve user changes. Do not build beyond the selected slice.
- Expo Router routes live in src/app. Features coordinate use cases; domain is pure TypeScript.
- Only database adapters import Drizzle/SQLite. UI uses the repository interface. No backend.
- Use strict TypeScript, descriptive names, Prettier and cross-platform React Native APIs.
- Keep local calendar dates separate from timestamps. Inject clock/timezone into use cases.
- Test domain changes deterministically; test storage changes on real SQLite, including reopen and migration.
- Use accessible labels, minimum 48-point main controls, non-color state cues and reduced-motion support.
- Keep exactly 14 date cells; do not erase historical wins after a broken streak.
- No iOS-only dependencies/code without an ADR, Android fallback and smoke-test task.
- No authentication, telemetry, purchase flows or speculative synchronization.
- Record architecture changes in docs/adr; update documentation in the same change.
- Dependencies, permissions, release settings and destructive schemas require explicit authorization.
- Run npm run verify; run device E2E for UI/persistence changes when available. Never weaken a failing check.
- After two identical failures, diagnose before retrying. Record unavailable tools and exact limitations.
- Done: acceptance criteria implemented, required gates pass, diff reviewed, docs current. Device claims require device evidence.
- Report changed modules, actual commands/results, unresolved risks and the next task. Never commit secrets or habit data.
