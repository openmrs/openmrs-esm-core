import { afterEach } from 'vitest';
import type {} from '@openmrs/esm-globals';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

afterEach(cleanup);
