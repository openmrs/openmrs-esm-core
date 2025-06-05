import { afterEach, vi } from 'vitest';
import type {} from '@openmrs/esm-globals';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

global.window.openmrsBase = '/openmrs';
global.window.spaBase = '/spa';
global.window.getOpenmrsSpaBase = () => '/openmrs/spa/';

vi.mock('@openmrs/esm-navigation', async () => {
  const actual = await vi.importActual('@openmrs/esm-navigation');

  return {
    ...actual,
    navigate: vi.fn(),
  };
});

afterEach(cleanup);
