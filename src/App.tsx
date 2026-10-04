import { useRef, useState } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Breadcrumbs, type Crumb } from './ui/Breadcrumbs';
import { PageHeading } from './components/PageHeading';
import { NavigationTop } from './ui/NavigationTop';
import { PageLayout } from './components/PageLayout';
import { StepList } from './components/StepList';
import { StepCard } from './components/StepCard';
import { EditModeContext } from './lib/editMode';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Button } from './ui/Button';
import { IconLink } from './ui/IconLink';

import { steps as initialSteps, type Step } from './data/steps';

// The last crumb is the current page, so it has no url.
const BREADCRUMB_ITEMS: Crumb[] = [
  { title: 'Josh Sylvester', url: '#' },
  { title: 'Scribe Interview', url: '#' },
  { title: 'How to invite a team member' },
];

export default function App() {
  // `savedSteps` is the committed list. While editing, changes go to
  // `draftSteps` and are copied back to `savedSteps` on "Done editing".
  const [savedSteps, setSavedSteps] = useState<Step[]>(initialSteps);
  const [draftSteps, setDraftSteps] = useState<Step[]>(initialSteps);
  const [isEditing, setIsEditing] = useState(false);
  // The one step whose title and description are open as form fields, if any.
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const steps = isEditing ? draftSteps : savedSteps;

  function startEditing() {
    setDraftSteps(savedSteps);
    setIsEditing(true);
  }

  function finishEditing() {
    setSavedSteps(draftSteps);
    setEditingStepId(null);
    setIsEditing(false);
  }

  function saveStep(id: string, title: string, description: string) {
    setDraftSteps((prev) => prev.map((s) => (s.id === id ? { ...s, title, description } : s)));
    setEditingStepId(null);
  }

  function deleteStep(id: string) {
    setDraftSteps((prev) => prev.filter((s) => s.id !== id));
  }

  // Pointer covers mouse, pen and touch. Keyboard: Space/Enter to pick up,
  // arrows to move, Space/Enter to drop, Escape to cancel.
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setDraftSteps((prev) => {
      const from = prev.findIndex((s) => s.id === active.id);
      const to = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, from, to);
    });
  }

  // What screen readers hear while reordering. dnd-kit's defaults read out
  // raw ids ("step-3"), so these use the title and position instead.
  // The list only changes on drop, so during a drag `position(active.id)` is
  // still where the step started and `position(over.id)` is where it would land.
  function titleOf(id: UniqueIdentifier) {
    return steps.find((s) => s.id === id)?.title ?? 'Step';
  }
  function position(id: UniqueIdentifier) {
    return steps.findIndex((s) => s.id === id) + 1;
  }
  // dnd-kit fires onDragOver right after onDragStart (the step starts out over
  // its own position), which would replace "Picked up" with "moved to" before
  // anything moved. So onDragOver only speaks when the position changes.
  const lastAnnouncedOver = useRef<UniqueIdentifier | null>(null);

  const announcements: Announcements = {
    onDragStart: ({ active }) => {
      lastAnnouncedOver.current = active.id;
      return `Picked up ${titleOf(active.id)}, position ${position(active.id)} of ${steps.length}.`;
    },
    onDragOver: ({ active, over }) => {
      const overId = over?.id ?? null;
      if (overId === lastAnnouncedOver.current) return undefined;
      lastAnnouncedOver.current = overId;
      return over
        ? `${titleOf(active.id)} moved to position ${position(over.id)} of ${steps.length}.`
        : `${titleOf(active.id)} is not over a position.`;
    },
    onDragEnd: ({ active, over }) =>
      over
        ? `${titleOf(active.id)} dropped at position ${position(over.id)} of ${steps.length}.`
        : `${titleOf(active.id)} dropped. Order unchanged.`,
    onDragCancel: ({ active }) =>
      `Move cancelled. ${titleOf(active.id)} is back at position ${position(active.id)} of ${steps.length}.`,
  };

  return (
    <EditModeContext.Provider value={isEditing}>
      <NavigationTop
        left={
          <div className="flex items-center gap-2">
            <IconLink
              href="https://scribehow.notion.site/Lead-Design-Engineer-take-home-exercise-3dd901189afa815794a9e692cb6a9ee1"
              icon={faArrowLeft}
              label="Back to the exercise brief"
            />
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
          </div>
        }
        right={
          // One element whose label and variant change, rather than two
          // different buttons, so keyboard focus stays on it after a click.
          <Button
            variant={isEditing ? 'primary' : 'secondary'}
            onClick={isEditing ? finishEditing : startEditing}
          >
            {isEditing ? 'Done editing' : 'Edit'}
          </Button>
        }
      />
      <PageLayout>
        <PageHeading
          heading="How to invite a team member"
          description={`${steps.length} ${steps.length === 1 ? 'step' : 'steps'}`}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          accessibility={{ announcements }}
        >
          <SortableContext items={steps} strategy={verticalListSortingStrategy}>
            <StepList>
              {steps.map((step, i) => (
                <li key={step.id}>
                  <StepCard
                    step={step}
                    index={i}
                    isEditingStep={step.id === editingStepId}
                    onEdit={setEditingStepId}
                    onSave={saveStep}
                    onCancel={() => setEditingStepId(null)}
                    onDelete={deleteStep}
                  />
                </li>
              ))}
            </StepList>
          </SortableContext>
        </DndContext>
      </PageLayout>
    </EditModeContext.Provider>
  );
}
