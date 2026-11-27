// Storybook-compatible mock for @openmrs/esm-api.
import humanPhotoUrl from '../public/human.jpg';
import { openmrsFetchAll as realOpenmrsFetchAll } from '../../../framework/esm-api/src/openmrs-fetch-all';
import { type openmrsFetch as Fetcher } from '../../../framework/esm-api/src/openmrs-fetch';

// Recognises specific URL patterns and returns canned responses so that
// components backed by SWR hooks render realistic data in stories.
export function openmrsFetch(url?: string) {
  if (url?.includes('patient=patient-with-photo')) {
    return Promise.resolve({
      data: {
        results: [
          {
            obsDatetime: '2024-01-15T10:30:00.000+0000',
            value: { links: { uri: humanPhotoUrl } },
          },
        ],
      },
    });
  }
  return Promise.resolve({ data: { results: [] } });
}

export function openmrsFetchAll(url: string, fetcher = openmrsFetch as typeof Fetcher) {
  return realOpenmrsFetchAll(url, fetcher);
}

export function getCurrentUser() {
  return Promise.resolve({ authenticated: false });
}

export function getSessionStore() {
  return null;
}

export const restBaseUrl = '/ws/rest/v1';
export const fhirBaseUrl = '/ws/fhir2/R4';

export function setSessionLocation() {
  return Promise.resolve();
}

export function clearCurrentUser() {}
export function refetchCurrentUser() {}
export function setUserLanguage() {}
export function setUserProperties() {}
export function userHasAccess() {
  return true;
}
