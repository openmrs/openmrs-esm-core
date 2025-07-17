import { afterEach, vi } from 'vitest';
import type {} from '@openmrs/esm-globals';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

vi.mock('@openmrs/esm-dynamic-loading', () => import('@openmrs/esm-dynamic-loading/mock'));

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

afterEach(cleanup);
