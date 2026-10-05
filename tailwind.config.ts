import type { Config } from 'tailwindcss';

/**
 * A trimmed version of the Stylus Tailwind config. Semantic utilities only —
 * the palette itself is deliberately not exposed, so `bg-slate-800` will not
 * work. Use the semantic tokens.
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
        // set by DragPreview) and shrinks to its own 252x156.
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
        // is revealed from the preview's 252x156 at its top-left corner
        // (clipping, not scaling, so the text never stretches).
        // Both need an explicit `to`: the card's own values are `none`, and
        // neither max-height nor clip-path can animate to `none`.
        'card-expand': {
          from: {
            maxHeight: '4rem',
            clipPath: 'inset(0 calc(100% - 252px) calc(100% - 156px) 0 round 0.75rem)',
          },
          to: {
            maxHeight: 'var(--drag-card-height)',
            clipPath: 'inset(0 0 0 0 round 0.75rem)',
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
