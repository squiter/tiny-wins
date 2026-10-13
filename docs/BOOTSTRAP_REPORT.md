# Bootstrap report — 2026-10-13

## Delivered

Expo 57 + React Native 0.86.3, strict TypeScript and Expo Router; SQLite + Drizzle repositories and transactional schema v1; deterministic Vitest tests; Expo ESLint/Prettier; lockfile, Node 24 development/CI baseline, GitHub Actions and a Maestro device flow.

Today uses ivory/forest colors, bundled Fraunces/Inter, six color choices, accessible completion controls, a warm empty state and reduced-motion-aware feedback. Users create daily habits, complete/undo today, see exactly 14 dates and their current streak. Past completions survive a broken streak. Date/timezone context is explicit and persisted. React state is sufficient; no Zustand or backend is introduced.

Architecture separates Router/UI, feature use cases, pure domain, repository contract and SQLite adapter. The supplied plan is preserved untouched; an exact copy is the canonical IMPLEMENTATION_PLAN.md. No pre-existing application code or commits were found. No commit, push or release was performed.

## Created files by purpose

- App/config: package.json, package-lock.json, app.json, tsconfig.json, .nvmrc, .gitignore.
- Application: src/app, src/components/HabitCard.tsx, src/features/habits/repository.ts, src/features/check-ins/service.ts, src/domain, src/database, src/theme/tokens.ts, src/lib/clock.ts.
- Validation: eslint.config.js, vitest.config.mts, drizzle.config.ts, .prettierrc.json, .prettierignore, tests/unit/calendar.test.ts, tests/integration/persistence.test.ts, .maestro/first-win.yaml, .github/workflows/ci.yml.
- Guidance: README.md, CONTRIBUTING.md, AGENTS.md, docs/IMPLEMENTATION_PLAN.md, docs/ARCHITECTURE.md, docs/HARNESS_AUDIT.md, docs/adr/001–005, this report, .harness/checks.md, decisions.md, backlog.md, templates/task.md and tasks/001-bootstrap.md.

## Verification evidence

- `npm ci` succeeded under Node 24.21.0; a subsequent full `npm run verify` passed.
- Final aggregate: strict types, ESLint, Prettier, 16 unit tests, 5 real SQLite integration tests and iOS/Android production JS/assets exports.
- Tests cover title validation, invalid dates, leap/year boundaries, local-day conversion, DST transitions, exactly 14 days, pending-today streaks, gaps, pre-creation dates, foreign keys, duplicate writes, migration idempotency/future-version protection, creation, completion/undo, file-backed close/reopen and timezone travel/midnight.
- `npx expo install --check`: dependencies up to date.
- `npx expo-doctor`: 21/21 checks passed.
- `CI=1 npm start -- --offline --port 8089`: Metro reached “Waiting on http://localhost:8089”; stopped after verification.
- Dependency audit fails: 32 findings (18 high, 14 moderate, no critical) in the current lockfile. No finding was hidden or waived. The separate dependency-audit CI job intentionally remains failing until remediation; no all-green CI claim is made. Hosted GitHub Actions has not been run.

## Limitations and follow-up

The native iOS simulator utility, Android SDK and Maestro are unavailable. No installable native build, device lifecycle persistence test, screen-reader check or screenshot/large-text review has been performed. Real SQLite reopen proves adapter persistence, not the Expo native bridge or actual app relaunch. Bundle export is not native build evidence. Native UI interactions have not been observed on a running device. Browser interactions are now verified below.

SDK-compatible ESLint 9 is deprecated upstream; ESLint 10 fails Expo's React plugin at runtime. React DOM is explicitly matched to React 19.2.3 to satisfy Router's web peers. Expo's TypeScript resolver is explicit because dependency deduplication otherwise broke lint resolution. Revisit these constraints on a compatible SDK/config update. Security audit identified high advisories in node-forge and braces inherited through Expo tooling; npm registry versions queried at bootstrap offer no newer patched releases for these packages. Do not apply npm audit fix --force's incompatible Expo/React Native downgrades. Moderate findings include Drizzle Kit tooling and Router's decoding dependencies; track remediation before release.

Daily schedules only; detail, edit/archive/reorder, icons, selected weekdays, export/import and insights are intentionally deferred. License, paid-store price, final app IDs and trademark choices require owner decisions. Store signing/accounts and repository branch protection remain unconfigured. Other projects' harness conventions are unverified and have not been adopted.

Recommended next milestone: remediate dependency audit and complete native iPhone/Android build + Maestro restart/undo flow, narrow-screen/large-text and accessibility review before adding features. The bootstrap is implemented and its available local gates pass, but device acceptance and security gates remain open.

## Follow-up: usable browser preview

The app is now visible at http://localhost:8090 with npm run preview. Added React Native Web, metro.config.js for WASM, a loopback static preview server, production web export and ADR-006. The preview runs the same mobile UI and SQLite/Drizzle path. Native storage is unchanged.

Observed browser checks passed: empty state; empty-name validation; name/color selection; habit creation; completion; 14 accessible history dates; reload preserving completion; undo; reload preserving undo. The list and creation form were visually reviewed at 390px and 360px without horizontal overflow. After closing the original tab, reopening in a fresh tab retained the record. Concurrent tabs contend for the browser SQLite file lock; a friendly retry screen explains how to recover, and its reload action was verified after closing the other tab. Screenshots are in docs/screenshots. One test habit is left in the preview for review.

The browser uses Expo SQLite's alpha web adapter. This is a development preview, not native iOS/Android runtime evidence. The dependency security findings remain unresolved. The complete local pipeline now includes the web bundle. Checked-state attributes are explicitly exposed to browser assistive technology for completion and color controls.
