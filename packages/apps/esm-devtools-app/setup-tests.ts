import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

(window as any).importMapOverrides = {
  getOverrideMap: vi.fn().mockReturnValue({ imports: {} }),
};

afterEach(cleanup);
