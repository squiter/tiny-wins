# Task: 019 — First App Store release preparation

Status: complete (preparation only; release gates remain open)
Goal: Choose release readiness over additional features and give the owner a practical Portuguese first-publication guide.
Non-goals: Enrollment/payment, signing contracts, uploading builds, publishing, dependency changes, final pricing/license decisions or speculative product features.
Files/modules allowed: docs/release, README.md, delivery/security reports, backlog and this task.
Dependencies: Official Apple/Expo documentation; existing local/hosted verification.
Acceptance criteria:

- Audit current source/configuration and actual CI/security results; distinguish working MVP from submission readiness.
- Preserve owner plan changes. Keep Tiny Wins and one-time paid download, confirmed by owner; account enrollment starts from zero.
- Write a step-by-step guide covering enrollment, seller identity, paid agreements, app identity/listing, production signing/build, TestFlight, metadata/privacy/screenshots, review and manual release.
- Create a tracked release checklist and reusable listing drafts without inventing support contact, price, legal identity or completed evidence.
- Freeze optional features for the first release; record required device, security, branding/configuration and publication gaps, including enabled iPad support.
- Never present current debug/simulator artifacts or browser screenshots as store-ready builds/assets. Do not suppress audit failures or change release settings without the required decisions.

Required tests: Current npm audit and CI inspection; official source/link review; npm run verify; diff/format checks. Device E2E is unchanged by this documentation slice; record exact existing evidence and pending gates.
Commands executed / results: `npm run verify` PASS (70 unit + 22 real SQLite integration, strict types/lint/format, iOS/Android/web exports). Live `npm audit --json`: 18 high / 0 moderate / 0 critical; not passed. `npm ls braces node-forge --depth=6` confirms Expo CLI/Metro ancestry. `gh run view 38636973295`: verify PASS, dependency-audit FAIL; Android 38636973497 PASS; iOS 38636973602 still compiling at inspection. `xcode-select -p`: CommandLineTools only. Official Apple/Expo links reviewed 2026-10-14. Local README/release links resolve; listing subtitle 28/30, promotional text 118/170, keywords 73/100. Prettier and diff checks PASS.
Open questions: Individual/organization enrollment, final identifier ownership, support/privacy hosting and contact, price/license, production build route and iPad acceptance.
Handoff summary: Portuguese first-publication guide, release evidence/checklist and reusable storefront/reviewer drafts delivered; README, security report, delivery report and backlog updated. The owner confirms no Apple enrollment yet and retains Tiny Wins/one-time paid download. Recommend freeze optional features and close security, icon/System appearance configuration, production/device/iPad and public privacy/support gates first. No account/payment/agreement/dependency/release-config/upload/publication action performed. Owner implementation-plan edits preserved. Device E2E was not repeated for documentation-only changes; final-source native acceptance remains explicitly pending. Next slice: scoped release hardening, beginning with icon and System appearance, alongside security resolution.
