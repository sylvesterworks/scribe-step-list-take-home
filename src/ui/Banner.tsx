import { forwardRef, type ReactNode } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '../lib/cn';

export type BannerVariant = 'info' | 'success' | 'error' | 'warning';

export type BannerProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  variant?: BannerVariant;
  /** The message. Long messages wrap. */
  title: ReactNode;
  /** Optional control on the right, e.g. a small Button. */
  action?: ReactNode;
};

// Each variant: a light fill, a darker 1px outline, and a dark text color that
// the icon shares. All pass WCAG: text 4.5:1 on the fill, outline 3:1 on the page.
// The outline is an inset shadow, not a border, so it takes no space and the
// banner is exactly 48px (a 1px border would make it 50).
const VARIANTS: Record<BannerVariant, { className: string; icon: IconDefinition }> = {
  info: {
    className: 'bg-surface-info text-info shadow-[inset_0_0_0_1px_var(--border-info)]',
    icon: faCircleInfo,
  },
  success: {
    className: 'bg-surface-success text-success shadow-[inset_0_0_0_1px_var(--border-success)]',
    icon: faCircleCheck,
  },
  error: {
    className: 'bg-surface-error text-error shadow-[inset_0_0_0_1px_var(--border-error)]',
    icon: faCircleExclamation,
  },
  warning: {
    className: 'bg-surface-warning text-warning shadow-[inset_0_0_0_1px_var(--border-warning)]',
    icon: faTriangleExclamation,
  },
};

/**
 * A message in a card-shaped box: icon, title, optional action.
 * At least 48px tall: 12px padding + a 24px line + 12px padding.
 *
 * This component isn't a live region. To have a screen reader announce it,
 * render it inside one, or announce the message separately.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = 'info', title, action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-h-12 items-start gap-3 rounded-xl px-6 py-3 leading-6',
        VARIANTS[variant].className,
        className,
      )}
      {...props}
    >
      {/* The icon and the action each sit in a 24px box, one line of text
          tall, centered in it. With `items-start` that lines them up with
          the title's first line, however many lines the title wraps to. */}
      <span className="flex h-6 shrink-0 items-center">
        <FontAwesomeIcon icon={VARIANTS[variant].icon} />
      </span>
      <div className="min-w-0 flex-1">{title}</div>
      {action && <div className="flex h-6 shrink-0 items-center">{action}</div>}
    </div>
  ),
);
Banner.displayName = 'Banner';
