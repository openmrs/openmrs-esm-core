import { vi } from 'vitest';
import { of } from 'rxjs';
import { type SessionStore } from '@openmrs/esm-api';
import { createGlobalStore } from '@openmrs/esm-state/mock';

export const setSessionLocation = vi.fn(() => Promise.resolve());
export const openmrsFetch = vi.fn((_url?: string) => new Promise(() => {}));
export const openmrsObservableFetch = vi.fn(() => of({ data: { entry: [] } }));
export function getCurrentUser() {
  return of({ authenticated: false });
}
export const mockSessionStore = createGlobalStore<SessionStore>('mock-session-store', {
  loaded: false,
  session: null,
});
export const getSessionStore = vi.fn(() => mockSessionStore);
export const setCurrentVisit = vi.fn();
export const newWorkspaceItem = vi.fn();
export const restBaseUrl = '/ws/rest/v1';
export const fhirBaseUrl = '/ws/fhir2/R4';
export const attachmentUrl = '/ws/rest/v1/attachment';
export const getAttachmentByUuid = vi.fn();
export const getAttachments = vi.fn();
export const createAttachment = vi.fn();
export const deleteAttachmentPermanently = vi.fn();
export const clearCurrentUser = vi.fn();
export const refetchCurrentUser = vi.fn();
export const setUserLanguage = vi.fn();
export const setUserProperties = vi.fn();
export const updateVisit = vi.fn();
export const saveVisit = vi.fn();
export const getVisitsForPatient = vi.fn();
export const getStartedVisit = vi.fn();
export const userHasAccess = vi.fn();
