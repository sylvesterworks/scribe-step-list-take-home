import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children'> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** The accessible name, e.g. "Dark mode". Shown next to the switch unless side labels are given. */
  label: string;
  /** Optional words on either side, e.g. "Light" and "Dark". Visual only. */
  offLabel?: string;
  onLabel?: string;
};

/**
 * An on/off setting. A <button role="switch">: screen readers announce
 * "<label>, switch, on/off", and Space or Enter toggles it.
 *
 * Off: a dim outline and thumb. On: an accent fill and a surface-colored
 * thumb. The track's edge is 3:1 against its surface in both states (WCAG 1.4.11).
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, label, offLabel, onLabel, className, ...props }, ref) => {
    const hasSideLabels = offLabel !== undefined && onLabel !== undefined;
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        // With side labels the visible words aren't the name, so name it here.
        aria-label={hasSideLabels ? label : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          'inline-flex items-center gap-2 rounded-md text-sm text-default',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          className,
        )}
        {...props}
      >
        {hasSideLabels && <span aria-hidden="true">{offLabel}</span>}
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
              'h-4 w-4 rounded-full transition-transform duration-fast ease-standard motion-reduce:transition-none',
              checked ? 'translate-x-4 bg-surface-default' : 'bg-[var(--text-dim)]',
            )}
          />
        </span>
        {hasSideLabels ? <span aria-hidden="true">{onLabel}</span> : label}
      </button>
    );
  },
);
Switch.displayName = 'Switch';
