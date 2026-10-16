# Android runtime validation

Status: complete for the authorized emulator scope — [task 028](../.harness/tasks/028-android-runtime-validation.md), October 16, 2026.

The owner authorized emulator validation and confirmed that no physical Android device is available. This report distinguishes native emulator behavior, production JavaScript, development-only failures and remaining signed/device gates.

## Source and environment

- Base source: `464dfdb5d15c7c6887875dfd1bd6214541b9c4ed` plus the local fixes below. Owner edits in `docs/IMPLEMENTATION_PLAN.md` are untouched.
- Matching successful [Android build 38945776265](https://github.com/squiter/tiny-wins/actions/runs/38945776265), artifact `tiny-wins-android-debug`. Native/dependency/configuration inputs remain unchanged; updated JavaScript is served locally.
- APK SHA-256: `fa48baacec9f0932819c5e20024434f5cad5a78f44f7f0bd242c0c9a54d56040`.
- Android 10 / API 29 and Android 16 / API 36, ARM64 Google APIs, isolated temporary Pixel 3a AVDs (`emulator-5580` / `emulator-5582`). Default 1080×2220 at 440 dpi; narrow review 990×2035 = 360 dp width, font scale 1.5. Dates use America/Sao_Paulo.
- Local Node 26.12.0, temporary Java 17.0.20.1 and Maestro 2.11.0. Maestro archive SHA-256 matches the repository-pinned `5384593cb4e7a106489e75a821d157dd43f4e438df6bc308b72e82c685e1283a`. CLI analytics/update checks are disabled and its API destination is loopback.
- Raw logs, temporary SDK/AVDs and synthetic exports: `/private/tmp/tiny-wins-android-028`. Compact evidence is retained in [the harness evidence folder](../.harness/evidence/028-android/). No personal AVD, habit database, account or signing key was used.

## Product fixes

1. `DayInspector` now enables height keyboard avoidance on Android as well as iOS. The Android keyboard previously covered Done typing and the note footer. Native tests use the app's own control, then verify save, restart and clear without changing the win. iOS retains its existing height behavior.
2. The tab layout reserves additional height for enlarged system text and its bottom safe area. At 360 dp / font scale 1.5, labels previously clipped against system navigation. Native review now checks visible tabs, editor actions, detail, notes, Insights and Settings.

No app dependency, permission, schema, release setting or product feature was added. The shared native harness accepts Android tab labels without the iOS tab/position suffix. It scrolls to off-screen habits and restore controls before interacting, while preserving exact destination, record, selected-state and restart assertions. Android-specific Back, backup and enlarged-text flows live in `.maestro/android-acceptance/`.

## Verification results

| Check                                    | Evidence/result                                                                                                                                                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run verify`                         | PASS: 115 unit + 26 integration tests on real SQLite, strict types, lint, formatting and iOS/Android/web JS exports                                                                                                                          |
| `npm run security:policy`                | PASS under the existing temporary exception; raw audit remains 18 high / 0 critical, expiry 2026-10-22T00:00:00Z                                                                                                                             |
| Patched-source regressions               | PASS: 4 focused tests with Vitest; these are also covered by the aggregate integration suite                                                                                                                                                 |
| `npm run security:bundle`                | PASS: 1,695 iOS production JS modules, no braces/node-forge                                                                                                                                                                                  |
| Android production source-map inspection | PASS: 1,777 modules, no braces/node-forge; unsigned export only                                                                                                                                                                              |
| API 29 core                              | PASS: first-win/restart/undo, notes/restart/clear, saved themes, celebrations/settings, Portuguese/English override and management/reorder/archive/restore                                                                                   |
| Weekly goals                             | PASS on API 29 and API 36: goal/win/restart, next-week edit and undo/restart                                                                                                                                                                 |
| API 29 enlarged text                     | PASS: 360 dp, font scale 1.5, Today/detail/editor/day/Insights/Settings; native hierarchy confirms 14 dates per habit and 48×48 dp completion buttons                                                                                        |
| Native System language                   | PASS on API 29 with active `pt-BR,en-US`, 360 dp and font scale 1.5: System Portuguese → saved English/restart → System Portuguese; weekly editor/suggestions/cancel/Insights reviewed                                                       |
| API 36 Back/keyboard                     | PASS: first Back hides the keyboard while preserving the exact draft; second Back cancels; restart creates no habit                                                                                                                          |
| API 36 production-JS notes/export        | PASS: note save/restart/clear; native share sheet exposes the JSON file, cancellation returns the prepared-file message                                                                                                                      |
| Native backup restore                    | PASS: actual exported v4 JSON with 1 habit / 1 win / 1 note; chooser, review cancellation, restore/restart, saved Dark retained, repeat restore adds zero records, invalid file rejected and picker cancellation preserves existing note/win |
| OS appearance                            | PASS on API 36: OS Dark/Light readbacks, resolved palettes, saved overrides and restart                                                                                                                                                      |
| API 36 enlarged text/reduced motion      | PASS: 360 dp / font scale 1.5 including the open-keyboard note footer; celebration/restart/preferences flow passes with all three OS animation scales at 0                                                                                   |
| TalkBack                                 | Limited smoke: service bound, touch exploration enabled, visible focus and modal interaction. Audio was disabled in the emulator; spoken announcements and full user navigation are not certified                                            |

Reports retain original native testcase statuses. A diagnostic suite can contain independently successful weekly/Back cases and a superseded export-selector failure; it is not described as an overall passing suite. Full original diagnostics remain in the temporary evidence directory.

Native captures: [weekly win](screenshots/android-weekly-native.png), [Android 10 enlarged layout](screenshots/android-large-native.png), [Portuguese editor actions](screenshots/android-portuguese-large-native.png), [Android 16 open keyboard](screenshots/android16-large-keyboard-native.png), [native share sheet](screenshots/android16-backup-share-native.png) and [restored note](screenshots/android16-backup-restored-native.png). The evidence folder retains 15 passing native executions plus separate original diagnostics; these are executions, not 15 distinct feature scenarios.

## Diagnosed failures and limitations

- Metro initially listened on IPv6 only. Binding IPv4 fixes native debug startup. Initial connection failures are not accepted app evidence.
- Android labels do not contain the iOS `, tab, N of 3` suffix. Navigation selectors accept both forms; required screen-root assertions remain.
- API 29's image reports `mNightModeLocked=true` and ignores a requested OS Dark. That case failed on the environment limitation; API 36 supplies OS-theme acceptance. Saved app Dark/Light already pass on API 29.
- Changing locale properties alone did not update Android's active configuration. The successful run uses the native Settings language picker and priority reorder, with `am get-config` and `system_locales` readbacks, rather than assuming a property is sufficient.
- API 36 development runs exposed an Expo Router pre-mount state-update warning in `useLinking.native.js` / `url.then` / `onUnhandledLinking`. Its LogBox covered Save note in one run. The unchanged note assertions pass on a fresh development run and with verified production JavaScript. The upstream development warning is still a known issue; no log suppression or dependency patch/update was added.
- Starting Expo with `--no-dev --minify` alone did not override the compiled debug APK's explicit `dev=true` request. The first attempted production-labelled run was actually development JS (`__DEV__=true`), and is classified accordingly. The verified run routes bundle requests through the local proxy below, then reads back the loaded native cache: `__DEV__=false`, `NODE_ENV=production`.
- Android 16 displays “Sharing 1 file”, rather than the supplied chooser title. Export acceptance checks that native header and the actual `.tinywins.json` filename. Restore review controls must be scrolled into view; the original off-screen-tap failure is retained.
- The native share sheet and exported bytes were verified. The synthetic file was transferred into Downloads with adb for chooser acceptance; sending it to Drive/Gmail/another recipient was not performed.

## Repeating production-JavaScript acceptance

Use a dedicated, disposable emulator: the flows clear app data. Install the matching APK and use the pinned Maestro CLI with Java 17. Follow [Expo's production-mode guidance](https://docs.expo.dev/workflow/development-mode/), while accounting for the compiled debug APK's request flags. Start these commands in separate terminals:

```sh
NODE_OPTIONS=--dns-result-order=ipv4first npx expo start --localhost --port 8084 --no-dev --minify
node scripts/android-production-proxy.mjs
```

On the dedicated rooted Google APIs emulator only, set `metro.host` to `localhost` and reverse device port 8081 to host port 8083. The proxy is bound to loopback and forwards only to local Metro 8084; bundle requests explicitly use `dev=false`, `minify=true`, `lazy=false`. This is test tooling, not app code or a release configuration. Inspect `files/BridgelessReactNativeDevBundle.js` with `run-as` after launch and verify the actual prefix before claiming production-JS evidence. The native APK remains a debug build requiring the local server.

Run shared first-win, weekly-goals, day-notes, appearance, celebrations, language-override and habit-management flows. Set/read back OS night mode before each system-appearance flow. The shared large-text flow requires the management fixture; the Android-specific large-text flow uses the restored backup fixture. Set/read back font scale and width, and restore emulator settings afterwards.

For backups, run `backup-export.yaml`, verify only its synthetic cache export, copy it to `Download/tiny-wins-acceptance.json` and put a malformed fixture at `Download/tiny-wins-invalid.json`. Run `backup-restore.yaml`; it invokes the invalid-file checks only after successful restore. All writes and merges occur through the app's public native UI.

## Remaining release gates

- A standalone signed Android candidate, install without Metro, airplane-mode cold start, update over an older installed build and inspection of that exact signed artifact.
- Physical devices/manufacturer variants, full human TalkBack/spoken feedback and real-world file-sharing targets. Two emulator API levels do not certify every supported Android version.
- Native iOS regression of the enlarged-tab-height adjustment before an iOS release. This task supplies Android runtime evidence; previous iPhone captures predate this local fix.
- Existing dependency-audit exception expiry/upstream remediation, branding, store identity/listing and any Android distribution/pricing decisions. No store publication or signing change was authorized here.

Next Android step: an independently scoped standalone candidate and device/distribution acceptance. Timer 024 remains the next approved product feature after this validation slice.

## Follow-up visual correction

The owner spotted an oversized Today cell after this runtime pass. [Task 029 design review](ANDROID_DESIGN_REVIEW.md) records the subsequent geometry audit and corrections across Today, Insights and detail calendars. The task 028 screenshots and frozen hashes above remain historical evidence for that earlier state.
