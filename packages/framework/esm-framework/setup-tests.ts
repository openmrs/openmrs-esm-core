import { afterEach } from 'vitest';
import type {} from '@openmrs/esm-globals';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

// Configure React's act() environment for Vitest
// See: https://github.com/testing-library/react-testing-library/issues/1061
// Store the actual value in a variable to avoid infinite recursion
let actEnvironment = true;

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  get() {
    return actEnvironment;
  },
  set(value) {
    actEnvironment = value;
    if (typeof window !== 'undefined' && globalThis !== window) {
      window.IS_REACT_ACT_ENVIRONMENT = value;
    }
  },
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

afterEach(() => {
  cleanup();
});

vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
  if (typeof message === 'string' && message.includes('Attempted to override the existing store')) {
    return;
  }
  console.warn(message, ...args);
});
