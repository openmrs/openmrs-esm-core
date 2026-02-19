// Storybook-compatible mock for @openmrs/esm-api.
import { of } from 'rxjs';

export function openmrsFetch(_url?: string) {
  return new Promise(() => {});
}

export function openmrsObservableFetch() {
  return of({ data: { entry: [] } });
}

export function getCurrentUser() {
  return of({ authenticated: false });
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
