# Remaining delivery work

Current priority (owner request, 2026-10-14): freeze optional feature additions and prepare the first paid App Store release. Task [019](tasks/019-app-store-preparation.md) records the readiness audit, Portuguese enrollment-to-publication guide and listing drafts. Owner confirms Tiny Wins and one-time paid download; has no Developer Program membership yet. Next implementation slice is release hardening: resolve security gate, app icon, native System appearance configuration, signed candidate/device backup/accessibility and iPad scope. Tasks 017/018 remain ready for later; they do not precede the release blockers. Follow [release readiness](../docs/release/READINESS.md), without interpreting draft copy or simulator builds as publication acceptance.

1. Insights per-habit binary victory tile walls are implemented in task 008; refine density and device accessibility from real use.
2. iOS simulator first-win and management restart flows pass in task 010. Next: Android emulator runtime, then native file picker/share/restore, VoiceOver/TalkBack, enlarged text and reduced motion.
3. Resolve dependency audit findings before release; retain the failing gate.
4. Native CI artifacts and direct main delivery: PR #1 merged by owner request; verify locally before each main push.
5. Owner decisions: license, final identifiers, store price and trademark rights; then paid App Store release preparation.

Implemented slices: compact Today, names/icons/colors/order/archive/restore; selected weekdays with effective-date history; monthly/yearly detail and eligible-day metrics; versioned export and atomic merge restore. See tasks 003–005 for actual evidence and limitations.

Calendar week-start preferences are implemented in task 007.

Renewable per-habit streak flexibility and softly colored grace tiles are delivered in task 011, with local/browser and hosted iPhone configuration/persistence acceptance. No new dependency or destructive schema migration.

Day notes are implemented in task 012 with local/browser verification and backup v3 compatibility. Native note save/restart/clear acceptance PASSED in run 38584048001. Saved system/light/dark appearance is implemented in task 013; run 38606371018 passes all four iPhone note/appearance/core flows. Widget feasibility remains task 014; implementation needs its own platform decisions.

Owner product priorities (2026-10-14): cozy visual refinement and saved animation controls are implemented; language support and localized habit suggestions remain planned. Audio needs a separate dependency/platform decision. The release-first priority above supersedes this feature delivery sequence.

Tasks 015/016 implement cozy surfaces and explicit/saved visual feedback. Task 016 is complete. Native run 38629308028 passes all six flows, including the repaired enlarged-text layout. Task 015 remains in progress for matching native validation of the subsequent typographic-footer refinement; earlier-source acceptance is not final-source evidence.

Deferred feature slices are scoped and ready: [017 — interface languages](tasks/017-interface-languages.md) follows supported device language with saved English/Português (Brasil) overrides; [018 — starter habit ideas](tasks/018-starter-habits.md) fills editable new-habit drafts without creating sample records. Neither is implemented yet; device-language API feasibility comes before any new dependency or release-setting change.
