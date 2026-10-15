# Task: 018 — Editable starter habit ideas

Status: complete
Goal: Offer a small optional selection of localized habit ideas while creating a new habit.
Non-goals: Onboarding, automatic sample records, quantity goals, suggested history/wins, recommendation services or changing existing habits.
Files/modules allowed: Small typed idea catalog, localized names/copy, new-habit editor draft selection, tests/native flow and documentation.
Dependencies: Task 017 language layer; existing habit/icon/color/creation APIs only. No new package or permission.
Acceptance criteria:

- Offer a restrained set of binary ideas such as reading a page, drinking water and walking, with existing icons/colors and English/Portuguese names.
- Selection fills only the editable draft name/icon/color; it never creates a habit or completion. Keep any explicitly configured schedule/tolerance.
- Suggestions appear only during new-habit creation, remain optional and require no onboarding. Users can enter their own idea directly.
- Name/icon/color remain editable after selection; creation uses the existing validated use case and injected clock/ID provider only on explicit Save.
- Cancel leaves storage unchanged. A saved title becomes user data and is never rewritten when interface language changes.
- Keep accessible choice labels/state cues, 48-point controls, reduced-motion support and usable 360/390/enlarged-text layouts.
- Update harness/ADR or design notes with actual selection/edit/save/cancel/restart evidence.

Required tests: Catalog uses valid existing icons/colors; draft selection has no persistence side effect; native choose idea → customize → save → restart, plus cancel/no-record acceptance; npm run verify and layout review.
Commands executed / results: npm run verify PASS: 99 unit + 24 integration tests including real SQLite (123 total), strict types/lint/format and iOS/Android/web exports. Final source is 763ad37. Hosted Validate 38798469531 PASS (verify + dependency-audit); native iOS 38798469626 and ARM64 Android 38798469627 builds PASS. Production inspection covers 1,693 iOS JS modules without braces/node-forge; raw 18 high / 0 critical remains visible under unchanged ADR-020 policy. No new dependency, schema, permission or release setting.

Browser acceptance: isolated 8091 synthetic fixtures; three Portuguese ideas; repeated selection preserves five weekdays and tolerance 2; cancel/reload leaves no record and a blank fresh draft; name/icon/color remain editable; explicit Save creates zero wins; literal customized title and appearance survive reload, English switch and edit/reopen. Existing habit edits hide ideas. Web expansion reports false/true explicitly. Reviewed Portuguese 360/390 and English 390 captures. Exactly 13 historical date buttons plus today's cell remain. QA tab/server closed and viewport reset; owner 8090 preview retained with HTTP 200.

Native acceptance: [38800367178](https://github.com/squiter/tiny-wins/actions/runs/38800367178) PASS on 763ad37, dedicated iPhone 17 Pro / iOS 26.5, 42m45s. All six retrieved JUnit files total ten SUCCESS cases, zero failure/error/skipped cases. Existing ten flows retained: notes, appearance, celebrations, language override, first win, management, OS dark/light, enlarged text and OS Portuguese. Expanded flows verify English water→reading replacement/save/check-in/restart/undo; Portuguese selection/cancel/restart/no record, reading→custom name/icon/color/save/check-in/note/restart/English return; existing editor has no ideas; OS Portuguese enlarged walking selection/cancel/empty Insights. AppleLanguages readback ["pt-BR","en"]; both font-size readbacks accessibility-large. Reviewed native English/Portuguese selection, customized study/violet win, enlarged wrapped walking option and visible Create/Cancel actions. Retained screenshots/starter-ideas-native-pt.png, starter-ideas-native-pt-large.png and starter-ideas-native-customized.png. No assertion deadline or security check weakened. Job capacity is 50 minutes because the previous ten-flow baseline already took 41m27s and this slice adds interactions.

Open questions: Android runtime/system-language changes, physical screen readers and signed-candidate/file-dialog acceptance remain release gates. Local Maestro is not installed and Xcode selects CommandLineTools; native evidence is hosted simulator evidence, not physical-device proof.
Handoff summary: All scoped acceptance gates pass. Ideas fill presentation fields only; explicit Save uses the existing injected clock/ID use case. Ordinary name typing stays uncontrolled; only deliberate idea selection remounts the prefilled input. Saved names never follow later interface-language changes. Owner implementation-plan edits remain untouched. Next: task 023 ADR and flexible weekly goals, ahead of timer 024.
