import type { Config } from 'tailwindcss';

/**
 * A trimmed version of the Stylus Tailwind config. Use the semantic tokens.
 *
 * The intent is semantic utilities only, but it isn't enforced: `colors` sits
 * under `theme.extend`, which keeps Tailwind's default palette, so
 * `bg-slate-800` still compiles. Moving `colors` out of `extend` would enforce
 * it, but also removes `transparent`, `black` and `white`, which `Button` and
 * `Screenshot` use (see README, "What I'd do with more time").
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // `dark:` variants follow our theme attribute, not the OS setting, so they
  // match the tokens (the starter's Screenshot uses `dark:`).
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Public Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // The four type styles this surface uses. They match Tailwind's own
      // defaults — named here so the set is explicit rather than implied.
      // The rest of the scale (`text-sm` and friends) still works.
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      colors: {
        surface: {
          default: 'var(--bg-surface-default)',
          dim: 'var(--bg-surface-dim)',
          neutral: 'var(--bg-surface-neutral)',
          info: 'var(--bg-surface-info)',
          success: 'var(--bg-surface-success)',
          error: 'var(--bg-surface-error)',
          warning: 'var(--bg-surface-warning)',
        },
        accent: {
          1: 'var(--accent-1)',
        },
        element: {
          primary: 'var(--bg-element-primary)',
          'primary-lighter': 'var(--bg-element-primary-lighter)',
        },
      },
      textColor: {
        default: 'var(--text-default)',
        dim: 'var(--text-dim)',
        info: 'var(--text-info)',
        success: 'var(--text-success)',
        error: 'var(--text-error)',
        warning: 'var(--text-warning)',
        placeholder: 'var(--text-placeholder)',
        'on-element': 'var(--text-on-element)',
      },
      borderColor: {
        default: 'var(--border-default)',
        dim: 'var(--border-dim)',
        emphasis: 'var(--border-emphasis)',
        info: 'var(--border-info)',
        success: 'var(--border-success)',
        error: 'var(--border-error)',
        warning: 'var(--border-warning)',
        // Keep `focus` last: Tailwind emits these in this order, so a
        // `border-focus` added on top of another border color wins.
        focus: 'var(--border-focus)',
      },
      outlineColor: {
        focus: 'var(--border-focus)',
      },
      boxShadow: {
        base: 'var(--shadow-base)',
        inner: 'var(--shadow-inner)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '4xl': '2rem',
      },
      maxWidth: {
        content: 'var(--width-content)',
      },
      // `spacing` covers padding and width: px-drag-gutter, w-drag-gutter.
      spacing: {
        'drag-gutter': 'var(--width-drag-gutter)',
      },
      width: {
        'drag-preview': 'var(--drag-preview-width)',
      },
      height: {
        'drag-preview': 'var(--drag-preview-height)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        entrance: 'var(--ease-entrance)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
      },
      // Lift and drop. A keyframe with only a `from` ends at the element's
      // own styles; `card-expand` needs a `to` (see there).
      keyframes: {
        // Edit-mode controls (grip, edit, delete) fade in when they appear.
        'fade-in': {
          from: { opacity: '0' },
        },
        // The drag preview starts at the grabbed card's size (CSS variables
        // set by DragPreview) and shrinks to its own --drag-preview-width / --drag-preview-height.
        'preview-shrink': {
          from: { width: 'var(--drag-from-width)', height: 'var(--drag-from-height)' },
        },
        // At lift, the grabbed card's slot collapses from the card's height
        // (`--drag-card-height`, set on the list by App) to the 64px drop
        // target, so the cards below glide up instead of jumping.
        'slot-collapse': {
          from: { maxHeight: 'var(--drag-card-height)' },
        },
        // On drop, the reverse: the slot grows from 64px back to the card's
        // height, so the cards below glide down. At the same time the card
        // is revealed from the preview's size at its top-left corner
        // (clipping, not scaling, so the text never stretches). Sizes and corner radius are tokens.
        // Both need an explicit `to`: the card's own values are `none`, and
        // neither max-height nor clip-path can animate to `none`.
        'card-expand': {
          from: {
            maxHeight: '4rem',
            clipPath:
              'inset(0 calc(100% - var(--drag-preview-width)) calc(100% - var(--drag-preview-height)) 0 round var(--radius-xl))',
          },
          to: {
            maxHeight: 'var(--drag-card-height)',
            clipPath: 'inset(0 0 0 0 round var(--radius-xl))',
          },
        },
      },
      animation: {
        // The brief: affordances fade in over 120ms on --ease-standard.
        'fade-in': 'fade-in var(--duration-fast) var(--ease-standard)',
        'preview-shrink': 'preview-shrink var(--duration-base) var(--ease-entrance)',
        'card-expand': 'card-expand var(--duration-base) var(--ease-entrance)',
        'slot-collapse': 'slot-collapse var(--duration-base) var(--ease-entrance)',
      },
    },
  },
  plugins: [],
} satisfies Config;
