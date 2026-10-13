# ADR-001: iOS first, Android ready

Status: accepted. Date: 2026-10-13.

Use stable Expo 57, React Native, strict TypeScript and Expo Router. Match native dependency versions using expo install and commit the lockfile. React state is sufficient for this slice. Domain rules use pure TypeScript; persistence sits behind a repository interface and Expo SQLite/Drizzle adapter. Reanimated handles subtle layout transitions with system reduced-motion handling.

This supplies shared iOS/Android behavior while keeping calendar rules testable without simulators. No platform-specific feature is needed. A native build and smoke test on each platform are required before calling the cross-platform spike complete; bundle exports alone do not satisfy that gate.

Sources: https://expo.dev/sdk and https://docs.expo.dev/versions/latest/ (checked at bootstrap). SDK 58 beta is excluded. Installed compatibility must also pass expo install --check.
