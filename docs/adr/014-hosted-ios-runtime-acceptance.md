# ADR-014: Hosted iOS simulator runtime acceptance

Status: accepted; execution results tracked in task 010

Native iOS/Android compilation is verified on 886e0a7, but compilation does not prove startup, persistence or interactions. The owner's Mac has command-line tools without simctl; do not install full Xcode or use the owner's personal device implicitly. A hosted macOS 26 ARM64 runner supplies an isolated iPhone simulator.

Reuse the successful unsigned iOS debug artifact, checking its run status/main branch/workflow and comparing every app/dependency/bundler input against the tested checkout. If inputs differ, fail instead of testing a stale app. Start loopback Metro for the debug bundle and run the existing restart/check/undo and management Maestro flows. Pin the official CLI release and SHA-256; use Java 17 and disable CLI analytics/update checks. The pinned CLI still invokes an error reporter independently of its analytics opt-out, so its API destination is forced to loopback (MAESTRO_API_URL) for purely local test runs. No app telemetry, account, signing secret, Maestro Cloud or store upload.

Manual dispatch can test an existing successful main artifact. Successful main push builds trigger the same smoke workflow automatically; fork/PR build completions do not trigger this privileged follow-up. Permissions are contents/actions read, checkout credentials are not persisted, and the token is scoped to the artifact-selection step.

Save JUnit, debug output, simulator screenshot and Metro logs even when a flow fails. Never describe infrastructure/selector/launch failures as app acceptance or skip an assertion to make the job green. Simulator evidence complements, rather than replaces, physical-device accessibility, backup file dialogs and Android emulator acceptance.

Sources: official Maestro CLI installation/commands docs and mobile-dev-inc/Maestro cli-2.11.0 release. Runtime acceptance status belongs in task 010; the version-based npm audit remains a separate open gate.

Reference links: [CLI 2.11.0 release](https://github.com/mobile-dev-inc/Maestro/releases/tag/cli-2.11.0), [CLI commands](https://docs.maestro.dev/maestro-cli/maestro-cli-commands-and-options), [CLI environment variables](https://docs.maestro.dev/maestro-cli/environment-variables), [pinned error-report API setting](https://github.com/mobile-dev-inc/Maestro/blob/cli-2.11.0/maestro-cli/src/main/java/maestro/cli/util/EnvUtils.kt). The startup wait observes the New habit control instead of assuming a cold debug bundle is ready immediately.

Cold-start diagnosis uses the actual bundle URL recorded by the native app. The initial New habit tap uses [Maestro’s early-tap handling](https://docs.maestro.dev/reference/commands-available/tapon) when the hierarchy has not changed; no whole-flow retries or assertion bypasses.

Hosted XCTest driver startup is bounded at 240000 ms via MAESTRO_DRIVER_STARTUP_TIMEOUT. An observed runner started its server three seconds after the default deadline; this affects infrastructure readiness, not app assertions. See [official startup timeout guidance](https://docs.maestro.dev/maestro-cli/run-your-first-test-with-the-maestro-cli).
