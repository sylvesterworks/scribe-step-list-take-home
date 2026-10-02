import { Screenshot } from '../ui/Screenshot';
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
  return (
    <div onClick={() => onOpen(step.id)}>
      <button onClick={(e) => e.stopPropagation()}>drag</button>
      <span>{index + 1}</span>
      <div>
        <p>{step.title}</p>
        <p>{step.description}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename(step.id);
        }}
      >
        Rename
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(step.id);
        }}
      >
        Delete
      </button>
      <Screenshot hue={step.hue} />
    </div>
  );
}
