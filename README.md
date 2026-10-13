# Tiny Wins

Small steps. Big changes. A local-first habit tracker, built iOS-first with shared Android-ready React Native code.

## See the app now

Run `npm run preview` and open http://localhost:8090 in a browser. It builds and serves the actual app with local SQLite persistence. Create a habit, complete today, reload and undo. The preview is a production export; restart the command to rebuild after code changes. Keep only one Tiny Wins preview tab open at a time. Browser data belongs to that browser and origin and is separate from iPhone/Android data.

The existing Expo SQLite web adapter is alpha; this preview supports development and review while native device acceptance remains required. See ADR-006 for the boundary.

## Start

Use Node 24 LTS and npm (see .nvmrc). From a clean checkout:

```sh
npm ci
npm start
```

Scan the Expo development server QR code with a compatible Expo Go installation, or use `npm run ios` / `npm run android` with installed simulators. SQLite runs on the device. No server, account, or environment secrets are required. The bundle identifier is provisional until store registration.

Create daily habits with a name, icon and color; tap a habit name to edit it. Reorder with labeled up/down controls, or archive and restore without losing past wins. Today displays 14 calendar days and the current streak, with completion/undo in one tap. SQLite stores habits and completion timezone context. Fonts ship with the bundle and do not require a runtime download.

## Commands

| Command                    | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `npm ci`                   | Reproduce locked dependencies                                |
| `npm start`                | Start Expo development server                                |
| `npm run typecheck`        | Strict TypeScript                                            |
| `npm run lint`             | Expo ESLint                                                  |
| `npm run format`           | Apply formatting                                             |
| `npm run format:check`     | Check formatting                                             |
| `npm run test:unit`        | Deterministic calendar/domain tests                          |
| `npm run test:integration` | Real SQLite + Drizzle migrations, close/reopen, writes       |
| `npm run build`            | Export production JS/assets for iOS, Android and the preview |
| `npm run verify`           | Types, lint, format, unit, integration, all platform exports |
| `npm run test:e2e`         | Maestro flow on installed native app                         |
| `npm run security`         | Audit dependencies; high/critical vulnerabilities fail       |

`build` produces JavaScript bundles, not signed installable binaries. To run Maestro, install Xcode/Android SDK and Maestro, build/install using `npx expo run:ios` or `npx expo run:android`, then run the E2E command. The flow clears the test application's data; use a dedicated test device. Expo Go does not have our app ID.

## Reading path

- [Primary implementation plan](docs/IMPLEMENTATION_PLAN.md); the supplied original remains unchanged under its original filename.
- [Architecture](docs/ARCHITECTURE.md), [design/UX guide](docs/DESIGN_SYSTEM.md) and [ADRs](docs/adr).
- [Contributing](CONTRIBUTING.md), [agent contract](AGENTS.md), [.harness/checks.md](.harness/checks.md).
- [Bootstrap evidence and limitations](docs/BOOTSTRAP_REPORT.md), [habit management validation](docs/HABIT_MANAGEMENT_REPORT.md).

License, store price, final identifiers and trademark rights remain owner decisions. No license has been selected; public source availability alone does not grant an open-source license. Official distribution is planned as a paid App Store download with no in-app payments.

The locked Expo SQLite web worker has a response-length bug repaired by the guarded postinstall script. npm ci applies the repair automatically and integration tests cover large/multibyte responses. Consult ADR-008 before changing expo-sqlite.
