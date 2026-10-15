# Tiny Wins design and UX guide

Reference: [Habit App Design Board](inspirations/Tiny%20Wins%20Habit%20App%20Design%20Board.png), supplied by the owner. This is a direction, not a pixel-for-pixel specification. Product/calendar rules in IMPLEMENTATION_PLAN.md take priority.

## Applied direction

- Warm ivory background, forest actions, mint/sage surfaces and restrained apricot in the four-square brand mark.
- Fraunces for Today/editor headings and welcoming copy; Inter for names, controls and date labels.
- A compact Today header with a legible local date and a 48-point add button.
- A soft encouragement banner and an honest count of today's completed active habits; no fabricated historic metrics.
- Per-habit icon tile, name, streak, exactly 14 date cells and a separate 48-point completion control. Today's cell has an outline and state marker; historical cells do not toggle completion.
- One shared history legend; less decoration and repetition in each row.
- A live name/icon/color preview in the editor, twelve icon choices and six color choices. Daily and selected-weekday frequencies are functional; schedule changes start tomorrow.
- Tap the name/icon to edit. Enter reorder mode for labeled move-up/down controls. Archive is reversible and does not delete history; archived habits have explicit restore controls.
- Today, Insights and Settings are now working tabs. Habit names open monthly/yearly progress, with editing as an explicit action.

## Tokens and accessibility

Tokens live in src/theme/tokens.ts. Each habit color has a strong foreground/completion token and a pale background token. White checkmarks and an explicit checked state avoid using color alone. Selection controls expose radio/checked semantics and labels. Main actions and ordering controls have a minimum 48-point target. Names can wrap to two lines; surrounding rows grow with text. Keep all 14 cells on narrow screens. Respect system reduced motion in editor and check-in feedback.

Icons currently use system emoji on colored tiles, with accessible text labels. This avoids adding an icon dependency; glyph appearance can vary between iOS, Android and browser. Replace them with an approved shared vector set later if consistent artwork is needed. Navigation uses shared React Native shapes for home, progress bars and settings. A bundled transparent botanical rabbit illustration appears only in the all-done daily banner, outside compact rows. It is decorative, hidden from accessibility and never carries state alone. Page footers use muted serif encouragement with generous spacing, without an image or colored card. Cards share rounded corners and gentle depth in both palettes; see ADR-018.

## Review gates

Review Today with six habits at 390px and 360px, long names, the editor, ordering and archive/restore. Check that all 14 dates fit, today is identifiable, and check-in remains a single deliberate tap. Native VoiceOver/TalkBack and large system text checks remain required on actual devices; browser screenshots do not establish those results.

## Deliberate celebrations

A successful changed completion emits a transient event: a brief control/tile pulse for an individual win, and a botanical banner celebration when all positive scheduled opportunities today are complete. Reload, restored data, duplicates and failed writes never replay feedback. Undo restores static state. Settings saves the animation choice; system reduced motion overrides it. Disabling effects keeps completion symbols, counts and encouraging copy. No sound or haptic dependency is included; see ADR-019.

## Optional starter ideas

New-habit editors offer a collapsed “Need an idea?” section after the name field. Opening it reveals three small ideas: read one page, drink water and take a short walk. Each uses an existing icon/color and English or Brazilian Portuguese title. A full-width, at-least-64-point choice with a checkmark and explicit selected label updates only the editable name/icon/color. It preserves configured weekdays and streak flexibility; Save remains a separate deliberate action. Editing an existing habit never offers ideas.

Selection resets the native name input only on that deliberate action; ordinary typing retains the established uncontrolled input to preserve native cursor/text behavior. Changing interface language never rewrites a draft or saved title. No template identifier, automatic samples, quantities, new schema, package, animation or onboarding is added. The section wraps naturally at 360/390 points and keeps the existing scrollable editor and reduced-motion behavior. Native enlarged-text evidence is recorded separately in task 018.

## Weekly rhythm

The editor adds a selected, explicitly labeled Weekly goal choice and 48-point target controls (1–7). Show the saved week boundary and effective-date explanation. Hide daily tolerance controls in weekly mode; choosing an optional starter idea still changes only name/icon/color.

Today keeps exactly 14 cells and shows this week's binary progress plus a week-based sequence. Neutral ◇ dates are flexible opportunities, never artificial wins or daily misses. Short-week goals explain their cap. Detail and Insights show a dated live goal panel; consistency labels distinguish assessed closed-week opportunities from raw wins. Weekly-only Today uses week-oriented encouragement, and weekly check-ins never replay the daily all-done animation. Color, symbols, explicit accessible labels and standard scalable React Native text communicate the same state in both themes/languages; native enlarged-text acceptance is recorded in task 023.
