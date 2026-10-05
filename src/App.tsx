import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Breadcrumbs, type Crumb } from './ui/Breadcrumbs';
import { DragPreview } from './components/DragPreview';
import { PageFooter } from './components/PageFooter';
import { PageHeading } from './components/PageHeading';
import { ThemeToggle } from './components/ThemeToggle';
import { NavigationTop } from './ui/NavigationTop';
import { PageLayout } from './components/PageLayout';
import { StepList } from './components/StepList';
import { StepCard } from './components/StepCard';
import { EditModeContext } from './lib/editMode';
import { reorderRange } from './lib/reorderRange';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Banner } from './ui/Banner';
import { Button } from './ui/Button';
import { IconLink } from './ui/IconLink';

import { steps as fixtureSteps, type Step } from './data/steps';

// The last crumb is the current page, so it has no url.
const BREADCRUMB_ITEMS: Crumb[] = [
  { title: 'Josh Sylvester', url: '#' },
  { title: 'Scribe Interview', url: '#' },
  { title: 'How to invite a team member' },
];

function stepCountLabel(count: number) {
  return `${count} ${count === 1 ? 'step' : 'steps'}`;
}

// `initialSteps` defaults to the 40 fixture steps; tests pass their own (an
// empty list, one step, a locked step in the middle).
export default function App({ initialSteps = fixtureSteps }: { initialSteps?: Step[] }) {
  // `savedSteps` is the committed list. While editing, changes go to
  // `draftSteps` and are copied back to `savedSteps` on "Done editing".
  const [savedSteps, setSavedSteps] = useState<Step[]>(initialSteps);
  const [draftSteps, setDraftSteps] = useState<Step[]>(initialSteps);
  const [isEditing, setIsEditing] = useState(false);
  // The one step whose title and description are open as form fields, if any.
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  // The most recent delete, kept so it can be undone. Only one level of undo.
  const [lastDeleted, setLastDeleted] = useState<{ step: Step; index: number } | null>(null);
  // Text for the visually hidden live region: what screen readers hear after
  // a delete or undo.
  const [announcement, setAnnouncement] = useState('');
  // The step being dragged, and its card's size when it was picked up, so the
  // drag preview can start at that size and shrink (the "lift").
  const [activeDrag, setActiveDrag] = useState<{
    id: UniqueIdentifier;
    width: number;
    height: number;
  } | null>(null);
  // The step that was just dropped, and its card's height. The card plays the
  // expand animation (the "drop"), growing its slot back to that height, then
  // clears this.
  const [justDropped, setJustDropped] = useState<{ id: UniqueIdentifier; height: number } | null>(
    null,
  );
  // The dragged or just-dropped card's height, for the slot animations.
  const dragCardHeight = activeDrag?.height ?? justDropped?.height;

  const steps = isEditing ? draftSteps : savedSteps;

  function startEditing() {
    setDraftSteps(savedSteps);
    setIsEditing(true);
  }

  function finishEditing() {
    // The first step is the guide's entry point and is pinned (see
    // data/steps.ts). If the locked first step was deleted, the step that's
    // first now takes over the lock. Done at save, not at delete, so Undo
    // works normally and the author can drag a different step to the top first.
    const oldFirst = savedSteps[0];
    const oldFirstDeleted = oldFirst?.locked && !draftSteps.some((s) => s.id === oldFirst.id);
    if (oldFirstDeleted && draftSteps.length > 0) {
      setSavedSteps([{ ...draftSteps[0], locked: true }, ...draftSteps.slice(1)]);
    } else {
      setSavedSteps(draftSteps);
    }
    setEditingStepId(null);
    setLastDeleted(null);
    setAnnouncement('');
    setIsEditing(false);
  }

  function saveStep(id: string, title: string, description: string) {
    setDraftSteps((prev) => prev.map((s) => (s.id === id ? { ...s, title, description } : s)));
    setEditingStepId(null);
  }

  function deleteStep(id: string) {
    const index = draftSteps.findIndex((s) => s.id === id);
    const step = draftSteps[index];
    const remaining = draftSteps.filter((s) => s.id !== id);
    // flushSync applies these updates right away, so the DOM queried below
    // already shows the shorter list and the Undo banner.
    flushSync(() => {
      setDraftSteps(remaining);
      setLastDeleted({ step, index });
      // Any delete closes an open edit. An open card shows Cancel instead of
      // Delete, which would throw off the button positions used below.
      setEditingStepId(null);
    });
    setAnnouncement(`Deleted ${step.title}. ${stepCountLabel(remaining.length)}.`);
    // The deleted button is gone, so move focus to the delete button that took
    // its place: the next step's, or the previous step's if it was the last.
    // With no steps left, the Undo button.
    const deleteButtons = document.querySelectorAll<HTMLButtonElement>('[data-id="delete-step"]');
    const target =
      deleteButtons[Math.min(index, deleteButtons.length - 1)] ??
      document.querySelector<HTMLButtonElement>('[data-id="undo-delete"]');
    target?.focus();
  }

  function undoDelete() {
    if (!lastDeleted) return;
    const { step, index } = lastDeleted;
    flushSync(() => {
      setDraftSteps((prev) => [...prev.slice(0, index), step, ...prev.slice(index)]);
      setLastDeleted(null);
    });
    setAnnouncement(`Restored ${step.title}.`);
    // The Undo button is gone with the banner; focus the restored step.
    document.querySelectorAll<HTMLButtonElement>('[data-id="delete-step"]')[index]?.focus();
  }

  // Pointer covers mouse, pen and touch. Keyboard: Space/Enter to pick up,
  // arrows to move, Space/Enter to drop, Escape to cancel.
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart({ active }: DragStartEvent) {
    // Measure the card now: once the drag state renders, it shrinks to the
    // 64px drop slot. (dnd-kit's own `active.rect` isn't filled in yet here.)
    const card = document.querySelector(`[data-step-id="${active.id}"]`);
    const rect = card?.getBoundingClientRect();
    setActiveDrag({ id: active.id, width: rect?.width ?? 0, height: rect?.height ?? 0 });
  }

  // Dropped or cancelled (Escape): either way the card expands back into
  // place. With reduced motion there's no expand to play (and no
  // animationend to clear it), so don't set it.
  function endDrag(id: UniqueIdentifier) {
    setActiveDrag(null);
    if (!prefersReducedMotion && activeDrag) setJustDropped({ id, height: activeDrag.height });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    endDrag(active.id);
    if (!over || active.id === over.id) return;
    setDraftSteps((prev) => {
      const from = prev.findIndex((s) => s.id === active.id);
      const to = prev.findIndex((s) => s.id === over.id);
      // Guard: never move a step across a locked one. Collision detection
      // below already keeps `over` inside the range; this makes sure.
      const [start, end] = reorderRange(prev, from);
      if (to < start || to > end) return prev;
      return arrayMove(prev, from, to);
    });
  }

  // dnd-kit's closestCenter, limited to the dragged step's own section (see
  // reorderRange). The drop target can't appear across a locked step, for
  // pointer or keyboard.
  const collisionDetection: CollisionDetection = (args) => {
    const from = steps.findIndex((s) => s.id === args.active.id);
    const [start, end] = reorderRange(steps, from);
    const allowed = steps.slice(start, end + 1).map((s) => s.id);
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter((c) => allowed.includes(String(c.id))),
    });
  };

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

  // On drop, dnd-kit slides the preview into the card's top-left corner while
  // the card expands out of it (StepCard's `animate-card-expand`).
  // - Duration and easing come from the motion tokens. dnd-kit animates with
  //   the Web Animations API, which can't read var(), so read the values here.
  // - `sideEffects: null`: by default dnd-kit hides the card until the slide
  //   ends, which would hide the expand.
  // - Reduced motion: no slide, the preview just disappears. Dragging and
  //   dropping work the same.
  const rootStyle = getComputedStyle(document.documentElement);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dropAnimation: DropAnimation | null = prefersReducedMotion
    ? null
    : {
        duration: parseFloat(rootStyle.getPropertyValue('--duration-base')),
        easing: rootStyle.getPropertyValue('--ease-standard').trim(),
        sideEffects: null,
      };

  // Shown after a delete, in the deleted step's place in the list.
  const undoBanner = lastDeleted && (
    <Banner
      variant="warning"
      // Fades in like the edit-mode controls.
      className="animate-fade-in motion-reduce:animate-none"
      title={`Deleted step with title "${lastDeleted.step.title}".`}
      action={
        <Button size="small" data-id="undo-delete" onClick={undoDelete}>
          Undo
        </Button>
      }
    />
  );

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
          description={stepCountLabel(steps.length)}
        />

        {/* `sr-only` hides this visually and positions it absolutely, so it
            doesn't take a slot in the page's 32px gap. */}
        <p role="status" className="sr-only">
          {announcement}
        </p>
        {steps.length === 0 ? (
          // Empty list: a message instead of an empty <ol>, which screen
          // readers would announce as "list, 0 items". The Undo banner (edit
          // mode, right after deleting the last step) sits above it.
          <>
            {undoBanner}
            <Banner variant="info" title="This guide has no steps yet." />
          </>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={({ active }) => endDrag(active.id)}
            accessibility={{ announcements }}
          >
            <SortableContext items={steps} strategy={verticalListSortingStrategy}>
              <StepList
                // The dragged or dropped card's height, read by the slot
                // animations (inherited by every card; only that one uses it).
                style={
                  dragCardHeight
                    ? ({ '--drag-card-height': `${dragCardHeight}px` } as React.CSSProperties)
                    : undefined
                }
              >
                {steps.map((step, i) => (
                  // The Undo banner sits where the deleted step was: above the
                  // step that took its place, or below the last step if the
                  // deleted one was last. It goes inside an existing <li>, not
                  // its own, so screen readers' item count and positions stay
                  // right. `gap-8` spaces it like the cards.
                  <li key={step.id} className="flex flex-col gap-8">
                    {lastDeleted?.index === i && undoBanner}
                    <StepCard
                      step={step}
                      index={i}
                      canReorder={steps.length > 1}
                      isJustDropped={step.id === justDropped?.id}
                      onDropAnimationEnd={() => setJustDropped(null)}
                      isEditingStep={step.id === editingStepId}
                      onEdit={setEditingStepId}
                      onSave={saveStep}
                      onCancel={() => setEditingStepId(null)}
                      onDelete={deleteStep}
                    />
                    {lastDeleted?.index === steps.length && i === steps.length - 1 && undoBanner}
                  </li>
                ))}
              </StepList>
            </SortableContext>
            {/* What follows the pointer or the arrow keys. Rendered outside
                the list, so it floats above everything. */}
            <DragOverlay dropAnimation={dropAnimation}>
              {activeDrag && (
                <DragPreview
                  number={position(activeDrag.id)}
                  fromWidth={activeDrag.width}
                  fromHeight={activeDrag.height}
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </PageLayout>
      <PageFooter>
        <ThemeToggle />
      </PageFooter>
    </EditModeContext.Provider>
  );
}
