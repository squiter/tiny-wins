# Task 006: Completion feedback and stable reorder

Status: implemented and browser verified; native motion/accessibility acceptance pending

Goal: make check-ins rewarding, show a distinct completed-day state, replace the ambiguous Insights glyph and remove the reorder layout jump.

Acceptance: progress updates with scheduled wins; zero planned habits never celebrate a completed day; completing the final planned habit changes copy/color/icon; undo restores pending state; celebration on transition only, respecting reduced motion; entering/leaving reorder does not change card bounds; 48-point move controls remain labeled and edge-disabled; persisted order remains intact; no added dependencies.

Scope: Today progress component, HabitCard feedback/reorder, Insights tab icon, browser evidence/documentation.

Validation: aggregate verification and real browser completion/undo/reload, reorder bounds and movement, narrow layout. Native device motion/accessibility remains pending.

Results: all 55 existing tests and all-platform exports passed. Browser check-ins progressed 3→6, completed banner appeared, undo reverted 6→5, and the original three-win demo state was restored after review. Exact DOM bounds of all six cards match between normal/reorder modes (508 × 106.28125 at desktop). Move up/down succeeded and original order was restored. 360 px screenshots cover completed day and reorder. Reduced-motion settings bypass new pulse/progress animation; native/device behavior remains unverified. No new dependency.
