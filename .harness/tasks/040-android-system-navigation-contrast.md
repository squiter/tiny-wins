# Task: 040 — Match Android system navigation to the app theme

Status: in progress — explicit owner authorization received on 2026-10-20
Goal: Correct white Android system navigation buttons on light app surfaces without changing visibility or app permissions.
Non-goals: Hiding system navigation, adding telemetry, purchase flows, changing signing/access policies or installing a dependency before authorization.
Files/modules allowed after authorization: package.json/lockfile, app.json plugin configuration, themed root/startup/error presentation, .maestro/android-acceptance/system-navigation.yaml, scripts/with-android-navigation-theme.cjs, ADR-026 and focused native acceptance/evidence.
Dependencies: AGENTS.md line 17 requires explicit dependency authorization. Owner explicitly authorized adding official `expo-navigation-bar` and fixing both themes before internal testing. Use installed Expo SDK 57 compatible range `~57.0.3`; no app permissions or unrelated dependency upgrades.
Acceptance criteria:

- Follow the SDK 57 API, not latest SDK 58; use the official module's themed navigation-bar component and compatible config plugin as appropriate.
- System Back/Home/Recents remain visible and legible against light and dark surfaces, including manual appearance overrides, loading and error surfaces.
- Retain task 039's tab safe-area and 48-point control acceptance at normal/enlarged text; unsupported platforms keep their current behavior.
- Rebuild native binaries after adding the module/plugin, run aggregate verify and security policy/bundle gates, and review actual emulator light/dark screenshots and native navigation.
- Build a fresh candidate for native acceptance; submit it only after acceptance; do not silently expand dependency or release scope.

Required tests: npm run verify, security policy/bundle inspection, native contrast and tab geometry/navigation acceptance, fresh candidate provenance. No device/Play-delivered claim without corresponding evidence.
Commands executed / results:

- Original and corrected API 29 three-button previews show white OS navigation buttons on the ivory surface. Task 039 fixes the app tab overlap; this is a separate system-bar contrast issue.
- Confirmed installed SDK's bundledNativeModules mapping is `~57.0.3` and consulted the [versioned Expo documentation](https://docs.expo.dev/versions/v57.0.0/sdk/navigation-bar/). Installed the explicitly authorized module at 57.0.3. Aggregate verification passes: 118 unit + 57 SQLite integration tests, type/lint/format and all-platform exports. Native resource inspection caught the official plugin removing the launch attribute; plugin order was corrected before building.

- Final generated AppTheme retains `?attr/isLightTheme`, transparent API 26+ color, black API 24/25 fallback and visible controls. Aggregate verify PASS; online security policy PASS under the unchanged tooling exception (18 high / 0 critical, expires 2026-10-22). Production iOS module scan PASS (1703 modules, no braces/node-forge). Restricted-network audit failed closed and was rerun with registry access.

Open questions: Native rebuild/emulator acceptance and final archive inspection pending. Dependency authorization received. Owner also explicitly authorized the Play declarations, but browser automatic approval rejected the first policy-checkbox click; requested personal completion of the three declarations/Create app while native work proceeds.
Handoff summary: Integrate the SDK-57 themed component, validate both themes, rebuild and release only the corrected internal-test candidate.

- Native beta.3 development flow PASS in 55s: manual dark/light, Today/Settings and saved appearance across restart. Actual screenshots show correct app-level contrast. A separate capture during native splash still showed white system icons on ivory; expanded the same resource correction to the distinct splash theme and both system bars before final submission. Beta.3 is intermediate; use a fresh immutable beta.4 after required gates.
