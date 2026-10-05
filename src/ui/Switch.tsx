import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children'> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible text next to the switch; also its accessible name. */
  label: string;
};

/**
 * An on/off setting. A <button role="switch">: screen readers announce
 * "<label>, switch, on/off", and Space or Enter toggles it.
 *
 * Off: a dim outline and thumb. On: an accent fill and a white thumb. The
 * track's edge is 3:1 against white in both states (WCAG 1.4.11).
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, label, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex items-center gap-2 rounded-md text-sm',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className,
      )}
      {...props}
    >
      {/* Track, then thumb. `translate-x-4` slides the thumb to the right. */}
      <span
        aria-hidden="true"
        className={cn(
          'flex h-5 w-9 shrink-0 items-center rounded-full p-0.5',
          checked ? 'bg-accent-1' : 'bg-surface-default shadow-[inset_0_0_0_1px_var(--text-dim)]',
        )}
      >
        <span
          className={cn(
            'h-4 w-4 rounded-full',
            checked ? 'translate-x-4 bg-surface-default' : 'bg-[var(--text-dim)]',
          )}
        />
      </span>
      {label}
    </button>
  ),
);
Switch.displayName = 'Switch';
