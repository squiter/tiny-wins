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
- Use an explicit numeric height at every font scale; native and signed replacement checks pending.

Open questions: Owner's first-Play-app legal confirmation remains pending under task 038. Physical/Play-delivered installation and update acceptance remain separate.
Handoff summary: Do not upload candidate/tiny-wins-0.1.0-1.aab; replace it with the validated corrected candidate.
