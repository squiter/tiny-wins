# ADR-006: Local browser preview of the mobile slice

Status: accepted for development preview. Date: 2026-10-13.

The user needs to see and exercise the app while native simulators are unavailable. Add Expo-compatible React Native Web and serve a production web export locally. The same Router screens, domain, Drizzle repository and Expo SQLite provider are used; no mock app, backend or alternative persistence is introduced.

Expo SQLite's existing web adapter is documented as alpha. This is a necessary, isolated development preview, not a decision to ship a web product or replace native acceptance. Browser data is scoped to browser/origin and stored by the SQLite worker; it is independent of native device databases. Reload/reopen and undo were exercised through the visible UI.

Metro includes WASM assets. scripts/preview.mjs serves only the exported directory on loopback port 8090 and supplies COOP/COEP headers on HTML, scripts and workers, as required for SharedArrayBuffer. The preview has no fast refresh: rerun npm run preview after code changes. Use the same hostname/port to retain browser data. Native npm start remains the development entry point for iOS/Android.

Source: https://docs.expo.dev/versions/latest/sdk/sqlite/#web-setup (checked 2026-10-13).

Only one browser tab can hold the SQLite file at a time. A second tab encounters the worker's exclusive file lock; the root error screen directs the user to close other Tiny Wins tabs and retry. This limitation is specific to the preview adapter. Closing the first tab and opening/reloading another preserves the record.
