import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

Object.defineProperty(window, 'importMapOverrides', {
  value: Object.freeze({
    getOverrideMap: vi.fn().mockReturnValue({ imports: {} }),
    getDisabledOverrides: vi.fn().mockReturnValue([]),
    getCurrentPageMap: vi.fn().mockResolvedValue({ imports: {} }),
    getDefaultMap: vi.fn().mockResolvedValue({ imports: {} }),
    getNextPageMap: vi.fn().mockResolvedValue({ imports: {} }),
    isDisabled: vi.fn().mockReturnValue(false),
    addOverride: vi.fn(),
    removeOverride: vi.fn(),
    resetOverrides: vi.fn(),
    enableOverride: vi.fn(),
  }),
  writable: false,
  configurable: false,
});

afterEach(cleanup);
