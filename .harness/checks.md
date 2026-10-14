# Verification gates

Required local aggregate: `npm run verify` (types → lint → format → unit → real SQLite integration → iOS/Android/browser JS exports). CI reproduces it with Node 24 and `npm ci`, then `npm run security`, which fails on high/critical dependency findings. Never describe skipped gates as passed.

Device acceptance: install native app on a dedicated test device, run `npm run test:e2e`; test the same Maestro flow on iPhone and Android. Review screenshots at narrow widths and enlarged system text; check VoiceOver/TalkBack and reduced motion. Exports are not native build evidence.

Native tooling, store accounts, licensing and hosted branch protection are outside the secret-free CI gate. Record unavailable checks and next actions in the task/report. Never upload user habit databases.

Browser preview acceptance: npm run preview, open http://localhost:8090, create → complete → reload → verify → undo → reload → verify. Confirm exactly 14 accessible dates per habit and inspect list/form at 390px and 360px. Reopen a new tab to check origin-scoped storage. This does not replace native Maestro.

## Keep the harness current

Every new behavior must update its scoped task, acceptance criteria and required tests/flows, plus backlog and delivery evidence. Record new architecture decisions in ADRs. Keep commands/results and unavailable gates explicit; do not mark native acceptance from a browser screenshot or a successful export. Preserve owner edits to the plan.

Celebration acceptance: successful changed win → brief individual feedback; the last positive planned win today → distinct all-day feedback. Undo, duplicate marks, failed writes and reading/restoring/reloading data must not create a celebration. A day with no positive planned opportunities must never claim an all-day celebration; deliberately recording an eligible past win may receive individual feedback. Verify saved animation disable/re-enable, no replay and OS reduced motion; static win/tolerance/note state and exactly 14 Today dates remain correct.

Native scrolling controls: center off-screen/partially covered targets before tapping so the tab-bar inset cannot cover the hit target. An accessibility tree can still expose an off-screen row; diagnose with captured bounds and screenshots, including enlarged text. First/last items of a full-screen modal may be impossible to center: require full visibility and safe-area evidence instead of repeatedly scrolling past the content end. Note actions use a fixed footer above the keyboard. Keep exact text, selected-state and restart assertions; preserve both new-feature and regression JUnit reports.

System appearance acceptance changes the dedicated simulator OS style, captures readback and asserts the resolved app palette, not only the selected radio. Verify stored Light/Dark overrides after restart and switching back to System. Preserve management fixture data for enlarged text. Habit-name acceptance checks exact draft text before closing the editor and exact saved title afterwards; diagnose malformed input rather than accepting changed names.
