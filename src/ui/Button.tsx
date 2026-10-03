import { forwardRef } from 'react';

import { cn } from '../lib/cn';

export type Variant = 'primary' | 'secondary' | 'ghost';
export type Size = 'small' | 'default' | 'icon';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-element-primary border border-default text-on-element hover:bg-element-primary-lighter',
  secondary: 'bg-transparent text-default border border-default hover:border-emphasis',
  ghost: 'bg-transparent text-default hover:bg-surface-neutral',
};

const SIZES: Record<Size, string> = {
  small: 'rounded-md px-2.5 h-7 text-xs gap-1.5',
  default: 'rounded-md px-3 h-8 text-sm gap-1.5',
  // Square, same height as `default`. Use through IconButton or IconLink,
  // which require a label.
  icon: 'rounded-md h-8 w-8 text-sm',
};

/**
 * The Button look as a class string, so a link can look like a button
 * without becoming one (see IconLink).
 */
export function buttonClassName(variant: Variant = 'secondary', size: Size = 'default') {
  return cn(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-semibold',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
  );
}

/**
 * Trimmed version of the Stylus Button. Same shape, same focus treatment.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'default', className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonClassName(variant, size), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
