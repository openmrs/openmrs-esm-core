import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import type {} from '@openmrs/esm-framework';

vi.mock('@openmrs/esm-framework', () => import('@openmrs/esm-framework/mock'));

(window.importMapOverrides as any) = {
  getOverrideMap: vi.fn().mockReturnValue({ imports: {} }),
};

afterEach(cleanup);
