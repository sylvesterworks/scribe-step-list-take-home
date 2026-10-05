import type { ReactNode } from 'react';

/**
 * Prototype options at the bottom of the page: a white bar with a 1px top
 * line (an inset shadow, like NavigationTop's bottom line).
 */
export function PageFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="bg-surface-default px-6 py-4 shadow-[inset_0_1px_0_0_var(--border-default)]">
      <div className="flex flex-wrap items-center gap-6">{children}</div>
    </footer>
  );
}
