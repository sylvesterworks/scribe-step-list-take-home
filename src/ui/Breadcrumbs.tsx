import { forwardRef } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type Crumb = {
  title: string;
  url?: string;
};

export type BreadcrumbsProps = React.HTMLAttributes<HTMLElement> & {
  items: Crumb[];
};

/**
 * The page's location trail: Link > Link > Current page. A crumb with a `url`
 * is a link; a crumb without one is the current page and renders bold.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, className, ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
      {/* Preflight's `list-style: none` makes Safari/VoiceOver drop list semantics; role="list" restores them. */}
      <ol role="list" className="flex items-center gap-2">
        {items.map((item, i) => (
          <li key={item.title} className="flex items-center gap-2">
            {/* The separator is decorative: FontAwesomeIcon sets aria-hidden. */}
            {i > 0 && <FontAwesomeIcon icon={faAngleRight} className="text-dim" />}
            {item.url ? (
              <a href={item.url}>{item.title}</a>
            ) : (
              <span aria-current="page" className="font-bold">
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  ),
);
Breadcrumbs.displayName = 'Breadcrumbs';
