# Task: 010 — iOS simulator runtime acceptance

Status: in progress
Goal: move from verified native compilation to actual create/check/restart/undo and habit management acceptance in an isolated hosted iPhone simulator.
Non-goals: signing/store release, physical-device acceptance, Android runtime claims, audit suppression, installing Xcode on the owner's Mac.
Files/modules allowed: native smoke workflow, Maestro flows, harness/docs; fix app code only if a reproduced runtime defect requires it.
Dependencies: official Maestro CLI 2.11.0, pinned release ZIP SHA-256; Java 17; existing successful ARM64 iOS artifact.
Acceptance criteria: verify artifact source matches all app/dependency inputs; bootstrap local Metro for debug app; run first-win and management flows on actual simulator; retain reports/screenshots/Metro diagnostics on failure; distinguish compile vs runtime vs security gates.
Required tests: existing aggregate verification; hosted simulator execution is the runtime acceptance evidence. No local simctl/Xcode runtime is available.
Commands executed / results: iOS and Android native compilation succeeded on 886e0a7; verify job passed, audit still failed as documented. First smoke run 38507039343 reached simulator install but failed before test execution at Metro readiness. Local reproduction: 127.0.0.1:8081 refused while localhost:8081/status returned packager-status:running (IPv6 localhost binding). Force IPv4 DNS order for Metro, probe localhost with bounded retry, open Simulator explicitly and bound boot time. Rerun pending.
Open questions: native runtime may expose selector, launch or layout defects; diagnose from actual reports instead of weakening assertions.
Handoff summary: pending hosted execution and repair of any demonstrated failures.

Further diagnosis: run 38508006796 was cancelled by a skipped build-completion event; move concurrency into the eligible job and queue valid runs without cancellation. Run 38508552708 timed out while starting the simulator; captured inventory shows two devices/runtimes Booted because generic Simulator launch opened its default device in addition to the selected one. Boot the selected latest available iOS device first and launch Simulator with its explicit UDID. Cold debug UI readiness is bounded by observing add-habit before interaction. No persistence assertions were removed.

Runtime diagnosis: run 38510260021 booted a single iPhone 17 Pro / iOS 26.5 and executed both flows. Cold Metro bundling took 155842 ms, exceeding the first startup wait; prebundle before launching tests. Management screenshot shows a saved win, completed banner and 1-day streak, but the iOS accessibility tree groups the streak under a button whose explicit label omitted it. Include the current streak/schedule in the habit button label and assert the complete accessible label before/after restart, retaining streak checks. New matching native build and runtime rerun pending.

Run 38513101044: management flow PASSED (rename, reorder, archive/restore and retained streak across restarts). First-win failed at opening the editor: screenshot remained on empty Today after an early cold-launch tap. Device log reveals the actual virtual Metro entry URL; prewarm that exact request instead of the different plain Router entry. Enable Maestro retryTapIfNoChange only on the initial New habit tap, as its official wait guidance recommends for early taps; retain every persistence/streak assertion. Rerun pending. Local npm run verify passed 71 tests; matching 7f390cc iOS/Android compilations and hosted verify passed.

Run 38514417660: exact native bundle prewarming succeeded (23884 ms), but no app flows executed because XCTest driver startup timed out. Driver log reached its HTTP-server startup at 05:09:15, three seconds after the 05:09:12 timeout. Use a bounded 240000-ms driver startup allowance per official Maestro guidance; assertions and job timeout remain unchanged.
