# ADR-015: Streak flexibility and grace tiles

Status: accepted. Date: 2026-10-14.

The owner authorized renewable per-habit tolerance and softly colored missed-date tiles. Advanced editor exposes Streak flexibility (0–7 scheduled misses), default zero. Each real eligible win renews the allowance. Count only actual wins in a sequence; pending today does not spend allowance, future dates and dates before the first win are never granted grace. Rest/paused dates are skipped. On each past missing scheduled date, the consecutive missing count is checked against that date's effective tolerance. Once exceeded, the sequence resets; previously granted grace remains visible, like retained historical wins. Historical edits recompute derived grace and streaks deterministically.

Store optional streakTolerance inside existing effective-date schedule JSON; absent means zero, so legacy databases need no destructive migration or rewriting. Policy edits start tomorrow; unchanged editor saves must not append identical future versions. Archive and restore carry the planned tolerance. A shared pure chronological evaluator drives current/best streak and grace classification. Grace is derived presentation, never a completion row: total wins, consistency, daily progress and success animations remain based on actual completions.

Grace tiles use the habit's soft surface and a small hollow circle, with explicit accessible labels, legend and day inspection. Completed tiles retain solid color/check. Rename streak support text to wins in a row. Export backup v2 to preserve policy; import v1 with zero tolerance and validate v2 bounds. Existing merge behavior remains additive and preserves owner metadata.

The feature adapts Org Habit's minimum/maximum repetition interval idea, without copying its overdue-color graph: https://orgmode.org/manual/Tracking-your-habits.html.
