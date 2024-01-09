import { jest } from '@jest/globals'
import '@testing-library/jest-dom';

global.window.openmrsBase = '/openmrs';
global.window.spaBase = '/spa';
global.window.getOpenmrsSpaBase = () => '/openmrs/spa/';

jest.mock('@openmrs/esm-config', () => ({
  // Exporting everything in config except the re-export of the navigation functions
  // that exist in `esm-config/src/index.ts` for backward compatibility. When those
  // are removed, this mock too can be removed.
  ...jest.requireActual('@openmrs/esm-config/src/module-config/module-config'),
  ...jest.requireActual('@openmrs/esm-config/src/module-config/state'),
  ...jest.requireActual('@openmrs/esm-config/src/validators/validator'),
  ...jest.requireActual('@openmrs/esm-config/src/validators/validators'),
}));

jest.mock('@openmrs/esm-navigation', () => ({
  ...jest.requireActual('@openmrs/esm-navigation'),
  navigate: jest.fn(),
}));
