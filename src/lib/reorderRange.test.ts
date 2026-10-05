import { describe, expect, it } from 'vitest';

import type { Step } from '../data/steps';
import { reorderRange } from './reorderRange';

const steps = (locked: boolean[]): Step[] =>
  locked.map((l, i) => ({ id: `s${i}`, title: '', description: '', hue: 0, locked: l }));

describe('reorderRange', () => {
  it('no locked steps: the whole list', () => {
    expect(reorderRange(steps([false, false, false]), 1)).toEqual([0, 2]);
  });

  it('locked first step: everything after it', () => {
    expect(reorderRange(steps([true, false, false]), 2)).toEqual([1, 2]);
  });

  it('locked middle step: each side is its own section', () => {
    const list = steps([false, false, true, false, false]);
    expect(reorderRange(list, 1)).toEqual([0, 1]);
    expect(reorderRange(list, 3)).toEqual([3, 4]);
  });
});
