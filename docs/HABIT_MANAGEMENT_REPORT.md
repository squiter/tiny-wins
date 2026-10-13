# Habit management and design milestone — 2026-10-13

## Delivered

The supplied docs/inspirations board is now the design direction, documented in DESIGN_SYSTEM.md. Today has a compact serif heading, local date, four-square brand mark, add control, encouragement banner, icon tiles, pale/strong habit colors and a compact 14-day wall. Creation/editing includes a live preview, twelve icons and six colors. No dead navigation or schedule controls are shown.

Name/icon/color edits preserve identity and completion dates. Archive hides a habit without deleting anything; restore appends to the active list. Reordering uses accessible move-up/down buttons and persists transactionally. The v2 database migration adds these fields to an existing v1 database without replacing tables. See ADR-007.

The multi-habit preview revealed a bug in expo-sqlite's browser worker response-length header. A one-line repair is applied by a guarded, version-checked postinstall script, documented in ADR-008. No dependency was added. A test against the actual installed worker reproduced the failure before the repair and passes afterward.

## Evidence

- Clean `npm ci` under Node 24 applied the guarded patch successfully.
- `npm run verify` passed: strict TypeScript, ESLint, formatting, 16 unit tests, 9 integration tests and iOS/Android/web exports.
- New integration cases verify v1→v2 upgrade and reopen, retained check-ins, valid/invalid edits, complete/unique ordering, no partial invalid reorder, boundary moves, archival, blocked archived check-ins, idempotent restore and persisted order.
- Browser: original habit and completed day survived migration; editing/name/icon/color survived reload; archive survived reload; restoration preserved the completed day; six demonstration habits rendered; move-up survived reload; three current-day wins remained after reload.
- At 390px and 360px, the list and editor were inspected with no horizontal overflow. Six habits expose 84 date cells (14 each). Long names wrap/truncate without covering completion controls. The editor provides labeled selected radio states. Native screen-reader/system-font checks remain pending.
- Screenshots: today-management-390.png, today-management-360.png, editor-management-360.png, archived-360.png and long-name-360.png under docs/screenshots.
- Maestro management flow is prepared in .maestro/habit-management.yaml but has not been run because native tools remain unavailable.

## Boundaries and next milestone

Icons use system emoji and can differ across platforms. Daily schedules remain the only frequency. Archived periods are not excluded from streak arithmetic after restore; no missed days are backfilled and no historic dates are rewritten. Define archived-period eligibility when insights ships.

Browser SQLite remains a single-tab, development-only alpha adapter. Upgrading expo-sqlite requires reviewing/removing its guarded patch. Native builds/E2E and the prior dependency audit findings (18 high/14 moderate) remain unresolved; no native runtime or all-green security claim is made.

The preview remains open with six clearly ordinary demonstration habits. These are local preview records, not automatically seeded production data; no old completions were invented. No commit, push or store release occurred.

Next product slice: selected-weekday schedules with explicit date eligibility and deterministic tests, followed by habit detail/metrics. Native validation and dependency remediation continue to be separate acceptance gates before release.
