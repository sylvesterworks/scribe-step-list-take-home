import { useState } from 'react';

import { Breadcrumbs } from './components/Breadcrumbs';
import { NavigationTop } from './components/NavigationTop';
import { StepCard } from './components/StepCard';
import { EditModeContext } from './lib/editMode';
import { Button } from './ui/Button';

import { steps as initialSteps, type Step } from './data/steps';

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
        left={<Breadcrumbs items={[]} />}
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
      <div className="">
        <h1>How to invite a team member</h1>
        <p>{steps.length} steps</p>

        {steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            onOpen={openStep}
            onRename={renameStep}
            onDelete={deleteStep}
          />
        ))}
      </div>
    </EditModeContext.Provider>
  );
}
