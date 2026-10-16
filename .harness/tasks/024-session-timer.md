# Task: 024 — Optional habit session timer

Status: planned, next after accepted 023
Goal: Offer an optional focus session associated with a habit and an explicit check-in when finished.
Non-goals: Automatic completion, background alarms, notifications, activity tracking or changing binary wins into duration scores.
Files/modules allowed: Timer domain/use case, habit detail UI, deterministic tests, native flows and docs/ADR.
Dependencies: No new dependency, permission or background capability authorized. Scope cross-platform lifecycle behavior in an ADR first.
Acceptance criteria:

- A user can start, pause, resume and cancel a session without writing a win.
- Finishing offers a separate deliberate completion action; completion remains once per local date.
- Define foreground/background, clock changes, restart and midnight behavior before implementation; show actual supported behavior honestly.
- Preserve existing habit history and allow ordinary check-ins without using the timer.
- Main controls meet accessibility/reduced-motion requirements and work in both interface languages.

Required tests: Deterministic injected-clock/lifecycle tests; npm run verify; narrow/enlarged text browser and iOS/Android lifecycle smoke acceptance where available.
Commands executed / results: Planning only, placed after flexible weekly goals by owner request on 2026-10-15.
Open questions: Countdown versus stopwatch, process-restart behavior and supported background scope require an ADR.
Handoff summary: Fourth in the approved sequence. Weekly goals 023 now has full eleven-case native acceptance (38835720955); this task is next and is not implemented.
