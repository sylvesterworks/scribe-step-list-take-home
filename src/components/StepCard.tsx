import { useContext } from 'react';

import { EditModeContext } from '../lib/editMode';
import { linkify } from '../lib/linkify';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
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
      onClick={(e) => {
        // A click on a link in the text follows the link, not the card.
        if ((e.target as HTMLElement).closest('a')) return;
        onOpen(step.id);
      }}
    >
      {isEditing && <Button onClick={(e) => e.stopPropagation()}>drag</Button>}
      <div>
        <div className="flex items-center gap-3">
          <StepNumber>{index + 1}</StepNumber>
          <h2>{linkify(step.title, 'heading')}</h2>
        </div>
        <p className="py-2">{linkify(step.description, 'body')}</p>
      </div>
      {isEditing && (
        <>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRename(step.id);
            }}
          >
            Rename
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(step.id);
            }}
          >
            Delete
          </Button>
        </>
      )}
      <Screenshot hue={step.hue} />
    </Card>
  );
}
