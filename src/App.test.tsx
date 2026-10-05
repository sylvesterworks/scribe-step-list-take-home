import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import App from './App';
import type { Step } from './data/steps';

// --- helpers ---------------------------------------------------------------

/** `count` simple steps ("Step 1", "Step 2", ...), locking the given indexes. */
function makeSteps(count: number, lockedIndexes: number[] = []): Step[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `s${i + 1}`,
    title: `Step ${i + 1}`,
    description: `Description ${i + 1}`,
    hue: 0,
    locked: lockedIndexes.includes(i),
  }));
}

function setup(initialSteps?: Step[]) {
  const user = userEvent.setup();
  render(<App initialSteps={initialSteps} />);
  return user;
}

/** Step titles in list order. */
function titles() {
  const list = within(screen.getByRole('main')).queryByRole('list');
  return list ? within(list).getAllByRole('heading', { level: 2 }).map((h) => h.textContent) : [];
}

/** dnd-kit's keyboard sensor attaches its listeners on the next tick. */
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Keyboard drag: focus the step's grip, Space, the arrow keys, Space. */
async function keyboardMove(user: ReturnType<typeof userEvent.setup>, title: string, keys: string) {
  screen.getByRole('button', { name: `Reorder ${title}` }).focus();
  await user.keyboard(' ');
  await tick();
  for (const key of keys.split(' ')) {
    await user.keyboard(`{${key}}`);
    await tick();
  }
  await user.keyboard(' ');
  await tick();
}

// --- tests -----------------------------------------------------------------

describe('App: view mode', () => {
  it('shows the 40 fixture steps as an ordered list, read-only', () => {
    setup();
    expect(screen.getByText('40 steps')).toBeInTheDocument();
    expect(titles()).toHaveLength(40);
    expect(screen.queryByRole('button', { name: /^Reorder/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Delete/ })).not.toBeInTheDocument();
  });

  it('hides the visible step number from screen readers (the list gives the position)', () => {
    setup(makeSteps(3));
    expect(screen.getByText('2')).toHaveAttribute('aria-hidden', 'true');
    expect(within(screen.getByRole('main')).getAllByRole('listitem')).toHaveLength(3);
  });
});

describe('App: edit mode', () => {
  it('Edit shows the controls; Done editing hides them', async () => {
    const user = setup(makeSteps(3));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getAllByRole('button', { name: /^Reorder/ })).toHaveLength(3);
    expect(screen.getAllByRole('button', { name: /^Delete/ })).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: 'Done editing' }));
    expect(screen.queryByRole('button', { name: /^Reorder/ })).not.toBeInTheDocument();
  });

  it('edits a title inline; Enter saves, Escape cancels', async () => {
    const user = setup(makeSteps(3));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.click(screen.getByRole('button', { name: 'Edit Step 2' }));
    const title = screen.getByRole('textbox', { name: 'Step title' });
    await user.clear(title);
    await user.type(title, 'Renamed{Enter}');
    expect(titles()).toEqual(['Step 1', 'Renamed', 'Step 3']);

    await user.click(screen.getByRole('button', { name: 'Edit Step 3' }));
    await user.type(screen.getByRole('textbox', { name: 'Step title' }), ' changed{Escape}');
    expect(titles()).toEqual(['Step 1', 'Renamed', 'Step 3']);
  });
});

describe('App: reordering with the keyboard', () => {
  it('moves a step and announces where it landed', async () => {
    const user = setup(makeSteps(5));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await keyboardMove(user, 'Step 2', 'ArrowDown');

    expect(titles()).toEqual(['Step 1', 'Step 3', 'Step 2', 'Step 4', 'Step 5']);
    expect(screen.getByText('Step 2 dropped at position 3 of 5.')).toBeInTheDocument();
  });

  it('Escape cancels the move', async () => {
    const user = setup(makeSteps(5));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    screen.getByRole('button', { name: 'Reorder Step 2' }).focus();
    await user.keyboard(' ');
    await tick();
    await user.keyboard('{ArrowDown}');
    await tick();
    await user.keyboard('{Escape}');
    await tick();

    expect(titles()).toEqual(['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5']);
  });

  it('keeps the new order after Done editing', async () => {
    const user = setup(makeSteps(3));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await keyboardMove(user, 'Step 1', 'ArrowDown');
    await user.click(screen.getByRole('button', { name: 'Done editing' }));

    expect(titles()).toEqual(['Step 2', 'Step 1', 'Step 3']);
  });
});

describe('App: locked steps', () => {
  it('a locked step has no grip, only a disabled lock', async () => {
    const user = setup(makeSteps(3, [0]));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.queryByRole('button', { name: 'Reorder Step 1' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Locked: this step can't be moved" })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('deleting the locked first step moves the lock to the new first step on Done editing', async () => {
    const user = setup(makeSteps(3, [0]));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Delete Step 1' }));

    // Still editing: Step 2 is first but not locked yet (Undo could bring Step 1 back).
    expect(screen.getByRole('button', { name: 'Reorder Step 2' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Done editing' }));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.queryByRole('button', { name: 'Reorder Step 2' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Locked: this step can't be moved" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reorder Step 3' })).toBeInTheDocument();
  });

  it('Undo before Done editing keeps the original lock', async () => {
    const user = setup(makeSteps(3, [0]));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Delete Step 1' }));
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    await user.click(screen.getByRole('button', { name: 'Done editing' }));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(titles()).toEqual(['Step 1', 'Step 2', 'Step 3']);
    expect(screen.getByRole('button', { name: 'Reorder Step 2' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: "Locked: this step can't be moved" })).toHaveLength(1);
  });

  it('nothing moves above a locked first step', async () => {
    const user = setup(makeSteps(3, [0]));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await keyboardMove(user, 'Step 2', 'ArrowUp');

    expect(titles()).toEqual(['Step 1', 'Step 2', 'Step 3']);
  });

  it('nothing crosses a locked step in the middle', async () => {
    const user = setup(makeSteps(5, [2])); // Step 3 locked
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await keyboardMove(user, 'Step 2', 'ArrowDown ArrowDown');
    await keyboardMove(user, 'Step 4', 'ArrowUp ArrowUp');

    expect(titles()).toEqual(['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5']);
  });

  it('steps still move within their own section', async () => {
    const user = setup(makeSteps(5, [2]));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await keyboardMove(user, 'Step 4', 'ArrowDown');

    expect(titles()).toEqual(['Step 1', 'Step 2', 'Step 3', 'Step 5', 'Step 4']);
  });
});

describe('App: delete and undo', () => {
  it('deletes a step, shows Undo in its place, and moves focus', async () => {
    const user = setup(makeSteps(3));
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.click(screen.getByRole('button', { name: 'Delete Step 2' }));

    expect(titles()).toEqual(['Step 1', 'Step 3']);
    expect(screen.getByText('2 steps')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Step 3' })).toHaveFocus();
    // Our live region (dnd-kit adds its own role="status" too, so find by text).
    expect(screen.getByText('Deleted Step 2. 2 steps.')).toHaveAttribute('role', 'status');
  });

  it('Undo puts the step back where it was', async () => {
    const user = setup(makeSteps(3));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Delete Step 2' }));

    await user.click(screen.getByRole('button', { name: 'Undo' }));

    expect(titles()).toEqual(['Step 1', 'Step 2', 'Step 3']);
    expect(screen.getByRole('button', { name: 'Delete Step 2' })).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
  });
});

describe('App: theme', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("with no saved choice, follows the browser's setting (light in tests)", () => {
    setup();
    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('flipping the switch applies dark and saves the choice', async () => {
    const user = setup();
    await user.click(screen.getByRole('switch', { name: 'Dark mode' }));

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('a saved choice wins on the next load', () => {
    localStorage.setItem('theme', 'dark');
    setup();
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});

describe('App: list sizes', () => {
  it('empty list: shows a message instead of an empty list', () => {
    setup([]);
    expect(screen.getByText('0 steps')).toBeInTheDocument();
    expect(screen.getByText('This guide has no steps yet.')).toBeInTheDocument();
    expect(within(screen.getByRole('main')).queryByRole('list')).not.toBeInTheDocument();
  });

  it('deleting the last step leaves the empty message and focuses Undo', async () => {
    const user = setup(makeSteps(1));
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Delete Step 1' }));

    expect(screen.getByText('This guide has no steps yet.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveFocus();
  });

  it('one step: "1 step", and its grip is disabled', async () => {
    const user = setup(makeSteps(1));
    expect(screen.getByText('1 step')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const grip = screen.getByRole('button', { name: 'Reorder Step 1' });
    expect(grip).toHaveAttribute('aria-disabled', 'true');

    // Space does nothing: there's nowhere to move.
    await keyboardMove(user, 'Step 1', 'ArrowDown');
    expect(titles()).toEqual(['Step 1']);
  });
});
