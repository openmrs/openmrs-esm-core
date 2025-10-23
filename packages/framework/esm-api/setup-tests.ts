import { vi } from 'vitest';

vi.mock('@openmrs/esm-config', () => import('@openmrs/esm-config/mock'));

vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
  if (typeof message === 'string' && message.includes('Attempted to override the existing store')) {
    return;
  }
  console.warn(message, ...args);
});
