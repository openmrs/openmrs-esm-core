import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { getFhirServerPaginationHandlers } from './useFhirPagination';

beforeEach(() => {
  vi.stubGlobal('location', new URL('https://frontend.example/openmrs/spa/'));
});

afterEach(() => vi.unstubAllGlobals());

it('moves a FHIR next link from a backend port onto the page origin', () => {
  const bundle = {
    resourceType: 'Bundle',
    link: [
      { relation: 'next', url: 'http://backend.example:8080/openmrs/ws/fhir2/R4?_getpages=abc&_getpagesoffset=1' },
    ],
  } as fhir.Bundle;

  expect(getFhirServerPaginationHandlers().getNextUrl(bundle)).toBe(
    'https://frontend.example/openmrs/ws/fhir2/R4?_getpages=abc&_getpagesoffset=1',
  );
});
