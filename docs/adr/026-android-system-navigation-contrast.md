# ADR-026: Theme-aware Android system navigation

Status: accepted — owner explicitly authorized the compatible official module and light/dark correction on 2026-10-20, task 040.

Use Expo SDK 57's `expo-navigation-bar` component alongside the status bar on the loading, error and themed application surfaces. Select light icons on dark surfaces and dark icons on light surfaces from the same resolved app theme, including saved overrides. The official component renders nothing on iOS/web; no platform permissions, telemetry or purchase behavior are added.

Configure visible navigation and explicit themed icon contrast with the compatible config plugin. Its `enforceContrast: false` setting controls the Android visual scrim, not a security protection; the application supplies the matching icon style. Do not hide navigation or reduce the app tab safe area.

A small Expo config plugin initializes `windowLightNavigationBar` from AppCompat's `isLightTheme` before JavaScript is ready, so the native launch follows OS appearance. It also supplies a black system-navigation background below Android 8, where dark system buttons are unavailable; Android 8+ keeps the transparent background and themed icons. Generated resources are isolated and idempotent. The native loading surface follows OS appearance; saved app appearance takes over when preferences load, as in ADR-025.

Rebuild a native binary after this dependency/plugin change. Check both app themes, saved appearance after restart, normal/enlarged tab geometry and real system buttons on the isolated Android emulator; a Metro export alone cannot prove native behavior. Record the older-platform fallback as static resource evidence unless that OS is actually exercised.

Source: [versioned Expo SDK 57 navigation-bar documentation](https://docs.expo.dev/versions/v57.0.0/sdk/navigation-bar/).
