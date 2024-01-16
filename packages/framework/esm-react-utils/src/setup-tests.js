import { jest } from '@jest/globals'
import '@testing-library/jest-dom';

global.window.openmrsBase = '/openmrs';
global.window.spaBase = '/spa';
global.window.getOpenmrsSpaBase = () => '/openmrs/spa/';

jest.mock('@openmrs/esm-navigation', () => ({
  ...jest.requireActual('@openmrs/esm-navigation'),
  navigate: jest.fn(),
}));
