# First release readiness — Tiny Wins

Reviewed 2026-10-16. Task 023 app source `cbb1610` adds flexible weekly goals; its current evidence follows. Tasks 017/018 remain covered by the regression suite below. **Not ready for submission; remaining signed-production/device/store gates still apply.** The owner confirms Tiny Wins and a one-time paid download; enrollment/access is with Apple support. Preparation does not authorize signing agreements or spending on the owner's behalf.

## Current evidence

- Task 028: [Android 10/16 emulator acceptance](../ANDROID_VALIDATION.md) PASS, with 15 passing native executions retained plus separate original diagnostics. Covers core persistence, weekly goals, notes, management, languages, saved/system appearance, 360 dp/font 1.5, keyboard/Back, reduced motion and native backup export/chooser/review/restore/restart/duplicate/invalid/cancel. Fixed the keyboard-covered note footer and enlarged tab-label clipping. Loaded production JS is verified directly, while the unchanged native APK remains debug build 38945776265. No dependency, permission, schema or release setting changed. The intermittent upstream development warning remains documented; physical/human accessibility, iOS regression of the tab-height adjustment and signed standalone/offline/update checks remain open.

- Task 023: flexible 1–7 day weekly goals, fixed saved boundaries, capped short weeks, week streaks and closed-week consistency. Local/hosted Validate 38835720911 PASS: 115 unit + 26 integration tests including real SQLite (141 total), types/lint/format and all exports. Current iOS build 38835721125 / Android build 38835720879 PASS. Full eleven-case iPhone 17 Pro / iOS 26.5 run 38835720955 PASS in 45m47s; six retrieved JUnit files contain eleven SUCCESS cases, no failures/errors/skipped cases. Reviewed weekly win/restart/edit/undo, Portuguese weekly target and fully visible enlarged Save/Cancel; OS readbacks confirm pt-BR/en, accessibility-large and dark/light. Matching artifact cbb1610 passes the strict app-input comparison with harness source 5b6ebd3. Metadata-only migration 9 preserves JSON/rows; backup v4 retains weekly policies and imports v1–v3. Isolated narrow light/dark browser review also passes. No package, permission, destructive schema or release setting changed.

- Task 018: optional, localized, fully editable new-habit ideas are implemented. Local and hosted Validate 38798469531 PASS: 99 unit + 24 integration tests including real SQLite (123 total), types/lint/format and all exports. Native iOS 38798469626 / Android 38798469627 builds PASS. Full ten-case iPhone 17 Pro / iOS 26.5 runtime 38800367178 PASS in 42m45s; six retrieved JUnit files contain ten SUCCESS cases, no failures/errors/skipped cases. Reviewed both languages, customized saved appearance and enlarged walking/Save/Cancel captures. OS readback confirms pt-BR/en and accessibility-large. No schema, dependency, permission or release setting changed.

- Task 017: English/Brazilian Portuguese/System selection, immediate copy/date updates, saved device preference and additive migration 8 are implemented. `npm run verify` passes 98 unit + 24 integration tests including real SQLite (122 total), types/lint/format and all three platform exports. Upgrade/reopen and backup restore preserve history and all preferences.
- Hosted Validate 38785802924 passes verify and dependency-audit. Native iOS build 38785802837 and ARM64 Android build 38785802721 pass. Full ten-flow iPhone 17 Pro / iOS 26.5 acceptance 38785809828 passes, including both language scenarios, notes, management, restart, OS light/dark and accessibility-large. No Android runtime, physical screen-reader or native backup-dialog acceptance is claimed.
- Task 022 / ADR-020: raw audit remains 18 high / 0 critical; the strict owner-approved temporary policy checks patched bytes, ancestry and expiry at 2026-10-22T00:00:00Z. Production iOS JS inventory inspects 1,693 sources on task 018 / Validate 38798469531 without braces/node-forge. This does not certify a final signed IPA; inspect that candidate and adopt corrected upstream packages when available.
- `app.json`: version 0.1.0, provisional `app.tinywins.mobile`, `supportsTablet: true`, `userInterfaceStyle: automatic`, four-square app/adaptive icons and native light/dark splash configured (task 031). No release profile, static supported-language configuration or storefront metadata was changed by task 017. Public support/privacy pages, licensing and final identity still need owner review.

## Submission gates

| Gate                | State                                                                           | Concrete next action                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Core MVP            | Implemented, local verification passes                                          | Task 023 accepted; timer 024 follows; retain all eleven native regression cases                                                             |
| Security            | Raw 18 high; conditional tooling policy                                         | ADR-020 accepts exact verified tooling patches until 2026-10-22T00:00:00Z; inspect signed candidate and adopt upstream fixes when available |
| Apple account       | Enrollment/access with support                                                  | Owner resolves access and confirms enrollment/team; owner handles agreements and payments                                                   |
| Paid distribution   | Model confirmed; account setup pending                                          | Owner activates Paid Apps Agreement, tax/bank details and chooses price/territories                                                         |
| Identity            | Name confirmed; availability/identifier unverified                              | Register final App ID with owner's team before first upload                                                                                 |
| Branding            | Four-square icon and native splash implemented; standalone Android runtime PASS | Review store identity with owner; new iOS runtime and physical-device acceptance pending; see [branding](../BRANDING.md)                    |
| System appearance   | iOS/Android emulator System/override PASS                                       | iPhone 38835720955 and Android task 028 pass; signed/physical release checks remain open                                                    |
| Production artifact | Not built/signed                                                                | Decide EAS/Xcode route, add reviewed release configuration, compile standalone signed .ipa                                                  |
| Native runtime      | iPhone suite and Android emulator scope pass                                    | iPhone 38835720955 / Android 028 PASS; signed standalone install/offline/update validation remains                                          |
| Backup UX           | Android native dialogs PASS; iPhone pending                                     | Android task 028 covers native share/picker/restore/error cases; verify signed candidates and dedicated iPhone                              |
| Accessibility       | Labels/contrast/enlarged simulator evidence; physical pending                   | VoiceOver, reduced motion and usable controls on supported devices                                                                          |
| iPad                | Enabled; untested                                                               | Validate iPad layout, backup and screenshots, or approve iPhone-only release scope                                                          |
| Store screenshots   | Browser README and native test captures                                         | Capture/review the final release build in Apple's accepted device dimensions; test captures are not production evidence                     |
| Privacy/support     | No public pages/contact                                                         | Confirm contact/host, prepare/publish pages, link policy inside app and in listing                                                          |
| Privacy/compliance  | Proposed local-only disclosure                                                  | Inspect final SDK manifests/network behavior, answer privacy/encryption/age questions accurately                                            |
| Licensing           | Unselected                                                                      | Decide code license/trademark policy; check font/dependency/asset licenses                                                                  |
| Review and launch   | Not submitted                                                                   | Owner approves complete listing/build; App Review; manual release after approval                                                            |

## Device acceptance record

For each run record source SHA, version/build, device/OS, date, tester and evidence. Keep these boxes unchecked until performed on the signed candidate:

- [ ] Fresh install opens without Metro or login, works in airplane mode.
- [ ] Create → complete → close/reopen retains exactly 14 date cells and saved history.
- [ ] Schedule/tolerance changes preserve earlier dates; archived habits and notes restore.
- [ ] Weekly goals preserve saved boundaries, short-week targets, next-week edits and actual winning dates across update/restart; backup v4 restores weekly policies.
- [ ] Individual/all-day feedback, disabled feedback and OS reduced motion behave correctly.
- [ ] System, Light and Dark preferences follow intended native behavior after restart.
- [ ] Device language and saved interface overrides preserve wins/notes after updates; platform dialogs and declared/storefront languages match the release candidate.
- [ ] JSON export/share, picker cancellation, invalid file rejection and repeat restore work.
- [ ] Update over an older build preserves habits/wins/notes/preferences without uninstalling.
- [ ] Export before reinstall; restore after reinstall; explain local storage limitation.
- [ ] VoiceOver and enlarged text work on supported iPhone/iPad; privacy link is reachable.
- [ ] No unapproved network collection; inspect final privacy manifest/export compliance.

Task 017 is complete: English/Brazilian Portuguese interface selection and matching ten-flow iPhone acceptance PASS. Review platform-owned dialog localization and declared/storefront languages against the signed release candidate; no static release-language change was authorized in this slice. Task 018 optional editable suggestions is also complete with ten-flow run 38800367178. Task 023 weekly goals is complete with local/browser acceptance and all eleven matching-source iPhone cases PASS (38835720955). Session timer (024) follows; widgets remain task 014. Store copy must match the tested release candidate. No release date committed.

Task 031: branded native launch and adaptive/themed icon verified on standalone Android 16, offline, light/dark, Portuguese, 150% text, recovery/retry and preserved data. Local verify PASS (156 tests). This closes Android branding/offline smoke only; task 030 upload signing, signed update/Play installation and physical accessibility remain open. No new iOS runtime claim.
