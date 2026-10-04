import { useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faGripVertical, faLock, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
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
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * The card as it exists today. It is not styled and it is not finished.
 */
export function StepCard({ step, index, isSelected, onSelect, onRename, onDelete }: Props) {
  // Drag, rename, delete and selecting only work in edit mode.
  const isEditing = useContext(EditModeContext);

  // The card is what moves; the grip is the only thing that starts a drag
  // (`setActivatorNodeRef` + `listeners`). A locked step can't be picked up
  // (draggable) and nothing can be dropped onto its position (droppable).
  // It must be the object form: `disabled: true` only disables dragging.
  const locked = step.locked ?? false;
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.id, disabled: { draggable: locked, droppable: locked } });

  return (
    <Card
      ref={setNodeRef}
      data-id="step-card"
      // `relative` so the drag handle can be positioned against the card.
      // Focus: border turns focus-colored when anything inside has keyboard
      // focus (`:has(:focus-visible)`, so mouse clicks don't trigger it).
      // Selected or dragging: the same border. While dragging, `z-10` keeps
      // the card above the ones it passes.
      className={cn(
        'relative has-[:focus-visible]:border-focus',
        isEditing && 'cursor-pointer',
        (isSelected || isDragging) && 'border-focus',
        isDragging && 'z-10',
      )}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onClick={(e) => {
        // Selecting is part of editing; in view mode a click does nothing.
        if (!isEditing) return;
        // A click on a link in the text follows the link, not the card.
        if ((e.target as HTMLElement).closest('a')) return;
        onSelect(step.id);
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
          <h2>{linkify(step.title, 'heading')}</h2>
          {isEditing && (
            // `ml-auto` takes up the free space, pushing the buttons right.
            <div className="ml-auto flex gap-1">
              <IconButton
                icon={faPencil}
                label={`Rename ${step.title}`}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(step.id);
                }}
              />
              <IconButton
                icon={faTrashCan}
                label={`Delete ${step.title}`}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(step.id);
                }}
              />
            </div>
          )}
        </div>
        <p className="py-2">{linkify(step.description, 'body')}</p>
      </div>
      <Screenshot hue={step.hue} />
    </Card>
  );
}
