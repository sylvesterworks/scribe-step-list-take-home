import { forwardRef } from 'react';

import { cn } from '../lib/cn';

type Crumb = {
  title: string;
  url?: string;
};

export type BreadcrumbsProps = React.HTMLAttributes<HTMLSpanElement> & {
  items: Crumb[]
};

/**
 * The page's location trail. Crumbs with a `url` render as links.
 */
export const Breadcrumbs = forwardRef<HTMLSpanElement, BreadcrumbsProps>(
  ({ items, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'gap-[--p2]',
        className,
      )}
      {...props}
    >
      {items.map((item) =>
        item.url ? (
          <a key={item.title} href={item.url}>
            {item.title}
          </a>
        ) : (
          <span key={item.title}>{item.title}</span>
        ),
      )}
    </span>
  ),
);
Breadcrumbs.displayName = 'Breadcrumbs';
