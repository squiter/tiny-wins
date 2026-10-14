# Task: 014 — Widget feasibility and platform contract

Status: ready
Goal: Select a small, reliable home-screen widget slice after notes/appearance native acceptance.
Non-goals: Live Activities, push notifications, remote services, silent completion or shared-database relocation without evidence.
Files/modules allowed: Scoped proposal/ADR, synthetic prototype and native test harness only after dependencies/entitlements are explicitly authorized.
Dependencies: None installed. Evaluate the SDK 57-compatible widget module and an Android implementation/fallback before any native code lands.
Acceptance criteria:

- Propose pending-habit summary and small binary victory tiles; identify which widget interactions can safely use the existing completion service.
- Define supported iOS sizes, Android strategy and web fallback in an ADR before implementation.
- Validate freshness after mark/undo, midnight, timezone change, schedule edit, archive/restore and app termination. Never show yesterday as today silently.
- Keep SQLite the app's source of truth. Decide a minimal derived snapshot and reconcile stale/duplicate actions; preserve original local dates.
- Explain widget privacy (habit names on the home screen); omit private note contents.
- Review exact dependency versions, App Group/extension identifiers, entitlements and signing changes for explicit owner authorization.
- Native proof: add/remove widget, cold start, theme/tinted rendering, app/background/terminated updates and duplicate taps. Retain Android smoke coverage.

Required tests: Pure snapshot/date/action rules; app/widget consistency on dedicated native devices or simulators; cross-platform builds; npm run verify.
Commands executed / results: Read current [Expo SDK 57 widget documentation](https://docs.expo.dev/versions/v57.0.0/sdk/widgets/) on 2026-10-14. It documents iOS support, an extension with App Group sharing, and an isolated synchronous layout runtime without React hooks or access to app state. It exposes interaction events, but that alone does not prove reliable background completion; test this before promising quick checks.
Open questions: Exact Android support path, background reconciliation, signing identifiers and release-device acceptance.
Handoff summary: Feasibility first; no dependency, permission, entitlement or widget implementation has been added.
