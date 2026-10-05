import { forwardRef } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '../lib/cn';
import { buttonClassName, type Variant } from './Button';

export type IconLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'aria-label'
> & {
  href: string;
  icon: IconDefinition;
  /** Required: an icon has no text, so this is the link's only accessible name. */
  label: string;
  variant?: Variant;
};

/**
 * A link that looks like an IconButton. Use it when the action is navigation:
 * it is announced as a link, and opens in a new tab with cmd/ctrl+click.
 */
export const IconLink = forwardRef<HTMLAnchorElement, IconLinkProps>(
  ({ icon, label, variant = 'ghost', className, ...props }, ref) => (
    <a
      ref={ref}
      aria-label={label}
      // Same label as a hover tooltip for mouse users (see IconButton).
      title={label}
      className={cn(buttonClassName(variant, 'icon'), className)}
      {...props}
    >
      <FontAwesomeIcon icon={icon} className="text-dim" />
    </a>
  ),
);
IconLink.displayName = 'IconLink';
