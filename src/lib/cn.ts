/**
 * Minimal stand-in for Stylus's `cn`. Joins truthy class names.
 * The real one merges conflicting Tailwind classes; this one does not.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
