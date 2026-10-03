import { useState } from 'react';

import { Breadcrumbs, type Crumb } from './components/Breadcrumbs';
import { PageHeading } from './components/PageHeading';
import { NavigationTop } from './components/NavigationTop';
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

  const steps = isEditing ? draftSteps : savedSteps;

  function startEditing() {
    setDraftSteps(savedSteps);
    setIsEditing(true);
  }

  function finishEditing() {
    setSavedSteps(draftSteps);
    setIsEditing(false);
  }

  function openStep(id: string) {
    const step = steps.find((s) => s.id === id);
    // Stands in for navigating to the step detail page.
    window.alert(`Open step: ${step?.title}`);
  }

  function renameStep(id: string) {
    const step = steps.find((s) => s.id === id);
    const title = window.prompt('Rename step', step?.title);
    if (title) {
      setDraftSteps((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
    }
  }

  function deleteStep(id: string) {
    setDraftSteps((prev) => prev.filter((s) => s.id !== id));
  }

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

        <StepList>
          {steps.map((step, i) => (
            <li key={step.id}>
              <StepCard
                step={step}
                index={i}
                onOpen={openStep}
                onRename={renameStep}
                onDelete={deleteStep}
              />
            </li>
          ))}
        </StepList>
      </PageLayout>
    </EditModeContext.Provider>
  );
}
