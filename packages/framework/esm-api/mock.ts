import { of } from 'rxjs';
import { type SessionStore } from '@openmrs/esm-api';
import { createGlobalStore } from '@openmrs/esm-state/mock';

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
export const setCurrentVisit = jest.fn();
export const newWorkspaceItem = jest.fn();
export const restBaseUrl = '/ws/rest/v1';
export const fhirBaseUrl = '/ws/fhir2/R4';
export const attachmentUrl = '/ws/rest/v1/attachment';
export const getAttachmentByUuid = jest.fn();
export const getAttachments = jest.fn();
export const createAttachment = jest.fn();
export const deleteAttachmentPermanently = jest.fn();
export const clearCurrentUser = jest.fn();
export const refetchCurrentUser = jest.fn();
export const setUserLanguage = jest.fn();
export const setUserProperties = jest.fn();
export const updateVisit = jest.fn();
export const saveVisit = jest.fn();
export const getVisitsForPatient = jest.fn();
export const getStartedVisit = jest.fn();
export const userHasAccess = jest.fn();
