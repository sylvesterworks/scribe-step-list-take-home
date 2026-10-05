import { forwardRef } from 'react';

import { cn } from '../lib/cn';
import { fieldClassName } from './Input';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * A multi-line text field with the same look as Input. Give it an accessible
 * name: a <label>, or `aria-label` when there's no visible label.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  // `block` drops the inline gap below a textarea; `py-1` matches Input's text inset.
  <textarea ref={ref} className={cn(fieldClassName, 'block py-1', className)} {...props} />
));
Textarea.displayName = 'Textarea';
