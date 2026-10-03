import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type PageLayoutProps = React.HTMLAttributes<HTMLElement>;

/**
 * The page's main content column: centered, `--width-content` wide, 48px padding on every side.
 */
export const PageLayout = forwardRef<HTMLElement, PageLayoutProps>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn(
        // `box-content` makes max-width measure the content, not the padding,
        // so the column stays 720px and the 48px sits outside it.
        'mx-auto box-content max-w-content p-12',
        className,
      )}
      {...props}
    />
  ),
);
PageLayout.displayName = 'PageLayout';
