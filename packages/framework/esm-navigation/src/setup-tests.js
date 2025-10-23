/* eslint-env node */
import { vi } from 'vitest';

global.window.openmrsBase = '/openmrs';
global.window.spaBase = '/spa';
global.window.getOpenmrsSpaBase = () => '/openmrs/spa/';

// Suppress store override warnings from test mock system
// These occur when stores are recreated across test files and are harmless
const originalError = console.error;
vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
  if (typeof message === 'string' && message.includes('Attempted to override the existing store')) {
    return;
  }
  originalError.call(console, message, ...args);
});
