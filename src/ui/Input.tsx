import { forwardRef } from 'react';

import { cn } from '../lib/cn';

/**
 * The look shared by Input and Textarea: the secondary Button's border and
 * radius, on the default surface. On focus the 1px border turns
 * `--border-focus`, with no outline, matching the card's focus treatment.
 * (`outline-none` in Tailwind 3 is a transparent outline, so Windows High
 * Contrast mode still shows one.)
 */
export const fieldClassName =
  'w-full rounded-md border border-default bg-surface-default px-3 text-default ' +
  'focus-visible:border-focus focus-visible:outline-none';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * A single-line text field, 32px tall like the default Button. Give it an
 * accessible name: a <label>, or `aria-label` when there's no visible label.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => (
  <input ref={ref} type={type} className={cn(fieldClassName, 'h-8', className)} {...props} />
));
Input.displayName = 'Input';
