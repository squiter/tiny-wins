# Task: 008 — Insights victory tiles

Status: planned, explicitly deferred by owner
Goal: make Insights a satisfying overview of the sequence of wins, one tiled history per habit, guided by docs/inspirations/Insights Victory Tiles Reference.png.
Non-goals: heat intensity, quantified/partial completions, a mixed global heatmap, punitive loss of history, implementing this in the security slice.
Files/modules allowed: Insights UI, shared date-cell presentation, pure metrics, visual/accessibility verification.
Dependencies: existing immutable local dates/effective schedules and calendar preferences.
Acceptance criteria:

- Show every habit's own colored tile wall and identity together, with week/month/year period controls and clear navigation to today.
- Each eligible date has a binary completion state; a win fills the tile with that habit's color and a non-color mark. No intensity scales.
- Show skipped/not-scheduled, before-creation, future and missed dates distinctly without counting them all as failures.
- Preserve cumulative wins even after a broken streak. Completing a tile provides restrained, rewarding feedback; reduced motion uses instant feedback.
- Keep period counts/consistency tied to pure eligible-day metrics; no invented sample history.
- Respect Sunday/Monday week start, leap years, narrow screens and enlarged text. Tile inspection exposes full dates/states; edits require deliberate confirmation.
- Today keeps its exact 14 date-aligned cells and quick check-in flow.
  Required tests: date alignment/eligibility/period boundaries; real browser/mobile screenshots based on actual records; accessibility/reduced-motion review and native regression when available.
  Commands executed / results: planning only; implementation intentionally deferred.
  Open questions: choose compact wall density and progressive loading after mobile prototype review; reference is guidance, not a pixel-perfect mandate.
  Handoff summary: this visualization is central product value, not an optional heatmap decoration. Prioritize after CI/security remediation.
