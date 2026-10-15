# First release readiness — Tiny Wins

Reviewed 2026-10-15 against source `ca24722`. **Not ready for submission; remaining production/device/store gates still apply.** The owner confirms Tiny Wins and a one-time paid download; Developer Program enrollment has not started. Preparation does not authorize signing agreements or spending on the owner's behalf.

## Current evidence

- Task 022: owner-conditionally-approved temporary tooling policy (ADR-020). Raw audit remains 18 high; strict policy checks patched bytes/ancestry and expiry. Inspected production iOS source map: 1,685 sources, no braces/node-forge. This does not certify the final signed IPA; inspect that candidate before submission. Previous statements about unapproved policy are superseded.

- Task 020 follow-up: local verification passes 92 tests/exports. Automatic config generates Automatic for iOS; literal title create/edit/reload passes in synthetic browser. Matching native eight-flow acceptance PASSED in run 38656406501 (iPhone 17 Pro / iOS 26.5). Registry still publishes braces 3.0.3 and node-forge 1.4.0. Owner handles enrollment separately.

- `npm run verify` on app source `7e38767`: 70 unit + 22 real SQLite tests, types/lint/format, iOS/Android/web exports PASS. `6524866` changes documentation only; hosted Validate 38636973295: verify PASS, separate audit FAIL.
- `npm audit --json` refreshed 2026-10-14: 18 high, 0 moderate/critical. Roots: braces 3.0.3 and node-forge 1.4.0 via Expo CLI/Metro. Tested source patches do not make the published-version audit pass. See ADR-012 and CI_SECURITY_REPORT.
- iPhone simulator 38629308028 on `a4c985c`: six flows PASS, including accessibility-large. This precedes the footer refinement; do not claim final-source runtime evidence from it.
- Android compilation 38636973497 on `6524866` PASS. Final matching iOS compilation 38655197293 and runtime 38656406501 PASS on ca24722. No Android runtime, physical VoiceOver or native backup-dialog acceptance claimed.
- `app.json`: version 0.1.0, provisional `app.tinywins.mobile`, `supportsTablet: true`, `userInterfaceStyle: light`, no configured app icon. Only rabbit illustration exists in assets. No EAS project/profile, public support/privacy pages or selected source license found.

## Submission gates

| Gate                | State                                                         | Concrete next action                                                                                                                        |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Core MVP            | Implemented, local verification passes                        | Freeze optional features; retain existing regression gates                                                                                  |
| Security            | Raw 18 high; conditional tooling policy                       | ADR-020 accepts exact verified tooling patches until 2026-10-22T00:00:00Z; inspect signed candidate and adopt upstream fixes when available |
| Apple account       | Owner has none                                                | Owner chooses individual/organization, enrolls, signs and pays                                                                              |
| Paid distribution   | Model confirmed; account setup pending                        | Owner activates Paid Apps Agreement, tax/bank details and chooses price/territories                                                         |
| Identity            | Name confirmed; availability/identifier unverified            | Register final App ID with owner's team before first upload                                                                                 |
| Branding            | Icon absent                                                   | Produce native store icon and opening appearance; review before config                                                                      |
| System appearance   | iOS System/override acceptance PASS                           | iPhone eight-flow 38656406501 passes; Android RN fallback/runtime gate remains in ADR-017                                                   |
| Production artifact | Not built/signed                                              | Decide EAS/Xcode route, add reviewed release configuration, compile standalone signed .ipa                                                  |
| Native runtime      | Final source passes eight simulator flows                     | Eight flows PASS on final source ca24722; TestFlight install/offline/restart/update validation remains                                      |
| Backup UX           | Browser/SQLite verified; device dialogs pending               | Export → cancel/import → restore on dedicated iPhone; no real user files                                                                    |
| Accessibility       | Labels/contrast/enlarged simulator evidence; physical pending | VoiceOver, reduced motion and usable controls on supported devices                                                                          |
| iPad                | Enabled; untested                                             | Validate iPad layout, backup and screenshots, or approve iPhone-only release scope                                                          |
| Store screenshots   | README images are web previews                                | Native final-build captures in Apple's accepted device dimensions                                                                           |
| Privacy/support     | No public pages/contact                                       | Confirm contact/host, prepare/publish pages, link policy inside app and in listing                                                          |
| Privacy/compliance  | Proposed local-only disclosure                                | Inspect final SDK manifests/network behavior, answer privacy/encryption/age questions accurately                                            |
| Licensing           | Unselected                                                    | Decide code license/trademark policy; check font/dependency/asset licenses                                                                  |
| Review and launch   | Not submitted                                                 | Owner approves complete listing/build; App Review; manual release after approval                                                            |

## Device acceptance record

For each run record source SHA, version/build, device/OS, date, tester and evidence. Keep these boxes unchecked until performed on the signed candidate:

- [ ] Fresh install opens without Metro or login, works in airplane mode.
- [ ] Create → complete → close/reopen retains exactly 14 date cells and saved history.
- [ ] Schedule/tolerance changes preserve earlier dates; archived habits and notes restore.
- [ ] Individual/all-day feedback, disabled feedback and OS reduced motion behave correctly.
- [ ] System, Light and Dark preferences follow intended native behavior after restart.
- [ ] JSON export/share, picker cancellation, invalid file rejection and repeat restore work.
- [ ] Update over an older build preserves habits/wins/notes/preferences without uninstalling.
- [ ] Export before reinstall; restore after reinstall; explain local storage limitation.
- [ ] VoiceOver and enlarged text work on supported iPhone/iPad; privacy link is reachable.
- [ ] No unapproved network collection; inspect final privacy manifest/export compliance.

Future features remain tasks 014/017/018 and the owner roadmap. Portuguese is a worthwhile follow-up for a Brazilian audience, but current release copy must describe the English interface honestly. No release date committed.
