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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '../lib/cn';
import { EditModeContext } from '../lib/editMode';
import { linkify } from '../lib/linkify';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';
import { Screenshot } from '../ui/Screenshot';
import { StepNumber } from './StepNumber';

import type { Step } from '../data/steps';

type Props = {
  step: Step;
  index: number;
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
 * The card as it exists today. It is not styled and it is not finished.
 */
export function StepCard({ step, index, isEditingStep, onEdit, onSave, onCancel, onDelete }: Props) {
  // Drag, edit and delete only work in edit mode.
  const isEditing = useContext(EditModeContext);

  // The card is what moves; the grip is the only thing that starts a drag
  // (`setActivatorNodeRef` + `listeners`). A locked step can't be picked up
  // (draggable) and nothing can be dropped onto its position (droppable).
  // It must be the object form: `disabled: true` only disables dragging.
  const locked = step.locked ?? false;
  const { attributes, listeners, node, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id, disabled: { draggable: locked, droppable: locked } });

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
      // `relative` so the drag handle can be positioned against the card.
      // Focus: border turns focus-colored when anything inside has keyboard
      // focus (`:has(:focus-visible)`, so mouse clicks don't trigger it).
      // Editing this step or dragging it: the same border. While dragging,
      // `z-10` keeps the card above the ones it passes.
      className={cn(
        'relative has-[:focus-visible]:border-focus',
        isEditing && 'cursor-pointer',
        (isEditingStep || isDragging) && 'border-focus',
        isDragging && 'z-10',
      )}
      style={{ transform: CSS.Translate.toString(transform), transition }}
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
          className="absolute right-full top-0 flex h-[72px] w-[60px] items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {step.locked ? (
            <FontAwesomeIcon icon={faLock} className="text-dim" title="Locked: this step can't be moved" />
          ) : (
            <IconButton
              ref={setActivatorNodeRef}
              icon={faGripVertical}
              label={`Reorder ${step.title}`}
              variant="ghost"
              // `touch-none` stops the browser scrolling the page when a
              // finger drags the grip, so touch reaches dnd-kit instead.
              className="touch-none"
              {...attributes}
              {...listeners}
            />
          )}
        </div>
      )}
      <div>
        <div className="flex items-center gap-3">
          <StepNumber>{index + 1}</StepNumber>
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
            <div className="ml-auto flex gap-1">
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
    </Card>
  );
}
