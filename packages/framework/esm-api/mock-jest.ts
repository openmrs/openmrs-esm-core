import { of } from 'rxjs';
import { createGlobalStore } from '@openmrs/esm-state/mock';
import { type SessionStore } from './src/current-user';

export const setSessionLocation = jest.fn(() => Promise.resolve());
export const openmrsFetch = jest.fn((url?: string) => new Promise(() => {}));
export const openmrsObservableFetch = jest.fn(() => of({ data: { entry: [] } }));
export function getCurrentUser() {
  return of({ authenticated: false });
}
export const mockSessionStore = createGlobalStore<SessionStore>('mock-session-store', {
  loaded: false,
  session: null,
});
export const getSessionStore = jest.fn(() => mockSessionStore);
export const restBaseUrl = '/ws/rest/v1';
export const fhirBaseUrl = '/ws/fhir2/R4';
export const clearCurrentUser = jest.fn();
export const refetchCurrentUser = jest.fn();
export const setUserLanguage = jest.fn();
export const setUserProperties = jest.fn();
export const userHasAccess = jest.fn();
