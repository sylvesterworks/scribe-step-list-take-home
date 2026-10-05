import type { Step } from '../data/steps';

/**
 * Locked steps split the list into sections, and a step can only move within
 * its own section: nothing crosses a locked step. Returns the first and last
 * index the step at `index` may move to.
 *
 * Steps 1-5 with step 3 locked: step 2 (index 1) -> [0, 1]; step 4 -> [3, 4].
 */
export function reorderRange(steps: Step[], index: number): [number, number] {
  let start = index;
  while (start > 0 && !steps[start - 1].locked) start--;
  let end = index;
  while (end < steps.length - 1 && !steps[end + 1].locked) end++;
  return [start, end];
}
