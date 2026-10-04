# Scribe — Step List (take-home starter)

```bash
pnpm install
pnpm dev
```

Then open **http://127.0.0.1:5180**. `pnpm typecheck` runs TypeScript.

> Use `127.0.0.1`, not `localhost`. On macOS `localhost` resolves to IPv6 first, and if anything else is bound to `[::1]` on the same port you get a blank page instead of this app. Each app here has its own port and will fail loudly rather than silently moving to another one.

## What's here

```
src/
  App.tsx                 the list — plain, unstyled, unfinished
  components/StepCard.tsx the card as it exists today
  data/steps.ts           40 steps of fixture data
  ui/Button.tsx           trimmed Stylus Button
  ui/Card.tsx             Stylus Card, copied as it ships
  ui/Screenshot.tsx       stands in for the step screenshot
  index.css               Stylus token subset — light only, and not complete
```

**The visual target is the [Figma](https://www.figma.com/design/qTgJ028iwrvxNk7pl1ikH7/Design-Engineer-Exercise----Candidates-name-?node-id=0-1)**, linked from your brief as well. There's no reference page in this repo — the file is the spec.

`tailwind.config.ts` exposes **semantic utilities only** — `bg-surface-default`, `text-dim`, `border-emphasis`. The raw palette is not available, so `bg-slate-800` will not work. That's on purpose.

**`index.css` is a subset, not the whole collection.** If the design needs a value that isn't in there, take it from the design file, add it under the same name, and say why in your README.

## Notes

- Nothing here is sacred. If a file is wrong, change it — including the ones in `ui/`.
- Adding a dependency is fine.

Your task is in the brief you were sent, not in this file.

## Tokens added

- `--width-content: 720px` (Tailwind: `max-w-content`). The width of the page's content column in the Figma. Tailwind's nearest step is `max-w-3xl` (768px), so matching the design would otherwise mean a hard-coded `max-w-[720px]`. A raw value like that can drift from the design without anyone noticing. As a token, the column width has a name, lives in one place, and every page that uses it changes together.
- `--border-info: #5098c1`, the stroke of the `Link` badge. The info family already had `--text-info` and `--bg-surface-info` but no border. The closest existing color was `--border-focus`, but using the focus-ring token for decoration ties the two together: retune the focus ring (it currently fails 3:1 contrast) and every badge changes with it. The value is the same as `--accent-1`.

## Where we went beyond the Figma

- **Step description.** The Figma's card has no description text, but every fixture step has one, so we render it under the title. Its spacing is our call: 8px above and below (`py-2`) separates it from the title row and keeps it off the screenshot.
- **Page side padding is 60px, not 48px.** In edit mode the drag handle sits outside the card, centered in a 60×72 box so that it lines up with the step number. The design's 48px side padding doesn't leave room for that box, so on narrow windows the handle would overflow off the page. The page's left and right padding is 60px so the handle always fits. Top and bottom stay at 48px. The design doesn't cover this case.

## Known differences from the Figma

- **The drag handle sits 1px higher than the step number.** The cause is how borders are measured. In Figma, a card's stroke is drawn inside the frame and takes up no layout space. In CSS, `Card`'s 1px `border` does take space, so everything inside the card moves down 1px compared with the design. This is a common gap between Figma and production code. The header already avoids it by using an inset shadow in place of a border. We haven't changed `Card` yet, because its hover, selected and drag states will probably change how it draws its edge, so we'll fix this when we build those states.

## Components added to `ui/`

`src/ui/` is the design system (Stylus) layer. The components below weren't in the starter, and we added them there on the assumption that they belong in Stylus, not in the editor:

- `IconButton`: a square, icon-only `Button`. `label` is required and becomes the `aria-label`.
- `IconLink`: an `<a>` that looks like an `IconButton`, for navigation. `label` is required.
- `Link`: an external link styled as a badge with an icon. It always opens in a new tab. `heading` and `body` variants.
- `Button` was extended with an `icon` size and an exported `buttonClassName()`, so links can look like buttons without becoming buttons.
- `Card` padding changed from `px-6 py-5` to `p-4` to match the Figma. Overriding it from `StepCard` with `className` doesn't work: the starter's `cn` doesn't merge conflicting classes, and Tailwind outputs `.p-4` before `.px-6`/`.py-5`, so the base padding always wins.
