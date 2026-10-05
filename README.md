# Scribe step list

Take-home for the Lead Design Engineer role. The visual target is the [Figma](https://www.figma.com/design/qTgJ028iwrvxNk7pl1ikH7/Design-Engineer-Exercise----Candidates-name-?node-id=0-1).

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5180 (not localhost, see vite.config.ts)
pnpm test       # Vitest + Testing Library
pnpm typecheck
```

Click **Edit** to reorder, edit and delete steps. **Done editing** saves. The footer switches between light and dark.

## The card interaction model

The brief says "the card opens the step". There's no step detail page in this exercise, so I read "open" as "open for editing" and made that the card's one action.

- **View mode is read-only.** Clicking a card does nothing; links in the step text still work.
- **Edit mode** gives each card three buttons: drag, edit and delete. Each does one thing, and all three work with a mouse, a keyboard and a screen reader.
- **Clicking the card body edits it**, the same as the edit button. Keyboard and screen reader users use the button, so the card itself isn't focusable.
- **Editing is inline.** The title and description become fields. Edit becomes Save (same button, so focus stays put) and Delete becomes Cancel. Enter saves, Escape or a click outside cancels.
- **No "selected" state.** Dragging starts from the grip only, so selecting first has no purpose.
- **Delete is immediate, with Undo, not a confirm dialog.** Authors delete often while cleaning up a guide; a dialog slows the common case and Undo makes mistakes cheap. A warning banner with Undo appears where the step was and stays until the next delete or Done editing. It has no timer, since a message that disappears is hard to reach by keyboard or screen reader (WCAG 2.2.1). Focus moves to the next step's delete button, and the change is announced.

### What it costs:
- One step can be edited at a time. Opening another step, clicking outside, deleting, or Done editing discards unsaved text without warning. I chose cancel over auto-save so nothing changes unless the author says so.
- The click target (the whole card) is bigger than the keyboard target (one button).
- Links in a step can't be clicked while it's being edited.
- Only the last delete can be undone.

## Where the Figma was silent: decisions

- **Edit controls are always visible in edit mode**, not only on hover as in the Figma. Hover-only controls can't be found by keyboard, screen reader or touch users, and the brief requires anything reachable by mouse to be reachable by keyboard. Cost: a busier edit view. (See design questions.)
- **Step description.** The Figma's card has no description, but every step has one, so it renders under the title with 8px above and below.
- **Page side padding is 60px, not 48px**, so the drag handle (centered in a 60×72 box outside the card, level with the step number) never runs off the page.
- **Hover** applies only in edit mode, where a click does something, and only to a card at rest: a darker border and a small shadow. It never changes a card that's open, being dragged or has keyboard focus, so focus plus hover looks exactly like focus.
- **Drag and drop uses the Figma's mock step for every input.** The Figma shows the small preview but not where the step will land.
  - The grabbed card shrinks into the preview, and its slot becomes a 64px dashed "Drop step here" placeholder that moves to the landing spot.
  - On drop, the preview slides into the slot and the card grows back out of it.
  - Keyboard users get the same visuals plus announcements ("Picked up…", "moved to position 3 of 40", "dropped").
  - I first built a version where the real card moves and kept a switch to compare. Once lift and drop were animated, the design's version told the story better, so I kept one model rather than two code paths.
- **Locked steps: nothing crosses a lock.** The brief says a locked step "cannot move". I went further: locked steps split the list into sections and a step only moves within its own, so a lock in the middle of the list also holds (the fixture only locks step 1).
  - The lock is a disabled control (dimmed, still focusable) so it doesn't look as usable as a grip, and screen reader users can find it and hear why.
  - Locked means "can't be reordered", as the starter's `Step` type says. It can still be edited and deleted.
  - Step 1 is "the guide's entry point" (starter data). If the locked first step is deleted, the new first step takes over the lock on _Done editing_. That happens at save, so _Undo_ works and the author can choose the new first step.
- **One-step list.** The grip stays visible but disabled, so the layout matches a longer list.
- **Empty list.** An info banner, "This guide has no steps yet.", instead of an empty list (screen readers would say "list, 0 items"). No "Add step", since adding isn't part of the exercise.
- **Motion**, all from the motion tokens:
  - Controls and the Undo banner fade in over 120ms on `--ease-standard`, as the brief asks.
  - Steps making room slide on 200ms `--ease-standard`: smooth, no bounce.
  - Lift and drop use `--ease-entrance`, fast then settling. The slot collapses and grows with it, so the list glides instead of jumping.
  - Reduced motion turns every animation off; reordering, editing, undo and announcements all still work.
- **Dark mode.** A Light / Dark switch in the footer. It follows the browser's setting until the user flips it; the choice is saved and survives a refresh. Values come from the Figma's dark mode where it has them. A shadow barely shows on dark, so lift relies on the preview's focus-colored outline instead.

## What's wrong in the starter

- **The "semantic utilities only" guardrail doesn't exist.** `colors` sits under `theme.extend`, so Tailwind's palette is still there: `bg-slate-800` compiles, and `Screenshot` uses raw `bg-black/10`. The radius scale is inconsistent too: `--radius-2xl` has no utility, while `rounded-4xl` is a hard-coded `2rem`.
- **`--border-focus` fails contrast**: 2.09:1 on white at 67% opacity, which is under the WCAG 3:1 minimum. Made solid (3.18:1). The Figma's dark value fails too (2.39:1) and got the same fix.
- **`Card type="linked"` can never take focus** (no `tabIndex`), and its focus cue is a border shift of 1.26:1.
- **`Button` uses `font-semibold` (600), but `index.html` only loads 400, 500 and 700.**
- **`cn` doesn't merge conflicting classes**, so `className` overrides on `ui/` components can silently lose to the base classes (that's why `Card`'s padding was changed in place).
- **`dark:` variants followed the OS** while the tokens were light-only. They now follow the theme attribute.
- **`StepCard`** was a clickable `div`, not focusable or announced, with real buttons nested inside it. The drag "button" was the text "drag", with no accessible name and no keyboard behavior.
- **`App`**: the list wasn't a list, the step count wasn't announced, and delete lost focus.

## What belongs in Stylus vs. stays local

### New in Stylus (`src/ui/`, tokens in `index.css`):
These UI elements were added assuming they *should* be design-system components. All components added were built in service of this demo; no Storybook stories or test coverage was added.
- `NavigationTop`: the page's top bar.
- `Breadcrumbs`: the location trail.
- `IconButton`: a square, icon-only `Button`; `label` is required.
- `IconLink`: a link that looks like an `IconButton`; `label` is required.
- `Link`: a badge-style external link that always opens in a new tab.
- `Banner`: info, success, error, warning, and drop, with a text message and an optional action button (not in the Figma). Only warning and drop variants are used in this demo, others are specced but not used.
- `Switch`: an on/off setting, with optional side labels. Used for the theme toggle in the footer (not in the Figma).
- The new tokens (see Tokens) and the `data-theme` dark-mode mechanism.

### Changed in Stylus:
- `Button`: added an `icon` size and an exported `buttonClassName()`, so links can look like buttons.
- `Card`: padding from `px-6 py-5` to `p-4`, to match the Figma.

### On top of dnd-kit:
dnd-kit stays the engine (sensors, collision, measuring). Stylus would own the parts every sortable list should get right:
- the drag handle (an `IconButton` with a per-item label, a disabled state and a lock state);
- the drop placeholder (`Banner variant="drop"`);
- announcement wording and keyboard instructions, written once and localized;
- the lift, drop and slide motion, including reduced motion;
- "locked" or "pinned" items as a list-level rule.

### Local to the editor:
`StepCard`, `StepList`, `DragPreview` (the mock step), `PageHeading`, `PageLayout`, `PageFooter`, `ThemeToggle`, edit-mode context, the draft and undo state in `App`, and `reorderRange` (until locking becomes a Stylus rule).

## Tests

The brief didn't ask for tests and the starter had no test runner. I added them anyway (`pnpm test`, Vitest with Testing Library) so the behavior is protected if code changes during the live session: a fix in one place that breaks reordering, locking or undo somewhere else shows up right away.

- 21 tests at the `App` level, written the way a user works: view and edit mode, inline editing, keyboard reordering and its announcement, locked steps (first and middle), delete and undo with focus, the theme toggle, and the empty and one-step lists.
- 3 unit tests for the locked-section rule (`reorderRange`).

## What I deliberately chose not to do

- **A confirm dialog for delete**: Undo instead (see above).
- **Auto-save on outside click**: cancel instead, so nothing changes by accident.
- **A full undo history**: one level fits a draft that's committed on Done editing.
- **"Add step"**: not part of the exercise.
- **`tailwind-merge` for `cn`**: fixing `Card` in place was smaller and easier to explain. Stylus's real `cn` does merge.
- **Two drag modes**: one model for every input (see above).
- **Pointer and touch tests**: jsdom has no layout. Keyboard drag is tested through a fake layout; pointer, touch and motion were checked by hand.

## What I'd do with more time

- **Fix the 1px offset** between the drag handle and the step number. `Card`'s CSS border takes layout space and Figma's inside stroke doesn't; an inset-shadow outline (as in the header, `Link` and `Banner`) fixes it. 
- **A 2px focus indicator on the inline fields**, for WCAG 2.2 AAA (2.4.13). They use a 1px border change today, which passes AA, but it's hard to see.
- **Fade the edit controls out**, not only in.
- **Light / System / Dark**, so a saved choice can go back to following the browser.
- **Enforce the semantic-only palette.** Move `colors` out of `theme.extend` so Tailwind's raw palette stops compiling, then add the few base colors still needed (`transparent`, and replacements for `Screenshot`'s raw `black` and `white`) as tokens.
- **Playwright tests** for pointer and touch dragging.
- **Announce blocked moves** ("can't move past a locked step") instead of staying silent.
- **Build ui/ components properly** with Storybook stories, test coverage and more flexible props; out of scope for this exercise.

## Design questions for the design team

- **The focus frame leaves out the drag handle.** This was called out in the instructions, but bears mention here. A card can only be focused in edit mode, where the handle is always shown, so I read this as a mistake and built "focus shows the same controls as hover".
- **Edit controls only on hover** are inaccessible (see decisions). I'd confirm always-visible controls with design.
- **The focus blue has a thin margin**: solid, it's 3.05:1 on the page background. A slightly darker blue would give room, but that's a brand color change.
- **The card shadow is invisible on dark.** Lift currently relies on the outline; design may want a dark-specific elevation.
- **What about the drop target?** There was a visual defined for how a card looked when dragging, but that assumes that we also need to handle the drop target. I made a design decision on this one for the project, but this would have been highlighted in a design review before engineering started.

## Tokens

### Added (not in the Figma):
- `--width-content`: the 720px content column (Tailwind `max-w-content`).
- `--width-drag-gutter`: 60px (Tailwind `px-drag-gutter`, `w-drag-gutter`). The drag handle's box beside each card, and the page side padding that has to fit it. They were two separate `60px` values; as one token, widening the handle can't push it off the page.
- `--drag-preview-width` / `--drag-preview-height`: 252×156 (Tailwind `w-drag-preview`, `h-drag-preview`). The Figma's drag preview, and the size the drop animation grows the card out of. They were repeated in the component and in the animation; as tokens, resizing the preview keeps the drop animation matching.
- `--border-info`: the `Link` badge stroke, so badges don't depend on the focus token.
- Success, error and warning text, fill and border colors for `Banner`. Text is 6.9:1 or better and borders 3:1 or better, in both themes.

### Changed:
- `--border-focus`: made solid in light and dark (see the starter section).

### Dark:
- A `:root[data-theme="dark"]` block in `index.css`.
- Tokens the Figma's dark mode doesn't cover are marked "not in the Figma" or "placeholder".
