import { forwardRef, ReactNode } from 'react';

import { cn } from '../lib/cn';

export type NavigationTopProps = React.HTMLAttributes<HTMLElement> & {
  left?: ReactNode;
  right?: ReactNode;
};

/**
 * The page's top bar, with `left` and `right` slots. It renders a <header>,
 * not a <nav>: the breadcrumbs inside it are the navigation landmark.
 */
export const NavigationTop = forwardRef<HTMLElement, NavigationTopProps>(
  ({ left, right, className, ...props }, ref) => (
    <header
      ref={ref}
      // 64px tall: 16px padding top and bottom around a 32px line.
      // `justify-between` pushes `left` and `right` to opposite edges.
      // The bottom line is an inset shadow, not a border: a shadow takes no
      // layout space, so the content box stays exactly 32px (like a Figma
      // inside stroke). A 1px border would leave 31px.
      className={cn(
        'flex h-16 items-center justify-between bg-surface-default px-6 py-4 leading-8',
        'shadow-[inset_0_-1px_0_0_var(--border-default)]',
        className,
      )}
      {...props}
    >
      <div>{left}</div>
      <div>{right}</div>
    </header>
  ),
);
NavigationTop.displayName = 'NavigationTop';
