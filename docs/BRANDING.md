# Tiny Wins icon and launch

Task 031 follows the existing design plan: four rounded squares, sage/forest/apricot, on warm ivory. The rabbit remains a decorative all-done illustration, not the launcher identity.

## Assets

Editable SVG masters and generated PNGs live in `assets/branding/`:

- `icon`: opaque 1024×1024 RGB image for iOS and legacy Android icons.
- `adaptive-foreground`: transparent 1024×1024 layer with its entire mark inside Android's central safe circle; the OS supplies the final mask.
- `adaptive-monochrome`: matching transparent silhouette for Android themed icons.
- `mark-light` / `mark-dark`: transparent full-size marks for native splash and shared loading UI.

Regenerate with `node scripts/generate-branding.mjs` and the development tool `rsvg-convert` (librsvg). This renders code-native SVG geometry; no icon/image runtime library or downloaded artwork is added. Committed PNGs mean normal installs/builds do not need librsvg.

## Opening behavior

`expo-splash-screen` 57.0.10 is pinned by the SDK-compatible dependency map and lockfile. Its config plugin sets the native launch surface to ivory `#FBF8F1` or dark `#141B17`, with a 96-point mark matching the React loading screen. App and adaptive icons are configured in `app.json`; native changes require a new binary.

The root holds native launch while bundled fonts initialize. Once fonts and a real React surface are ready, native launch fades for 180 ms, or exits immediately with OS reduced motion. A branded, localized loading overlay covers the existing SQLite provider until the route surface lays out. There is no fabricated percentage or minimum loading timer, and warm resume does not replay a fake introduction. Routes behind loading are hidden from screen readers until ready.

The earliest screen uses OS appearance/language because saved preferences live in SQLite; the normal interface applies saved choices when initialization completes. Font/database errors reach the existing recovery screen, whose layout also dismisses native launch. Initialization queries, schemas, dates and repository interfaces are unchanged. Each provider lifetime uses its own SQLite connection so asynchronous teardown after a startup failure cannot close the connection opened by Retry.

## Verification

The asset checks enforce a 1024px RGB icon without alpha, transparent marks, correct light/dark backgrounds and adaptive foreground/monochrome safe-zone geometry. Startup lifecycle checks cover holding launch, motion settings and failed native/motion detection without trapping recovery. Native prebuilds generate Android resources and the iOS icon/storyboard in the ignored platform directories.

Runtime acceptance, build fingerprints, screenshots and remaining platform limits are recorded in task 031 and `.harness/evidence/031-launch/`. Local standalone test APK signing uses the template development key; it is not the Play upload key or a store candidate. This work does not register accounts, change app identifiers, signing, price or publication settings.

References: [Expo splash screen](https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/), [native icon and splash configuration](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/).

## Native acceptance — 2026-10-16

Fresh standalone Android 16/API 36 ARM64 release-variant APK, bundled-source fingerprint verified, installed over the previous build without losing the synthetic habit/win/note. All four serialized Maestro flows pass: preserved-data cold restart, visible startup failure, successful retry after version restoration and fresh first win/restart/undo. Native retry testing found a cached-connection teardown race; dedicated SQLite provider connections resolve it without schema changes.

Reviewed offline cold launch in light English and dark Portuguese (per-app locale), 360 dp, font scale 1.5 and disabled OS animations. Activity startup reports 1,273ms light / 721ms dark; these are Android activity metrics rather than complete initialization timings. Warm resume brings the existing task forward (33ms), without replaying loading. Restored normal emulator settings and original synthetic fixture afterward. No physical-device/TalkBack claim. iOS generated icon/storyboard resources inspected; new iOS compile/runtime remains pending.

- [Actual launcher tap → splash → Today video](screenshots/android-launcher-opening.mp4).
- [Light cold launch](screenshots/android-launch-light.mp4) / [dark, enlarged Portuguese launch](screenshots/android-launch-dark.mp4).
- [Installed Android launcher icon](screenshots/android-launcher-icon.png), [native light splash](screenshots/android-splash-light.png), [dark enlarged loading](screenshots/android-loading-dark-large.png).
- [Frozen reports and fingerprints](../.harness/evidence/031-launch/acceptance-summary.json).

`npm run verify` PASS: 118 unit + 38 integration tests, strict types/lint/format and all exports. The production APK has 1,783 Android JS modules with no affected tooling modules, and adds no permissions. Existing audit policy passes with the previously accepted raw 18 high / 0 critical findings; no clean-audit claim. The APK uses the template development signature and is not a signed Play upload candidate.
