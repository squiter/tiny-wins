# Task: 002 — Openable and verified browser preview

Status: verified (browser scope only)

Goal: let the user see and exercise the real app on this machine without native simulators.
Non-goals: web product launch, mock app, backend, replacing native acceptance.
Files/modules allowed: Expo web config/dependency, Metro WASM config, preview server, root error UI, docs/screenshots.
Dependencies: SDK-compatible react-native-web; existing Expo SQLite web worker.
Acceptance criteria: open local preview; create and choose color; check/undo; 14 days; persistence on reload and close/reopen; readable 390px/360px list/form; remain open for user review.
Required tests: real visible browser journey and existing aggregate validation.
Commands executed / results: npm run build:web passed; loopback preview server running on localhost:8090; npm run verify (Node 24) passed with 21 tests and iOS/Android/web exports. Browser journey passed, including blank-name rejection, color selection, check/reload, undo/reload and close/reopen. Screenshot: docs/screenshots/today-360.png.
Open questions: native device gates and dependency security findings remain in task 001. Browser SQLite alpha supports one open tab holding the file; friendly retry screen provides recovery.
Handoff summary: visible preview remains open with one completed example habit; npm run preview reproduces it. Use a single tab and the same browser/origin for persistent preview data.
