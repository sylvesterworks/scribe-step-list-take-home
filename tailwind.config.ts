import type { Config } from 'tailwindcss';

/**
 * A trimmed version of the Stylus Tailwind config. Semantic utilities only —
 * the palette itself is deliberately not exposed, so `bg-slate-800` will not
 * work. Use the semantic tokens.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
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
        placeholder: 'var(--text-placeholder)',
        'on-element': 'var(--text-on-element)',
      },
      borderColor: {
        default: 'var(--border-default)',
        dim: 'var(--border-dim)',
        emphasis: 'var(--border-emphasis)',
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
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        entrance: 'var(--ease-entrance)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
      },
    },
  },
  plugins: [],
} satisfies Config;
