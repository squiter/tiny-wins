# ADR-018: Cozy botanical visual language

Status: accepted

Follow the owner's newly prioritized design board with a restrained bundled rabbit/botanical vignette, softer shared cards and matching drawn tab icons. Generate a decorative transparent raster asset with the imagegen skill; inspect and copy the selected result into assets. Use standard React Native Image/View and existing fonts, with no SVG/icon dependency. The illustration has no semantic meaning and is excluded from accessibility. Functional controls and date grids remain code, not generated pictures.

Keep decorative space outside compact habit rows. Reserve the rabbit illustration for the all-done daily banner, alongside real progress. Main pages end with a quiet typographic encouragement, with generous spacing and no illustrated or colored footer card. This follows the owner's 2026-10-14 refinement: repeating the same image at the top and bottom weakens the design hierarchy. Light/dark palettes retain readable contrast and binary state cues. Do not change data, navigation, historic dates or the 14-cell count. Native and enlarged-text visual evidence must be distinguished from browser evidence.

The existing hosted iPhone harness adds an enlarged-text inspection pass after normal runtime regressions. Capture the installed simctl help and content-size readback, then review Today/detail/editor/day inspector under accessibility-large. Android retains shared scalable React Native text and its native compilation gate; enlarged-text/runtime evidence remains pending until its emulator harness is available. These are test-runner platform commands, not platform-specific app logic.

Enlarged native review exposed unbounded detail header and month text overflowing the screen. Give user text flexible wrapping space, constrain the Edit/Restore action within the header, and reserve the 48-point navigation controls. Decorative chevrons stay fixed size; user copy keeps system scaling. Review captures as well as successful selectors: an off-screen accessibility node or tappable clipped label is not visual acceptance. Full-screen modal edge actions use full visibility when the content end prevents centering.
