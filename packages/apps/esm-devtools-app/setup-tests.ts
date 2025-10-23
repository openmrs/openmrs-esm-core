import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

(window as any).importMapOverrides = {
  getOverrideMap: vi.fn().mockReturnValue({ imports: {} }),
};

afterEach(cleanup);

vi.spyOn(console, 'error').mockImplementation((message, ...args) => {
  if (typeof message === 'string' && message.includes('Attempted to override the existing store')) {
    return;
  }
  console.warn(message, ...args);
});
