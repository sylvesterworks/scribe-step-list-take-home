/**
 * The small mock step from the Figma's "Grabbed/dragging" frame. It follows
 * the pointer (or the arrow keys) during a drag, rendered in dnd-kit's
 * DragOverlay. Purely visual: screen readers get the drag announcements.
 *
 * 252x156. On mount it animates from the grabbed card's size down to that
 * (`animate-preview-shrink`, see tailwind.config.ts), which reads as lift.
 */
type Props = {
  number: number;
  /** The grabbed card's size before it shrank to the drop slot. */
  fromWidth: number;
  fromHeight: number;
};

export function DragPreview({ number, fromWidth, fromHeight }: Props) {
  return (
    <div
      aria-hidden="true"
      // The test setup's fake layout finds the preview by this.
      data-drag-preview
      // Read by the keyframe's `from`.
      style={{ '--drag-from-width': `${fromWidth}px`, '--drag-from-height': `${fromHeight}px` } as React.CSSProperties}
      className="relative flex h-[156px] w-[252px] cursor-grabbing flex-col rounded-xl border border-focus bg-surface-default p-3 shadow-base animate-preview-shrink motion-reduce:animate-none"
    >
      {/* Step number badge on the top-left corner. White on --text-info is
          9:1; white on --accent-1 would be only 3.18:1 for 12px text. */}
      <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--text-info)] text-xs font-bold text-on-element">
        {number}
      </span>
      {/* Skeleton: number circle and title bar, then the screenshot, which
          takes the remaining height so the preview looks right mid-shrink. */}
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 shrink-0 rounded-full bg-surface-neutral" />
        <div className="h-3 w-3/5 rounded-full bg-surface-neutral" />
      </div>
      <div className="mt-3 min-h-0 flex-1 rounded-md bg-surface-neutral" />
    </div>
  );
}
