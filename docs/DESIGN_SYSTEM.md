# Tiny Wins design and UX guide

Reference: [Habit App Design Board](inspirations/Tiny%20Wins%20Habit%20App%20Design%20Board.png), supplied by the owner. This is a direction, not a pixel-for-pixel specification. Product/calendar rules in IMPLEMENTATION_PLAN.md take priority.

## Applied direction

- Warm ivory background, forest actions, mint/sage surfaces and restrained apricot in the four-square brand mark.
- Fraunces for Today/editor headings and welcoming copy; Inter for names, controls and date labels.
- A compact Today header with a legible local date and a 48-point add button.
- A soft encouragement banner and an honest count of today's completed active habits; no fabricated historic metrics.
- Per-habit icon tile, name, streak, exactly 14 date cells and a separate 48-point completion control. Today's cell has an outline and state marker; historical cells do not toggle completion.
- One shared history legend; less decoration and repetition in each row.
- A live name/icon/color preview in the editor, twelve icon choices and six color choices. The current frequency is daily; there are no nonfunctional schedule selectors.
- Tap the name/icon to edit. Enter reorder mode for labeled move-up/down controls. Archive is reversible and does not delete history; archived habits have explicit restore controls.
- No placeholder Insights/Settings navigation. These destinations will appear with working features in later slices.

## Tokens and accessibility

Tokens live in src/theme/tokens.ts. Each habit color has a strong foreground/completion token and a pale background token. White checkmarks and an explicit checked state avoid using color alone. Selection controls expose radio/checked semantics and labels. Main actions and ordering controls have a minimum 48-point target. Names can wrap to two lines; surrounding rows grow with text. Keep all 14 cells on narrow screens. Respect system reduced motion in editor and check-in feedback.

Icons currently use system emoji on colored tiles, with accessible text labels. This avoids adding an icon dependency; glyph appearance can vary between iOS, Android and browser. Replace them with an approved shared vector set later if consistent artwork is needed. The bunny/illustration is optional and does not affect core navigation.

## Review gates

Review Today with six habits at 390px and 360px, long names, the editor, ordering and archive/restore. Check that all 14 dates fit, today is identifiable, and check-in remains a single deliberate tap. Native VoiceOver/TalkBack and large system text checks remain required on actual devices; browser screenshots do not establish those results.
