# ADR-017: Saved appearance and shared palettes

Status: accepted

Deliver the owner's high-priority dark mode after day notes. Store one device presentation preference: system (default), light or dark. React Native useColorScheme provides live OS/browser changes; a pure resolver selects light when the system scheme is unavailable. Explicit override wins over the system. Add a constrained appearance column in migration 6, retaining all current data and calendar preferences. Backup merge retains device appearance, as it already retains week-start.

Use immutable light/dark palettes and a shared useTheme hook backed by preferences. Component styles are memoized by palette rather than mutating global tokens. Loading/recovery surfaces use the current system palette because the database may be unavailable. Navigation and status bar follow the resolved appearance. No new dependency or OS permission.

Dark mode retains habit hue identity with lighter strong colors and subdued tolerance surfaces. Semantic foreground tokens distinguish text on primary actions and filled habit tiles. Keep the existing ✓, ○, – and note corner marker: appearance changes never alter dates, completion, eligibility or metrics. Verify contrast for text and state marks in both palettes; tiny annual tiles retain larger calendar alternatives. Device accessibility and Android runtime require their own evidence.
