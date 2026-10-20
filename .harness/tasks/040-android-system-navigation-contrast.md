# Task: 040 — Match Android system navigation to the app theme

Status: proposed — explicit dependency authorization requested, not received
Goal: Correct white Android system navigation buttons on light app surfaces without changing visibility or app permissions.
Non-goals: Hiding system navigation, adding telemetry, purchase flows, changing signing/access policies or installing a dependency before authorization.
Files/modules allowed after authorization: package.json/lockfile, app.json plugin configuration, themed root/startup/error presentation and focused native acceptance/evidence.
Dependencies: AGENTS.md line 17 requires explicit dependency authorization. Owner was asked whether to add official `expo-navigation-bar` in the installed Expo SDK 57 compatible range `~57.0.3`. No dependency, configuration or implementation change has been made for this proposal.
Acceptance criteria:

- Follow the SDK 57 API, not latest SDK 58; use the official module's themed navigation-bar component and compatible config plugin as appropriate.
- System Back/Home/Recents remain visible and legible against light and dark surfaces, including manual appearance overrides, loading and error surfaces.
- Retain task 039's tab safe-area and 48-point control acceptance at normal/enlarged text; unsupported platforms keep their current behavior.
- Rebuild native binaries after adding the module/plugin, run aggregate verify and security policy/bundle gates, and review actual emulator light/dark screenshots and native navigation.
- Generate a new signed candidate only after acceptance; do not silently expand dependency or release scope.

Required tests: npm run verify, security policy/bundle inspection, native contrast and tab geometry/navigation acceptance, fresh candidate provenance. No device/Play-delivered claim without corresponding evidence.
Commands executed / results:

- Original and corrected API 29 three-button previews show white OS navigation buttons on the ivory surface. Task 039 fixes the app tab overlap; this is a separate system-bar contrast issue.
- Confirmed installed SDK's bundledNativeModules mapping is `~57.0.3` and consulted the [versioned Expo documentation](https://docs.expo.dev/versions/v57.0.0/sdk/navigation-bar/). Prepared the proposed scope; nothing installed or imported.

Open questions: Explicit owner dependency decision pending. This proposal does not authorize accepting Play legal declarations.
Handoff summary: If authorized, integrate the official themed component, validate both themes and rebuild. If deferred, record the Android 10 system-button contrast limitation explicitly for the internal beta.
