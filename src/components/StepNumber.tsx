import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type NumberProps = React.HTMLAttributes<HTMLSpanElement> & {
};

/**
 * Trimmed version of the Stylus Button. Same shape, same focus treatment.
 */
export const StepNumber = forwardRef<HTMLSpanElement, NumberProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-semibold',
        'bg-surface-info rounded-[2.5rem] w-[2.5rem] h-[2.5rem]',
        className,
      )}
      {...props}
    />
  ),
);
StepNumber.displayName = 'StepNumber';
