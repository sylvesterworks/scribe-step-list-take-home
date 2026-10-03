import { forwardRef } from 'react';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '../lib/cn';

export type LinkVariant = 'heading' | 'body';

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
  href: string;
  /** `heading` is bold, for titles. `body` is normal weight, for running text. */
  variant?: LinkVariant;
};

/**
 * An external link styled as a badge, with an "opens elsewhere" icon on the
 * right. Always opens in a new tab.
 *
 * Exactly 24px tall: 4px padding + a 16px line + 4px padding. The 1px outline
 * is an inset shadow rather than a border, so it takes no space (like a Figma
 * inside stroke) and doesn't get rounded to a fraction of a pixel on scaled
 * displays.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = 'body', className, children, ...props }, ref) => (
    <a
      ref={ref}
      // noopener: the new tab can't reach back into this page via window.opener.
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        // align-top: the 24px badge sits in a 24px line without making it taller.
        'inline-flex h-6 items-center gap-1 rounded-sm px-2 py-1 align-top leading-4',
        'bg-surface-info text-info shadow-[inset_0_0_0_1px_var(--border-info)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        variant === 'heading' ? 'font-bold' : 'font-normal',
        className,
      )}
      {...props}
    >
      {children}
      {/* The icon is aria-hidden, so say it in words for screen readers. */}
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ),
);
Link.displayName = 'Link';
