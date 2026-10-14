# ADR-013: Per-habit binary victory walls

Status: accepted

The owner requested a central Insights view of each habit's sequence of victories, guided by the saved reference. The continuation selects task 008 after the security slice. Insights now leads with Year by default and offers Week/Month, previous/next eligible periods and Today. Each habit retains its own color and 365/366 date tiles in a year; there is no heat intensity or partial completion.

Pure report helpers align date windows with the saved week start, navigate from month-end/leap dates safely and reuse effective-schedule metrics. Consistency counts elapsed eligible opportunities, includes pending today, and is weighted by opportunities. Archived histories and existing off-schedule wins remain visible; only eligible wins enter consistency. Future/pre-creation/rest dates are distinguishable and excluded from the denominator. No synthetic historical records are inserted.

Annual walls use chronological rows of five weeks (35 columns), aligned to the first weekday. Week/month show seven columns with larger numbered dates. Condensed annual tiles expose full date/state labels and open inspection only; 48-point period/navigation/explore/confirm controls provide a larger calendar alternative. A separate explicit confirmation writes a date through the existing guarded service. Archived/future/pre-creation/rest dates cannot create new wins. Existing off-schedule wins can be undone. The inspector names the habit as well as the date.

Rows are virtualized. A restrained wall pulse follows an increase in wins within the same viewed range; switching periods does not celebrate. System reduced motion bypasses the pulse. Today retains its 14 dates and existing feedback. No new dependency, permission, migration or backup-format change.

Verification: fixed-date period/eligibility/archival tests and existing persistence/security gates; browser yearly tile counts, week/month layouts, explicit undo/re-mark and real records at 390/360 px. Native screen-reader, large system text, small-tile usability and motion acceptance remain device gates. The reference guides the product shape; density can be refined after real use.
