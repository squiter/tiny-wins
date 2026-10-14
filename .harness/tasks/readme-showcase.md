# Task: README product showcase

Status: complete
Goal: Make the repository README welcoming and useful, with real screenshots, shipped capabilities and an honest roadmap.
Non-goals: App implementation, generated mockups, CI changes or changing the owner's implementation plan.
Files/modules allowed: README.md, docs/screenshots and this task only.
Dependencies: None.
Acceptance criteria:

- Introduce Tiny Wins and its binary tile / consistency-over-perfection promise.
- Embed existing example-data screenshots with descriptive alternative text and GitHub-compatible relative paths.
- Separate implemented capabilities from planned features; retain release, security and native-validation limitations without claiming full acceptance.
- Keep reproducible setup, commands and links to architecture, design, harness and delivery evidence.
- Preserve the main thread's work and the owner's existing planning edits.
- Refresh all three README screenshots against the current 7e38767 interface, with synthetic data only. Show the typographic footer, current dark Insights and current day-note controls; preserve the existing product showcase text and descriptive alt text.

Required tests: Markdown formatting; local screenshot/document references resolve; review feature claims against current ADRs and implementation plan.
Commands executed / results: `npx prettier --write README.md .harness/tasks/readme-showcase.md`, scoped Prettier check and `git diff --check` PASS. Python reference check PASS: 21 local targets exist, three screenshot tags have descriptive alt text. Existing screenshots visually inspected. Feature/roadmap claims reviewed against README baseline, implementation plan, delivery report and ADRs 010/016/017. Aggregate app verification and device E2E were not rerun for this documentation-only side task, avoiding a rebuild of the main thread's preview.
Open questions: App implementation and native revalidation continue independently in the main thread.
Handoff summary: README now leads with product story, three real development screenshots, available features and a separate roadmap. Setup, commands, architecture/harness links and release/security limitations retained. Only README and this task changed; no app source, data, configuration, commit, push or staging operations. Owner planning edits and main-thread implementation preserved.

Screenshot refresh (2026-10-14, owner request): all three README images now represent source 7e38767. Today uses the reviewed light 390 × 1250 capture with the sole banner rabbit and typographic footer. Fresh dark Insights and day-note captures use the same viewport and isolated localhost:8091 synthetic habits; no owner data changed. Links and alternative text updated, and capture date/source recorded beside the showcase. Dark test preference restored to Light; temporary viewport/tab/server cleaned up. Prettier and local reference checks pass. This documentation-only update introduces no native UI changes; the app aggregate verification on 7e38767 already passed all 92 tests and platform exports. Commit/push is authorized by the owner's ongoing direct-main instruction. Next product task remains 017 interface languages; existing app release gates are unchanged.

Image-format verification first exposed JPEG bytes saved under PNG filenames by the screenshot API. The README assets now use their actual .jpg format, unchanged capture bytes. Local reference check PASS: 21 targets, three descriptive alt texts and JPEG signatures; `file` confirms all three are 390 × 1250. `npx prettier --check README.md .harness/tasks/readme-showcase.md` and `git diff --check` PASS.
