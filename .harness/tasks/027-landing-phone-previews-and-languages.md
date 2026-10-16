# Task: 027 — Phone-sized previews and bilingual landing page

Status: implemented; publication verification pending
Goal: Replace scroll-length screenshot mockups with honest phone viewport captures; deliver English/Portuguese pages with browser language detection and a saved override.
Non-goals: App feature changes, dependencies, store settings, tracking or edits to the owner's implementation-plan changes.
Files/modules allowed: website/, website check scripts and Pages workflow/native path filters, docs/WEBSITE.md, ADR-023, README and harness.
Dependencies: Existing example screenshots and fonts only; no new packages.
Acceptance criteria:

- Today/Insights use real 390×844 or 360×800 viewport captures, retaining their original proportions without stretching, cropping, rotation or tall scroll-page mockups.
- All phone frames have natural mobile proportions; screenshots load without layout shift at desktop and 360/390px widths.
- English is the static default and fallback. Portuguese has complete landing/support/privacy pages. First visit follows supported browser language; a visible accessible selector offers Browser language, English and Português.
- Manual language choice persists across reload and internal navigation; returning to Browser language clears the override. Detection handles missing/blocked storage and unsupported languages without breaking links or causing redirect loops.
- Language switches retain the current page and fragment, support /tiny-wins/ hosting and local preview, and update document language/title/alternatives with complete localized static HTML.
- No analytics, cookies, account, remote translation service or dependency added. A local preference stores only the website language.
- Extend artifact/link checks and deterministic language tests, review desktop/mobile plus EN/PT/support/privacy in the browser, update documentation and deploy.

Required tests: Python site/artifact check, Node language routing tests, npm run verify, desktop/mobile browser review and published Pages verification. Native E2E not applicable to this static-site slice.
Commands executed / results:

- Python site check PASS: all six localized pages, image header/intrinsic dimensions, phone proportions, links/fragments, assets, selectors and artifact boundary. Source captures copied unmodified; no scroll-page images remain.
- `node --test scripts/check-website-language.mjs`: 6/6 PASS, covering browser priorities/Portuguese variants/English fallback, overrides, saved preference reset, unavailable/throwing storage, project/local URLs, page/fragment preservation and stable paths.
- `npm run verify`: PASS, types/lint/format, 115 unit + 26 real SQLite integration tests, web/iOS/Android exports. Log: /tmp/tiny-wins-landing-languages-verify.log. Final rerun PASS after all code changes: /tmp/tiny-wins-landing-languages-final-verify.log.
- Browser: desktop plus 360×800 and 390×844. Intrinsic/rendered screenshots: 390×844 → 244×528.03, 360×800 → 231×513.33, 390×844 → 226×489.08. Proportions retained, no image rotation/cropping.
- Actual UI verified English/Browser initial state → Portuguese → reload → root without query retains Portuguese → Support → English retains support page → Privacy → Browser reset → home; direct root after reset resolves English/Browser. English #lancamento → Portuguese preserves #lancamento. Portuguese privacy copy and language preference disclosure reviewed. No horizontal overflow (345/360 and 375/390). Viewport reset.
- Browser Portuguese/unsupported-language resolution and blocked storage are deterministic tests, not claims of changing the host browser's settings. No-JS static alternative paths checked; disabling the live browser's JavaScript was not tested.
- Initial localhost browser connection timed out despite HTTP 200 from curl; documented browser recovery opened a fresh tab at confirmed 127.0.0.1:8093 successfully. No app server or personal habit data was touched.
- Published Pages check pending commit/push. No native E2E: app UI/storage unchanged.
  Open questions: None blocking. Store links/price remain deferred.
  Handoff summary: Preserve owner-modified docs/IMPLEMENTATION_PLAN.md and existing app work.
