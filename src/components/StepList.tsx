import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type StepListProps = React.OlHTMLAttributes<HTMLOListElement>;

/**
 * The ordered list of steps, with a 32px gap between items. Each child should
 * be an `<li>`, so screen readers announce "list, N items" and each position.
 */
export const StepList = forwardRef<HTMLOListElement, StepListProps>(
  ({ className, ...props }, ref) => (
    <ol
      data-id="step-list"
      ref={ref}
      // Tailwind's preflight sets `list-style: none`, and Safari/VoiceOver
      // then drops the list semantics. `role="list"` puts them back.
      role="list"
      className={cn(
        'flex flex-col gap-8',
        className,
      )}
      {...props}
    />
  ),
);
StepList.displayName = 'StepList';
