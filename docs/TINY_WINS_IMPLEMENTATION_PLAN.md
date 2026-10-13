# Tiny Wins — Implementation Plan

> Status: approved direction · Version: 0.2 · Product direction: **Option A — Compact List**
>
> Product promise: **Small steps. Big changes.**
>
> Principle: **Consistency over perfection.**

## 0. How to use this document

This is the initial source of truth for product scope, architecture, implementation sequence, and the agent harness. Put it at `docs/IMPLEMENTATION_PLAN.md` in the repository. Decisions marked **Proposed** require an explicit architecture decision before implementation. Do not interpret examples as existing code or established conventions from other projects.

### Evidence and provenance

The product requirements below come from our Tiny Wins design discussion. Previous harness discussion established the principles of constrained action spaces, durable state, tool permissions, idempotency, traces, budgets, stall detection, and **harness-verified completion**. An earlier Elixir discussion also covered pure pipelines and table-driven ExUnit tests, but that was not verified as a convention of any of the four named repositories.

**Not verified:** actual harness files, scripts, agent rules, CI workflows, stacks, and coding conventions of **Moonvault, Braw, Decade Test, and Pegarr**. Do not claim the following proposed structure is copied from those projects. Before adopting project-specific patterns, inspect those repositories and record findings in `docs/HARNESS_AUDIT.md` with source paths and commit hashes.

## 1. Product definition

Tiny Wins is a fast, welcoming habit tracker where each habit has its own visual history. Users should be able to open the app, see their habits, record today's wins, and leave in seconds. The UI celebrates cumulative progress instead of punishing broken streaks.

### Target MVP

1. Create, rename, archive, and reorder habits.
2. Assign each habit an icon and a distinct color.
3. Define daily or selected-weekday schedules (start with these two frequency types).
4. Show a compact list of habits, with **14 date-aligned squares per habit**, latest day highlighted.
5. Tap today's square or explicit check button to toggle completion; provide immediate visual feedback.
6. Open a habit detail screen with its full yearly grid, current/best streak, eligible-day consistency, and total completions.
7. Edit past entries deliberately, with date confirmation and undo where practical.
8. Keep data on device across app restarts; support export/import of user data.
9. Basic settings, accessible light theme, empty states, and reduced-motion support.

### Explicit non-goals for MVP

Accounts, cloud sync, social feeds, leaderboards, AI coaching, complex quantified goals, subscriptions, cross-platform widgets, notifications, and analytics SDKs. Add these only through separate decisions after validating the core interaction.

### Product rules

- Each square represents **one calendar day**, not one streak unit or a score intensity.
- The wall always has its complete date grid: completed days are colored; missed eligible days are pale; future days are neutral/disabled; days not scheduled are visually distinct.
- Streak = consecutive **eligible scheduled dates** with a completion, ending on the most recent eligible date (today may be pending without breaking the streak). Define this precisely in tests.
- Consistency = completed eligible dates / elapsed eligible dates in the selected period. Exclude future and unscheduled dates; document treatment of pre-creation dates and archived habits.
- A missed day never deletes previous completions.
- Repeated toggles must be deterministic; mutations should not create duplicate records.
- Time zones and local calendar dates matter more than UTC timestamps for habit completion.

## 2. UX / design system

### Navigation

**Today** (default) → **Habit detail** → **Insights** → **Settings**. Keep bottom navigation minimal: Today, Insights, Settings; detail is reached from a habit row.

### Today — Option A

Each compact row contains: icon, habit name, current streak or short supporting metric, optional consistency %, **14 squares**, and a large, accessible completion control. Make the square for today identifiable and interactive. Do not make the entire historical grid a completion trigger.

- Tap check/today: complete or undo today.
- Tap habit title/row body: open detail.
- Tap historical square: inspect date; editing requires a separate explicit action.
- Provide tactile/visual confirmation without a blocking modal.
- Long names truncate gracefully; large text and screen readers remain usable.
- On smaller screens, ensure the 14-square row fits or uses a documented responsive layout; never silently change the number of represented days.

### Habit detail

Year selector; 365/366 date cells grouped in a clear calendar grid; legend for complete/missed/not scheduled/future; stats for current streak, best streak, consistency, and total completions. Add an accessible alternative to interpreting colors alone.

### Design tokens (starting proposal)

| Token | Value | Use |
|---|---|---|
| `forest` | `#294B3B` | Primary actions, headings |
| `sage` | `#8FB9A0` | Positive UI |
| `mint` | `#CFE2D6` | Soft progress surfaces |
| `apricot` | `#F2BE91` | Small celebratory accents |
| `ivory` | `#FAF8F4` | Background |
| `charcoal` | `#2F2F2F` | Body text |

Per-habit colors: blue, coral, teal, violet, amber, indigo, etc., each with a light and strong token; verify contrast. Typography: **Fraunces** for editorial headings and **Inter** for UI. Four rounded squares (three sage/green, one apricot) for the app icon. Avoid relying on the bunny mascot for core navigation; illustrations are optional embellishments.

### UX acceptance tests

- Check-in achievable in one deliberate tap from Today.
- Completed state visible instantly and after relaunch.
- User can tell which square is today and which days were missed.
- Each habit's colors are consistent between list and detail.
- VoiceOver/TalkBack (depending on platform) can identify each control and date state.
- Empty, loading (if applicable), and error states have designed copy.

## 3. Architecture decisions — approved baseline

**ADR-001 — iOS-first, Android-ready.** Use **React Native + Expo + TypeScript** with Expo Router. Ship iOS first, but use cross-platform APIs and components by default. Any platform-specific module must be isolated behind a documented interface with an Android implementation or fallback. Test an Android development build during the initial technical spike, then run periodic Android smoke builds; Android store release is not in the MVP scope. Choose dependency versions compatible with the Expo SDK selected at bootstrap; do not hard-code unverified latest-version claims.

**ADR-002 — Paid app distribution.** The official iOS app is a **paid download** on the App Store, purchased once through Apple's storefront pricing. **No in-app purchases, paywall, subscription, RevenueCat, license verification, or entitlement service** in the MVP. All app functionality is available after installation. Configure the Paid Apps Agreement, pricing, tax/banking details and availability in App Store Connect; verify current Apple policies before submission. Open-source code may be built independently, subject to the chosen license; users pay for the convenience of the official signed, maintained distribution. Pricing and open-source license remain decisions to finalize before release. Avoid promising perpetual updates or irrevocable availability.

**ADR-003 — Local-first persistence.** Use **Expo SQLite + Drizzle ORM** (subject to compatibility spike), schema migrations and repository interfaces. No login, cloud backend or sync in MVP. Use versioned JSON export/import for portability and backups.

**ADR-004 — Date and streak semantics.** Record completion by immutable local calendar date and explicit timezone context; keep eligibility, streak and consistency calculations in pure TypeScript functions. Test DST, travel, leap days, schedule edits and clock changes. Do not treat a skipped unscheduled day as a failed scheduled day.

**ADR-005 — Future sync boundary.** Use stable UUIDs, repository interfaces and migration discipline, but do not implement speculative sync infrastructure.

### Implementation stack

| Area | Decision | Notes |
|---|---|---|
| Mobile UI | React Native + Expo + TypeScript | Shared iOS/Android codebase |
| Routing | Expo Router | Route-driven screens |
| Storage | Expo SQLite + Drizzle ORM | Verify migrations and compatibility in spike |
| UI state | React state; Zustand only if justified | Avoid unnecessary global state |
| Animation | React Native Reanimated | Keep reduced-motion fallback |
| Domain tests | Vitest | Pure logic and deterministic clock fixtures |
| Component tests | React Native Testing Library (compatible runner) | Confirm Expo/RN test tooling during bootstrap |
| Device E2E | Maestro | iOS primary, Android smoke scenario |
| CI | GitHub Actions (proposed) | Format, lint, types, unit tests, builds as feasible |

### Architecture boundary

```text
Expo Router screens / reusable components / design tokens
                  ↓
Application use cases (create habit, toggle day, fetch history)
                  ↓
Pure TypeScript domain (eligibility, streak, consistency, grid)
                  ↓
Repository interfaces
                  ↓
SQLite + Drizzle adapter / versioned export-import
```

**Cross-platform gate:** agents must not introduce `*.ios.*` code or iOS-only dependencies without recording the Android strategy and a corresponding validation task. Avoid sharing business logic with UI components. Keep the habit grid rendering independent from storage.

### Store distribution and licensing checklist

1. Enroll in the Apple Developer Program and configure App Store Connect agreements, tax and banking as applicable.
2. Create a **paid** app listing and set territory-specific pricing; do not create an IAP product.
3. Prepare bundle ID, app icons, screenshots, privacy disclosures, support URL and release signing.
4. Select an open-source license and review dependency licenses; document differences between source distribution and official store binaries, including trademark use.
5. Verify Apple's current review, privacy and paid-app requirements before release.
6. For Android later, choose a paid-download Google Play listing and independently confirm platform policies; do not assume Apple purchase transfers across stores.

## 4. Data model (logical, storage-agnostic)

```text
Habit
  id: UUID
  title: string
  icon: string
  color_key: enum/string
  schedule: Daily | Weekdays(set of weekdays)
  created_at: timestamp
  starts_on: local date
  archived_at: nullable timestamp
  sort_order: integer

Completion
  habit_id: UUID
  local_date: YYYY-MM-DD
  completed_at: timestamp
  updated_at: timestamp
  PRIMARY KEY (habit_id, local_date)

Preferences
  timezone_id: IANA timezone
  theme: system | light | dark (dark may be post-MVP)
  week_starts_on: weekday
  reduced_motion: boolean (or follow OS)
```

A completion is binary in the MVP. Keep `completed_at` for audit/debugging but use `local_date` for calendar placement. Schedule changes should not rewrite historical records; explicitly define whether historic consistency uses current or historical schedules. **Recommended:** model schedule effective dates if editing schedules ships in MVP; otherwise defer schedule editing and document the limitation.

### Pure domain functions

```text
is_scheduled(habit, local_date) -> boolean
calendar_cells(habit, completions, start_date, end_date, today) -> Cell[]
current_streak(habit, completions, today) -> integer
best_streak(habit, completions, interval) -> integer
consistency(habit, completions, interval, today) -> percentage
```

Use injectable clock and timezone context. Cover leap years, DST transitions, first day, gaps, future dates, weekly schedules, and late-night timezone changes.

## 5. Agent harness — proposed operating system for development

### Principles recovered from earlier harness discussion

1. **The model proposes; the harness verifies.** An agent's statement that work is done is not completion.
2. **Constrain the action space.** Narrow task scopes, allowed paths, tool permissions, and explicit acceptance criteria.
3. **Make state durable.** Keep decisions, task status, failures, and handoffs in repository files rather than relying on chat memory.
4. **Make actions observable.** Record commands, test results, changed files, and decision rationale.
5. **Make operations idempotent.** Re-running a task should not silently duplicate data, files, or migrations.
6. **Use bounded execution.** Limit retries, tool calls, and time; detect repeated failures and escalate rather than looping.
7. **Separate permissions.** Read-only discovery, normal implementation, and sensitive actions (secrets, release, destructive migrations) should have different approval requirements.
8. **Define exit criteria.** Done means deterministic gates pass and the requested scope is satisfied.

These are recovered principles, **not verified repo-specific implementation details** from Moonvault/Braw/Decade Test/Pegarr.

### Suggested repository harness structure

```text
AGENTS.md                        # global agent operating contract
README.md                        # user-facing overview and setup
CONTRIBUTING.md                  # contributor workflow
LICENSE                          # chosen after ADR
Makefile or justfile             # stable entrypoints; select one
.harness/
  tasks/                        # one scoped task per file
  templates/task.md
  runs/                         # optional sanitized run summaries
  checks.md                     # exact required gates
  decisions.md                  # active constraints and unresolved issues
  backlog.md                    # ordered slices
  audit.md                      # harness changes
 docs/
  IMPLEMENTATION_PLAN.md
  PRODUCT_SPEC.md
  DESIGN_SYSTEM.md
  HARNESS_AUDIT.md
  adr/
 src/                            # actual structure determined by stack
 tests/
 .github/workflows/              # CI checks
```

Avoid creating empty scaffolding just for appearances. Add directories when used. Keep run logs sanitized; never commit secrets or personal user data.

### `AGENTS.md` contract

- Read `README.md`, this plan, relevant ADRs, and `.harness/checks.md` before modifying code.
- Select one small task; state goal, allowed scope, constraints, tests, and expected deliverables.
- Inspect existing conventions before editing; prefer minimal diffs and no speculative refactors.
- Never claim verification without actual command output.
- Never bypass failing checks by deleting tests or weakening assertions.
- Do not change dependencies, permissions, release configuration, or schema destructively without explicit approval.
- Write or update tests for domain behavior before/alongside implementation.
- At end, report changed files, verification commands/results, risks, and next step.
- Stop and ask for a decision when blocked by product ambiguity or repeated failures.

### Task template

```markdown
# Task: <id and title>
Status: ready | in-progress | blocked | verified
Goal:
Non-goals:
Files/modules allowed:
Dependencies:
Acceptance criteria:
Required tests:
Commands executed / results:
Open questions:
Handoff summary:
```

### Verification gates

Provide one stable command for each gate after choosing the stack:

- `setup`: reproducible dependency/bootstrap procedure.
- `format-check`: formatting without mutation in CI.
- `lint`: static linting.
- `typecheck`: where supported.
- `test-unit`: pure domain and application logic.
- `test-integration`: persistence, migrations, import/export.
- `test-ui`: key Today/detail interactions and accessibility checks.
- `build`: production-like build.
- `security`: dependency/secret scan with documented severity policy.
- `verify`: aggregate all required gates.

**Merge rule:** CI green + reviewed diff + acceptance criteria met + relevant documentation updated. For UI changes, add screenshot or snapshot review. Do not assert `verify` succeeded if a gate was skipped; mark it as not run with a reason.

### Run protocol

1. **Orient:** read task, repo state, relevant docs; ensure clean/understood worktree.
2. **Plan:** state the smallest coherent change and tests.
3. **Implement:** small, reversible commits; no unrelated edits.
4. **Observe:** run targeted tests, then required verification gates.
5. **Repair:** at most two identical retry cycles; diagnose root cause before more attempts.
6. **Record:** update task status and decisions; capture command results and known limitations.
7. **Exit:** mark verified only after harness gates pass; otherwise blocked with next action.

### Security and privacy boundaries

Local habit data is personal. Avoid analytics or telemetry by default. Never upload real habit databases into agent prompts, CI artifacts, or bug reports. Validate import files; avoid arbitrary filesystem access and unsafe deserialization. Keep signing keys and store credentials out of the repository. For any future sync, design encryption, account deletion, and threat model first.

## 6. CI / repository hygiene

- Protect main branch; PR-based changes with checks.
- Pin dependencies and runtime/toolchain versions where practical.
- Use lockfiles; keep reproducible setup instructions.
- Configure secret scanning and dependency vulnerability checks.
- Keep tests deterministic: fake clocks, fixed timezone fixtures, no network dependencies.
- Use fixtures for leap days, DST, scheduled weekdays, archived habits, and duplicates.
- Enforce migration tests before changing storage schema.
- Document release signing separately from development; restrict release credentials.
- Prefer short PRs that deliver a demonstrable vertical slice.

## 7. Phased implementation roadmap

### Phase 0 — Product and harness baseline

**Deliver:** confirm this plan; `docs/HARNESS_AUDIT.md` with verified/unverified practices from Moonvault, Braw, Decade Test and Pegarr; ADRs 001–005; license decision tracked; UX acceptance criteria.

**Exit:** iOS-first/Android-ready and paid-download model recorded, with open questions explicitly assigned.

### Phase 1 — Technical spike and harness bootstrap

**Deliver:** Expo + TypeScript scaffold, Expo Router, lint/format/typecheck/test commands, `AGENTS.md`, task templates, CI; SQLite + Drizzle migration proof; a six-habit mock Today screen with 14-day cells; check-in animation; **installable iPhone development build and Android smoke build**.

**Exit:** a clean checkout can run `verify`; sample records survive restart on iOS; Android opens the sample screen without platform-specific failures; dependency compatibility recorded.

### Phase 2 — Domain and storage

**Deliver:** habit/completion models, repositories, schema migrations, pure schedule/streak/consistency functions, versioned JSON export/import, deterministic fixtures.

**Exit:** edge-case tests pass; duplicate completions prevented; import/export roundtrip passes; data persists across restart.

### Phase 3 — Today / Compact List

**Deliver:** create/edit/archive/reorder habits, icon/color selection, **14 aligned daily squares per habit**, visible current-day check-in target, check/undo, empty states and accessible labels.

**Exit:** iOS E2E create → complete → restart → verify → undo passes; compact layout remains legible and usable with accessibility font sizes.

### Phase 4 — Habit details and insights

**Deliver:** individual year grid, historical editing, current/best streak, eligible-day consistency, total wins, and simple insights.

**Exit:** metrics match pure-domain tests, including 365/366-day calendars and scheduled weekdays.

### Phase 5 — Paid App Store launch

**Deliver:** paid-download listing, developer account agreements, store pricing, screenshots, privacy/support pages, signing, TestFlight, accessibility audit, upgrade/backup tests, release checklist. **No paywall or IAP implementation.**

**Exit:** release build passes iPhone device tests, App Store submission requirements are met, price is configured, and Android smoke regression is green (Android publication remains deferred).

### Phase 6 — After launch (not promised)

Consider Android store publication, widgets, notifications, dark mode, richer schedules and optional sync based on real feedback. Preserve no-subscription positioning.

## 8. Suggested first 10 tasks

1. Put this document in `docs/IMPLEMENTATION_PLAN.md`; create a decisions log and harness audit stub.
2. Record ADR-001 (React Native/Expo, iOS-first Android-ready) and ADR-002 (paid App Store download).
3. Scaffold Expo Router + TypeScript and define the `verify` command.
4. Configure ESLint, formatter, typecheck, Vitest and initial CI.
5. Prototype the compact six-habit Today screen and 14-day grid with static fixtures.
6. Run an iPhone development build **and** Android smoke build; record any differences.
7. Prove SQLite + Drizzle migrations and persistence across restart.
8. Implement pure domain models, schedule eligibility, date-cell generator and streak tests.
9. Connect real data, check/undo and habit creation; add Maestro iOS flow.
10. Build detail/insights and prepare the paid App Store release checklist.

## 9. Remaining decisions and validation questions

1. **Pricing:** select initial App Store price and launch territories.
2. **Open-source license:** choose license, attribution, trademark and contribution policy; review commercial distribution implications.
3. **Schedule edits:** historical effective-date behavior vs deferring changes.
4. **Missed days:** pale colored square vs neutral outline; distinguish unscheduled days.
5. **Check-in interaction:** tap today's square vs dedicated check control; usability-test discoverability.
6. **History editing:** unrestricted vs bounded time window.
7. **Timezones:** confirm immutable recorded local date policy and UI explanation.
8. **Brand:** check Tiny Wins naming, trademark, domain and store availability.
9. **Android:** determine release milestone after iOS launch; keep smoke checks from Phase 1.

## 10. Definition of done for the MVP

- A new user can create at least one habit and mark it complete within a short onboarding-free flow.
- Today displays **exactly 14 calendar dates per habit** and clearly identifies today's date.
- Completion state persists, supports undo, and is consistent between Today and detail.
- Year grid is per habit; no mixed global heatmap replaces the individual wall.
- Streak and consistency are correct for weekly schedules, gaps, leap days, and timezones.
- No account, paywall, IAP or recurring subscription is required; official iOS distribution uses a one-time paid App Store download.
- A working Android smoke build demonstrates cross-platform feasibility before the iOS MVP is complete.
- Data can be exported and restored.
- Accessibility, privacy, CI, security, and release gates are satisfied.
- The harness has verified completion with actual command results, not an agent assertion.

---

**Implementation kickoff:** complete Phase 0 first, then create one task file per vertical slice. Keep this plan updated through ADRs rather than silently changing scope.
