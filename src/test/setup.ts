import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * jsdom is a DOM without a browser: no layout, no media queries, no
 * ResizeObserver. dnd-kit needs all three, so these stand in for them.
 */

afterEach(cleanup);

// Reduced motion on. The app skips its drop animation (which uses the Web
// Animations API, missing in jsdom), and the tests don't wait on animations.
// Dragging must work the same either way, which is part of what we test.
window.matchMedia = (query: string) =>
  ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom doesn't implement scrolling; dnd-kit scrolls while dragging.
window.scrollTo = () => {};
Element.prototype.scrollBy = () => {};
Element.prototype.scrollIntoView = () => {};

// A fake layout, so dnd-kit can tell what is where. Every other element keeps
// jsdom's 0x0 box.
// - Step cards: 720x254, stacked 300px apart in DOM order.
// - The drag preview: 252x156, at the top-left of its DragOverlay wrapper,
//   which dnd-kit positions with inline top/left at the grabbed card.
//   dnd-kit measures the overlay's first child (the preview) and computes
//   every collision from it, so without this all drags start at 0,0.
const rect = (left: number, top: number, width: number, height: number) =>
  ({ x: left, y: top, left, top, width, height, right: left + width, bottom: top + height, toJSON() {} }) as DOMRect;

const realGetBoundingClientRect = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function () {
  if (this.hasAttribute('data-step-id')) {
    const index = [...document.querySelectorAll('[data-step-id]')].indexOf(this);
    return rect(240, 100 + index * 300, 720, 254);
  }
  if (this.hasAttribute('data-drag-preview')) {
    const wrapper = (this.parentElement as HTMLElement).style;
    return rect(parseFloat(wrapper.left), parseFloat(wrapper.top), 252, 156);
  }
  return realGetBoundingClientRect.call(this);
};
