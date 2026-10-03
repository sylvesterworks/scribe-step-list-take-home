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

## Components added to `ui/`

`src/ui/` is the design system (Stylus) layer. The components below weren't in the starter, and we added them there on the assumption that they belong in Stylus, not in the editor:

- `IconButton`: a square, icon-only `Button`. `label` is required and becomes the `aria-label`.
- `IconLink`: an `<a>` that looks like an `IconButton`, for navigation. `label` is required.
- `Link`: an external link styled as a badge with an icon. It always opens in a new tab. `heading` and `body` variants.
- `Button` was extended with an `icon` size and an exported `buttonClassName()`, so links can look like buttons without becoming buttons.
