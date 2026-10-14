# ADR-019: Explicit visual celebration events

Status: accepted

The existing data-driven pulse can react to a restored completion when a screen refreshes. Replace this with a transient UI event emitted only after the completion service returns a successfully changed outcome. Completion methods return habit ID, immutable local date, resulting binary state and whether it changed. An idempotent mark returns changed=false; a failed write throws before any outcome/event. A pure policy distinguishes individual wins from all scheduled habits completed today, based on the post-write repository snapshot and an injected clock. Historical wins never claim today's all-done celebration.

A shared feedback context provides short-lived event serials. Components consume new serials only while mounted; initial mount, read refresh, backup merge and re-enabling effects do not replay an event. Persist only an animation-enabled device preference (migration 7), not events. The switch defaults on, and OS reduced motion overrides it. Disabling keeps text, checkmarks and static progress correct. Feedback is decorative/non-blocking and cannot write habit data.

This slice adds visual celebrations and a saved animation control. Optional sound remains planned: selecting an audio dependency, platform mute behavior and the sound preference needs its own scoped decision/explicit dependency authorization under AGENTS.md. No audio permission, native module or web-only substitute is added now.

If the optional post-write feedback snapshot is unavailable, skip the effect and keep the successful completion outcome. Feedback must not make a successful write look like a failed check-in. Undo clears the transient event and cancels its pulse; changing the saved motion setting or receiving an OS motion-change event clears it before re-enabling.
