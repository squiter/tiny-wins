# Task: 010 — iOS simulator runtime acceptance

Status: in progress
Goal: move from verified native compilation to actual create/check/restart/undo and habit management acceptance in an isolated hosted iPhone simulator.
Non-goals: signing/store release, physical-device acceptance, Android runtime claims, audit suppression, installing Xcode on the owner's Mac.
Files/modules allowed: native smoke workflow, Maestro flows, harness/docs; fix app code only if a reproduced runtime defect requires it.
Dependencies: official Maestro CLI 2.11.0, pinned release ZIP SHA-256; Java 17; existing successful ARM64 iOS artifact.
Acceptance criteria: verify artifact source matches all app/dependency inputs; bootstrap local Metro for debug app; run first-win and management flows on actual simulator; retain reports/screenshots/Metro diagnostics on failure; distinguish compile vs runtime vs security gates.
Required tests: existing aggregate verification; hosted simulator execution is the runtime acceptance evidence. No local simctl/Xcode runtime is available.
Commands executed / results: iOS and Android native compilation succeeded on 886e0a7; verify job passed, audit still failed as documented. Smoke execution pending.
Open questions: native runtime may expose selector, launch or layout defects; diagnose from actual reports instead of weakening assertions.
Handoff summary: pending hosted execution and repair of any demonstrated failures.
