import { useState } from 'react';

import { StepCard } from './components/StepCard';
import { steps as initialSteps, type Step } from './data/steps';

export default function App() {
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  function openStep(id: string) {
    const step = steps.find((s) => s.id === id);
    // Stands in for navigating to the step detail page.
    window.alert(`Open step: ${step?.title}`);
  }

  function renameStep(id: string) {
    const step = steps.find((s) => s.id === id);
    const title = window.prompt('Rename step', step?.title);
    if (title) {
      setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
    }
  }

  function deleteStep(id: string) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
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
  );
}
