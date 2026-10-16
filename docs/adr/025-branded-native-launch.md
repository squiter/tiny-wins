# ADR-025: Branded native launch and icon

Status: accepted — owner requested implementation on 2026-10-16, task 031.

Use the four rounded squares already specified in the design plan as the native launcher identity. Keep vector masters and derive opaque store/legacy PNG, adaptive foreground/monochrome and light/dark splash marks. Do not introduce a second mascot or icon library.

Use Expo SDK 57's compatible expo-splash-screen package/config plugin for Android/iOS launch configuration and lifecycle. The owner's splash/icon request authorizes this narrow dependency/config addition; identifiers, signing, pricing, permissions and distribution do not change. Native branding requires a fresh binary; validate a locally built standalone Android test APK, not only Metro or Expo Go. Local test signing is not Play/App Store release signing.

Hold native splash through font initialization, then show the same branded loading surface while SQLite initializes. A root loading overlay remains visible while the existing SQLite provider initializes, until the real route surface lays out. Initialization queries, migrations and repository interfaces remain unchanged. Native fault-injection testing exposed a retry race: asynchronous teardown of a failed provider could close the cached connection reused by its replacement, causing NativeDatabase.prepareSync to reject. Open a dedicated connection per provider lifetime (stable useNewConnection options) so retries cannot reuse that closing handle. Hide native splash only after an actual React surface has laid out. Error recovery also dismisses native splash, so a failure cannot trap users behind branding. No fake percentage or minimum timer. The shared loading UI has a static identity and localized status; decorative motion is optional and respects OS reduced motion. Saved appearance/language apply once preferences are available; the earliest native screen follows OS appearance.

Source references: https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/ and https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/. Native startup must be checked on a standalone build because development loading surfaces differ.
