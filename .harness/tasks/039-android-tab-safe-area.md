# Task: 039 — Keep tab controls above Android system navigation

Status: in progress
Goal: Correct the normal-font tab bar found during task 038's signed-candidate revalidation, then generate and accept a replacement internal-test candidate.
Non-goals: New dependencies, permissions, architecture, public production release, pricing, accepting legal terms or unrelated owner/workflow changes.
Files/modules allowed: Shared tab layout, focused native regression, task/evidence and current release documentation.
Dependencies: Owner requested Android design review, revalidation and internal-test release. Original candidate 0.1.0 (1) is superseded by this defect; retain its evidence as baseline. Play publishing stays disabled until first-app/legal setup is complete.
Acceptance criteria:

- Always give the tab bar a numeric height that includes its 68-point controls region and bottom safe inset, retaining enlarged-text growth.
- On the dedicated API 29 three-button emulator, tab controls remain at least 48 points high and labels sit above system navigation; inspect actual native bounds and screenshots at normal and enlarged text.
- Today/Insights/Settings navigation, appearance, language and persistence retain required assertions in native acceptance.
- Fresh `npm run verify` and applicable security gates pass without weakening policy; generate a newly signed AAB through the existing protected workflow and verify public certificate, metadata, runtime and emulator behavior.
- Preserve unrelated dirty changes and never upload the obsolete candidate or publish production.

Required tests: Aggregate verify/security; native tab regression and actual bounds/screenshots; fresh signed artifact provenance and emulator acceptance. No implementation-mirroring unit test for this layout-only fix.
Commands executed / results:

- Original AAB-derived API 29 screenshot exposed app tab labels in the system navigation area. Stable application bottom is y2088 on a 1080×2220 / 440dpi emulator; original Settings accessible bounds y2034–2088 provide only 54px (about 20dp).
- Root cause: the normal-font style explicitly sets `height: undefined`, overriding the navigator's computed height while retaining bottom inset padding. Its 68-point minimum includes that padding, leaving too little room for controls.
- Use an explicit numeric height at every font scale. Fresh `npm run verify` PASS: 118 unit + 57 integration tests, types/lint/format and all exports. Native release-style JS/Hermes rebuild and source-map inspection PASS: 1783 modules, no affected tooling modules.
- Published only the focused layout fix, regression flow and this task as 2563e3d; preserved all other dirty files. Tag android-v0.1.0-beta.1 starts protected Android release run 39490972112 with PLAY_INTERNAL_ENABLED=false (fresh readback).
- Hosted verify PASS. Build attempt 1 failed resolving Maven Kotlin/java-diff-utils POMs; direct official Maven requests returned HTTP 200 and the parallel development build continued. Retained failure; retried only the failed build on a fresh runner without changing dependencies or gates. Attempt 2 native build and signature/certificate PASS, but final runtime gate failed because rg is absent; task 041 fixes that helper. New signed-candidate acceptance uses beta.2 run 39495461832.
- Original candidate's eight Maestro flows passed, but its screenshot/bounds review failed; functional passes do not override visual acceptance. Prepared a synthetic win/note/dark-theme fixture for an in-place emulator update to the replacement APK.

- Development APK from hosted run 39490947058 PASS. Isolated second API 29 emulator + local IPv4 Metro preview: tab-bar flow PASS at font scales 1.0/1.5; actual controls are 67.64dp/79.64dp high and end at stable y2088 above system navigation. These preview results do not replace signed-candidate acceptance. Original emulator fixture is preserved for an in-place upgrade.

Open questions: Owner's first-Play-app legal confirmation remains pending under task 038. System navigation button contrast on Android 10 is a separate proposed dependency-authorized task 040. Physical/Play-delivered installation and update acceptance remain separate.
Handoff summary: Do not upload candidate/tiny-wins-0.1.0-1.aab; replace it with the validated corrected candidate.
