import { forwardRef, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type NavigationTopProps = React.HTMLAttributes<HTMLElement> & {
  left?: ReactNode;
  right?: ReactNode;
};

/**
 * NavigationTop element to handle the top navigation bar - expects left and right elements
 */
export const NavigationTop = forwardRef<HTMLElement, NavigationTopProps>(
  ({ left, right, className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        'grid grid-col-6 gap-0 padding-md border-b border-solid border-grey-300',
        className,
      )}
      {...props}
    >
      <div className="col-span-5 items-left">{left}</div>
      <div className="items-right">{right}</div>
    </nav>
  ),
);
NavigationTop.displayName = 'NavigationTop';
