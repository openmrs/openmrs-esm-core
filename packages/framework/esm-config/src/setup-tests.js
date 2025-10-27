/* eslint-disable no-undef */
import { vi } from 'vitest';

global.window.System = {
  import: vi.fn().mockRejectedValue(new Error('config.json not available in import map')),
  resolve: vi.fn().mockImplementation(() => {
    throw new Error('config.json not available in import map');
  }),
  register: vi.fn(),
};

global.window.openmrsBase = '/openmrs';
global.window.spaBase = '/spa';
global.window.getOpenmrsSpaBase = () => '/openmrs/spa/';
