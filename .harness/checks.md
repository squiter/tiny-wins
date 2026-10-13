# Verification gates

Required local aggregate: `npm run verify` (types → lint → format → unit → real SQLite integration → iOS/Android/browser JS exports). CI reproduces it with Node 24 and `npm ci`, then `npm run security`, which fails on high/critical dependency findings. Never describe skipped gates as passed.

Device acceptance: install native app on a dedicated test device, run `npm run test:e2e`; test the same Maestro flow on iPhone and Android. Review screenshots at narrow widths and enlarged system text; check VoiceOver/TalkBack and reduced motion. Exports are not native build evidence.

Native tooling, store accounts, licensing and hosted branch protection are outside the secret-free CI gate. Record unavailable checks and next actions in the task/report. Never upload user habit databases.

Browser preview acceptance: npm run preview, open http://localhost:8090, create → complete → reload → verify → undo → reload → verify. Confirm exactly 14 accessible dates per habit and inspect list/form at 390px and 360px. Reopen a new tab to check origin-scoped storage. This does not replace native Maestro.
