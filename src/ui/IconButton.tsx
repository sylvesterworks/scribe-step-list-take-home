import { forwardRef } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, type ButtonProps } from './Button';

export type IconButtonProps = Omit<ButtonProps, 'size' | 'children' | 'aria-label'> & {
  icon: IconDefinition;
  /** Required: an icon has no text, so this is the button's only accessible name. */
  label: string;
};

/**
 * A square Button showing only an icon. Button owns the look and focus ring;
 * this adds the required label, rendered as aria-label.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, ...props }, ref) => (
    <Button ref={ref} size="icon" aria-label={label} {...props}>
      <FontAwesomeIcon icon={icon} className="text-dim" />
    </Button>
  ),
);
IconButton.displayName = 'IconButton';
