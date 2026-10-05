/**
 * The small mock step from the Figma's "Grabbed/dragging" frame. It follows
 * the pointer during a mouse or touch drag (rendered in dnd-kit's
 * DragOverlay). Purely visual: screen readers get the drag announcements.
 */
export function DragPreview({ number }: { number: number }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-[252px] cursor-grabbing rounded-xl border border-focus bg-surface-default p-3 shadow-base"
    >
      {/* Step number badge on the top-left corner. White on --text-info is
          9:1; white on --accent-1 would be only 3.18:1 for 12px text. */}
      <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--text-info)] text-xs font-bold text-on-element">
        {number}
      </span>
      {/* Skeleton: number circle and title bar, then the screenshot. */}
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-surface-neutral" />
        <div className="h-3 w-3/5 rounded-full bg-surface-neutral" />
      </div>
      <div className="mt-3 h-[100px] rounded-md bg-surface-neutral" />
    </div>
  );
}
