import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type NumberProps = React.HTMLAttributes<HTMLSpanElement> & {
};

/**
 * A simplified visual for the step number rendering the number within a properly sized circle.
 */
export const StepNumber = forwardRef<HTMLSpanElement, NumberProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-semibold',
        // 40px circle: h-10/w-10 are on Tailwind's scale; rounded-full makes it round.
        'h-10 w-10 rounded-full bg-surface-info',
        className,
      )}
      {...props}
    />
  ),
);
StepNumber.displayName = 'StepNumber';
