import { useContext, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  faCheck,
  faGripVertical,
  faLock,
  faPencil,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { cn } from '../lib/cn';
import { EditModeContext } from '../lib/editMode';
import { linkify } from '../lib/linkify';
import { Banner } from '../ui/Banner';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';
import { Screenshot } from '../ui/Screenshot';
import { StepNumber } from './StepNumber';

import type { Step } from '../data/steps';

type Props = {
  step: Step;
  index: number;
  /** False when the list has only one step, so there's nothing to reorder. */
  canReorder: boolean;
  /** True right after this step is dropped: the card plays its expand. */
  isJustDropped: boolean;
  onDropAnimationEnd: () => void;
  /** True while this step's title and description are open as form fields. */
  isEditingStep: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, title: string, description: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
};

// The inline fields borrow the secondary Button's border and radius. On focus
// they match the card: the 1px border turns `--border-focus`, with no outline.
const FIELD_CLASS =
  'w-full rounded-md border border-default bg-surface-default px-3 text-default ' +
  'focus-visible:border-focus focus-visible:outline-none';

/**
 * This card is the foundation of the step process, with updates to support locked cards, 
 * isEditing, and all of our action handler functions.
 */
export function StepCard({
  step,
  index,
  canReorder,
  isJustDropped,
  onDropAnimationEnd,
  isEditingStep,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  // Drag, edit and delete only work in edit mode.
  const isEditing = useContext(EditModeContext);

  // The card is what moves; the grip is the only thing that starts a drag
  // (`setActivatorNodeRef` + `listeners`). A locked step can't be picked up
  // (draggable) and nothing can be dropped onto its position (droppable).
  // It must be the object form: `disabled: true` only disables dragging.
  const locked = step.locked ?? false;
  // With only one step there's nowhere to move it. Disabling `draggable` makes
  // dnd-kit drop the grip's listeners and set aria-disabled on it.
  const { attributes, listeners, node, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id, disabled: { draggable: locked || !canReorder, droppable: locked } });

  // The fields are uncontrolled (they start from `defaultValue`); Save reads
  // them through these refs.
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  // The edit/save button. When the fields close, focus goes back here so a
  // keyboard user isn't dropped at the top of the page.
  const editButtonRef = useRef<HTMLButtonElement>(null);

  function save() {
    // An empty title isn't allowed, so it falls back to the current one.
    const title = titleRef.current?.value.trim() || step.title;
    const description = descriptionRef.current?.value.trim() ?? step.description;
    editButtonRef.current?.focus();
    onSave(step.id, title, description);
  }

  function cancel() {
    editButtonRef.current?.focus();
    onCancel();
  }

  // While this step is open, a press anywhere outside the card cancels the
  // edit. Focus isn't moved back to the edit button here: it goes wherever
  // the user clicked. `node` is the card's element, from useSortable.
  useEffect(() => {
    if (!isEditingStep) return;
    function handlePointerDown(e: PointerEvent) {
      if (!node.current?.contains(e.target as Node)) onCancel();
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isEditingStep, node, onCancel]);

  // Enter in the title saves; Escape in either field cancels.
  function handleFieldKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') cancel();
    if (e.key === 'Enter' && e.currentTarget === titleRef.current) {
      e.preventDefault();
      save();
    }
  }

  return (
    <Card
      ref={setNodeRef}
      data-id="step-card"
      // App measures the card by this when a drag starts.
      data-step-id={step.id}
      // `relative` so the drag handle can be positioned against the card.
      // Focus: border turns focus-colored when anything inside has keyboard
      // focus (`:has(:focus-visible)`, so mouse clicks don't trigger it).
      // Editing this step or dragging it: the same border. While dragging,
      // `z-10` keeps the card above the ones it passes.
      className={cn(
        'relative has-[:focus-visible]:border-focus',
        isEditing && 'cursor-pointer',
        // Hover, only at rest (edit mode, not open, not dragging): a click
        // here opens the step, so hint at it. Added only at rest because
        // Tailwind emits `hover:` after `border-focus`, so it would otherwise
        // override the editing border. Keyboard focus inside still wins,
        // border and shadow: `has-[:focus-visible]` comes after `hover:`.
        isEditing &&
          !isEditingStep &&
          !isDragging &&
          'hover:border-emphasis hover:shadow-base has-[:focus-visible]:shadow-none',
        isEditingStep && 'border-focus',
        // While dragging, the preview follows the pointer and this card is
        // the drop target: hidden, with its slot shrunk to 64px; the dashed
        // banner below fills it. dnd-kit notices the new height and shifts
        // the other cards by 64px, so the 32px gaps hold during the drag.
        // `animate-slot-collapse` eases the slot down to that 64px.
        isDragging && 'invisible max-h-16 animate-slot-collapse motion-reduce:animate-none',
        // Just dropped: grow out of the preview's size (tailwind.config.ts).
        // `overflow-hidden` keeps the full-height content inside the slot
        // while the slot is still growing from 64px.
        isJustDropped && 'animate-card-expand overflow-hidden motion-reduce:animate-none',
        // Motion, all from tokens, off with reduced motion:
        // - hover's border and shadow ease in and out;
        // - while sorting, cards slide aside to make room. dnd-kit's
        //   `transition` is truthy only when a card should animate its move
        //   (it's null e.g. right after a drop, so cards don't slide twice),
        //   so `transform` joins the transition only then.
        transition
          ? 'transition-[transform,border-color,box-shadow]'
          : 'transition-[border-color,box-shadow]',
        'duration-base ease-standard motion-reduce:transition-none',
      )}
      // Only the transform from dnd-kit inline; its timing comes from the
      // classes above rather than dnd-kit's default `250ms ease`.
      style={{ transform: CSS.Translate.toString(transform) }}
      onAnimationEnd={(e) => {
        // Only the card's own expand, not animations bubbling up from inside.
        if (e.target === e.currentTarget) onDropAnimationEnd();
      }}
      onClick={(e) => {
        // In edit mode, clicking the card does its first action: edit.
        // In view mode a click does nothing.
        if (!isEditing) return;
        // A click on a link in the text follows the link, not the card.
        if ((e.target as HTMLElement).closest('a')) return;
        onEdit(step.id);
      }}
    >
      {isEditing && (
        // A 60x72 box against the card's outer left edge (`right-full`), with
        // the button centered in it so it lines up with the step number.
        // stopPropagation here covers the button and the empty box around it.
        <div
          className="absolute right-full top-0 flex h-[72px] w-[60px] animate-fade-in items-center justify-center motion-reduce:animate-none"
          onClick={(e) => e.stopPropagation()}
        >
          {step.locked ? (
            // Shown as a disabled control, dimmed like the one-step grip, so
            // it doesn't look as usable as a drag handle. aria-disabled (not
            // `disabled`) keeps it in the Tab order: keyboard and screen
            // reader users can find it and hear why the step can't move.
            <IconButton
              icon={faLock}
              label="Locked: this step can't be moved"
              variant="ghost"
              aria-disabled
              className="aria-disabled:opacity-50"
            />
          ) : (
            <IconButton
              ref={setActivatorNodeRef}
              icon={faGripVertical}
              label={`Reorder ${step.title}`}
              variant="ghost"
              // `touch-none` stops the browser scrolling the page when a
              // finger drags the grip, so touch reaches dnd-kit instead.
              // Dimmed when dnd-kit marks it aria-disabled (one-step list).
              className="touch-none aria-disabled:opacity-50"
              {...attributes}
              {...listeners}
            />
          )}
        </div>
      )}
      <div>
        <div className="flex items-center gap-3">
          {/* Hidden from screen readers: the <ol> already announces the
              position ("2 of 40"), so reading the number too would repeat it. */}
          <StepNumber aria-hidden="true">{index + 1}</StepNumber>
          {isEditingStep ? (
            <input
              ref={titleRef}
              // The user just asked to edit, so put them in the title.
              autoFocus
              aria-label="Step title"
              defaultValue={step.title}
              onKeyDown={handleFieldKeyDown}
              className={cn(FIELD_CLASS, 'h-8 min-w-0 flex-1 font-bold')}
            />
          ) : (
            <h2>{linkify(step.title, 'heading')}</h2>
          )}
          {isEditing && (
            // `ml-auto` takes up the free space, pushing the buttons right.
            // Like the grip box, this fades in when edit mode mounts it.
            <div className="ml-auto flex animate-fade-in gap-1 motion-reduce:animate-none">
              {/* One button that switches between Edit and Save, so keyboard
                  focus stays on it when the fields open and close. */}
              <IconButton
                ref={editButtonRef}
                icon={isEditingStep ? faCheck : faPencil}
                label={isEditingStep ? 'Save' : `Edit ${step.title}`}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditingStep) save();
                  else onEdit(step.id);
                }}
              />
              {/* While editing, Cancel takes Delete's place: a way out that
                  everyone can see, not just Escape, and no destructive
                  button next to Save. */}
              {isEditingStep ? (
                <IconButton
                  icon={faXmark}
                  label="Cancel editing"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    cancel();
                  }}
                />
              ) : (
                <IconButton
                  data-id="delete-step"
                  icon={faTrashCan}
                  label={`Delete ${step.title}`}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(step.id);
                  }}
                />
              )}
            </div>
          )}
        </div>
        {isEditingStep ? (
          <textarea
            ref={descriptionRef}
            aria-label="Step description"
            defaultValue={step.description}
            rows={2}
            onKeyDown={handleFieldKeyDown}
            className={cn(FIELD_CLASS, 'my-2 block py-1')}
          />
        ) : (
          <p className="py-2">{linkify(step.description, 'body')}</p>
        )}
      </div>
      <Screenshot hue={step.hue} />
      {isDragging && (
        // `visible` overrides the card's `invisible` for this banner only. It
        // covers the (now 64px) card exactly; `-inset-px` reaches over its
        // 1px border. `items-center` beats Banner's `items-start` because
        // Tailwind emits it later, centering the text in the 64px slot.
        <Banner
          variant="drop"
          title="Drop step here"
          className="visible absolute -inset-px items-center"
        />
      )}
    </Card>
  );
}
