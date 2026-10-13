# ADR-007: Reversible habit management and persisted order

Status: accepted. Date: 2026-10-13.

The owner authorized the next roadmap slice and supplied a design/UX board. Implement rename, icon/color editing, archive/restore and ordering while preserving the daily schedule and completion history.

Schema v2 adds icon, nullable archived_at and sort_order. Versioned additive migrations preserve v1 habit IDs, starts_on, timestamps and check-ins; existing habits receive the plant icon and deterministic creation order. Queries order by sort_order, creation timestamp and ID. No table is recreated.

Editing only changes presentation fields. Archive retains the row and all completions, hides it from Today, and prevents new completion toggles through application use cases. Restore appends to the active list to avoid colliding with an order that changed during the break; prior completions remain in the same calendar dates. No missed days are backfilled. Current daily streak semantics remain unchanged after restoration. Archival eligibility statistics will need a separate policy when insights ship.

Use explicit move-up/down buttons rather than drag-only ordering: they work across platforms and with assistive technology without a new dependency. A transactional reorder accepts every active habit ID exactly once; invalid or stale sets fail before any updates. No permanent deletion is provided.
