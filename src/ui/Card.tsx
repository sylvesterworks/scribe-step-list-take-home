import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Visual style: default (static) or linked (hover border, pointer).
   * @default 'default'
   */
  type?: 'default' | 'linked';
};

/**
 * Copied from Stylus as it ships today, including `type="linked"`.
 * @see https://stylus.design/card
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(({ type, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-default bg-surface-default px-6 py-5',
      type === 'linked' && 'cursor-pointer hover:border-emphasis focus-visible:border-emphasis',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';
