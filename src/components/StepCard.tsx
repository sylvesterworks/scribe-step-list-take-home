import { useContext } from 'react';
import { faGripVertical, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
  onOpen: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * The card as it exists today. It is not styled and it is not finished.
 */
export function StepCard({ step, index, onOpen, onRename, onDelete }: Props) {
  // Drag, rename and delete only exist in edit mode. Opening a step always works.
  const isEditing = useContext(EditModeContext);

  return (
    <Card
      data-id="step-card"
      // `relative` so the drag handle can be positioned against the card.
      className="relative"
      onClick={(e) => {
        // A click on a link in the text follows the link, not the card.
        if ((e.target as HTMLElement).closest('a')) return;
        onOpen(step.id);
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
          <IconButton icon={faGripVertical} label={`Reorder ${step.title}`} variant="ghost" />
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
