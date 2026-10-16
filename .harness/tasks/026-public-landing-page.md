# Task: 026 — Public Tiny Wins landing page

Status: complete
Goal: Introduce Tiny Wins while store enrollment is pending, with an honest release status and real example screenshots.
Non-goals: App features, store submission, email collection, analytics, new packages, purchase flows or changes to the owner's implementation-plan edits.
Files/modules allowed: website/, scripts/check-website.py, Pages workflow, native workflow path filters, README, website ADR and harness documentation.
Dependencies: Existing bundled fonts/screenshots; GitHub Pages and owner-authorized publication. No npm additions.
Acceptance criteria:

- Responsive Portuguese landing page follows ivory/forest/sage/Fraunces design with three real app screenshots; no duplicated decorative header/footer image.
- Explain binary victory tiles, weekly goals, daily tolerance, local data and one-time iPhone download; identify previews and pending releases honestly.
- Store placeholders are readable status panels, not dead buttons. In-page navigation, support and privacy links work without JavaScript.
- Accessible image descriptions, keyboard focus, skip link, 48px main actions, reduced-motion support and no mobile overflow.
- Public artifact includes only website files; no databases, backup data, secrets, source app or node_modules.
- Independent Pages check/deploy workflow; PRs check without publishing. Website-only edits skip native builds, while app validation stays unchanged.
- Update harness/docs and inspect desktop/mobile before publication.

Required tests: python3 scripts/check-website.py; npm run verify; desktop/mobile browser review. Native E2E not applicable: app source and storage unchanged.
Commands executed / results:

- `python3 scripts/check-website.py`: PASS, 3 pages, local links/fragments, assets and artifact boundary. First run correctly rejected a README in the public folder; moved the operational guide to docs/WEBSITE.md.
- `npm run verify`: PASS, types/lint/format, 115 unit + 26 real SQLite integration tests, web/iOS/Android JS exports. Log: /tmp/tiny-wins-landing-verify.log.
- Targeted Prettier check and `git diff --check`: PASS.
- Browser review: desktop, 360×800 and 390×844. All 4 images loaded, no horizontal overflow (345/360 and 375/390), release anchor at ~30px from top, support/privacy navigation, keyboard Tab reveals skip link at y=10. Mobile document header return link corrected during review. Viewport reset afterwards.
- GitHub Pages enabled with workflow build type; repository is public with issues enabled. Deployment PASS: [38936101284](https://github.com/squiter/tiny-wins/actions/runs/38936101284), both check/deploy jobs succeeded for 451ac3a. [Public site](https://squiter.github.io/tiny-wins/) verified in the browser with all screenshot/font-relative paths resolving; all four images loaded and no desktop overflow. Support/privacy stay under the project subpath.
- Native E2E not run: no app UI/storage changed. First integration commit also updates native workflow filters/docs and may trigger native builds; subsequent website-only changes skip them. Core Validate still runs.
  Open questions: Final store URLs and price deferred. Support uses public GitHub issues; do not submit personal history. Privacy page describes development version, with final release review still required.
  Handoff summary: Published at https://squiter.github.io/tiny-wins/. Store URLs/price and final release privacy review remain launch tasks. No edits to owner-modified docs/IMPLEMENTATION_PLAN.md. Session timer remains a separate planned app slice.
