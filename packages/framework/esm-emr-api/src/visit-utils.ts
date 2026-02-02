/** @module @category API */
import { openmrsFetch, restBaseUrl, type FetchResponse } from '@openmrs/esm-api';
import { getGlobalStore } from '@openmrs/esm-state';
import { BehaviorSubject } from 'rxjs';
import { type NewVisitPayload, type UpdateVisitPayload, type Visit } from './types';

export interface VisitItem {
  mode: VisitMode;
  visitData?: Visit;
  status: VisitStatus;
  anythingElse?: any;
}

export enum VisitMode {
  NEWVISIT = 'startVisit',
  EDITVISIT = 'editVisit',
  LOADING = 'loadingVisit',
}

export enum VisitStatus {
  NOTSTARTED = 'notStarted',
  ONGOING = 'ongoing',
}

export interface VisitStoreState {
  patientUuid: string | null;
  manuallySetVisitUuid: string | null;

  /**
   * Stores a record of SWR mutate callbacks that should be called when
   * the Visit with the specified uuid is modified. The callbacks are keyed
   * by unique component IDs.
   */
  mutateVisitCallbacks: {
    [componentId: string]: () => void;
  };
}

/**
 * The default custom representation string for fetching visit data from the REST API.
 * This representation includes comprehensive visit details such as encounters, patient,
 * visit type, attributes, and location information.
 */
export const defaultVisitCustomRepresentation =
  'custom:(uuid,display,voided,indication,startDatetime,stopDatetime,' +
  'encounters:(uuid,display,encounterDatetime,' +
  'form:(uuid,name),location:ref,' +
  'encounterType:ref,' +
  'encounterProviders:(uuid,display,' +
  'provider:(uuid,display))),' +
  'patient:(uuid,display),' +
  'visitType:(uuid,name,display),' +
  'attributes:(uuid,display,attributeType:(name,datatypeClassname,uuid),value),' +
  'location:(uuid,name,display))';

const initialState: VisitStoreState = getVisitSessionStorage() || {
  patientUuid: null,
  manuallySetVisitUuid: null,
  mutateVisitCallbacks: {},
};

/**
 * Returns the global visit store that manages the current visit state. The store
 * contains information about the current patient's visit and provides methods
 * for subscribing to visit state changes.
 *
 * @returns The global visit store instance.
 *
 * @example
 * ```ts
 * import { getVisitStore } from '@openmrs/esm-framework';
 * const store = getVisitStore();
 * const unsubscribe = store.subscribe((state) => {
 *   console.log('Current patient:', state.patientUuid);
 * });
 * ```
 */
export function getVisitStore() {
  return getGlobalStore<VisitStoreState>('visit', initialState);
}

/**
 * Sets the current visit for a patient in the global visit store. This is used
 * to manually specify which visit should be considered "active" for the given patient.
 *
 * @param patientUuid The UUID of the patient.
 * @param visitUuid The UUID of the visit to set as the current visit.
 *
 * @example
 * ```ts
 * import { setCurrentVisit } from '@openmrs/esm-framework';
 * setCurrentVisit('patient-uuid', 'visit-uuid');
 * ```
 */
export function setCurrentVisit(patientUuid: string, visitUuid: string) {
  getVisitStore().setState({ patientUuid, manuallySetVisitUuid: visitUuid });
}

getVisitStore().subscribe((state) => {
  setVisitSessionStorage(state);
});

function setVisitSessionStorage(value: VisitStoreState) {
  sessionStorage.setItem('openmrs:visitStoreState', JSON.stringify(value));
}

function getVisitSessionStorage(): VisitStoreState | null {
  try {
    return JSON.parse(sessionStorage.getItem('openmrs:visitStoreState') || 'null');
  } catch (e) {
    return null;
  }
}

/**
 * Creates a new visit by sending a POST request to the OpenMRS REST API.
 *
 * @param payload The visit data to create, including patient UUID, visit type,
 *   start datetime, and other visit attributes.
 * @param abortController An AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the FetchResponse containing the created Visit.
 *
 * @example
 * ```ts
 * import { saveVisit } from '@openmrs/esm-framework';
 * const abortController = new AbortController();
 * const response = await saveVisit({
 *   patient: 'patient-uuid',
 *   visitType: 'visit-type-uuid',
 *   startDatetime: new Date().toISOString()
 * }, abortController);
 * ```
 */
export function saveVisit(payload: NewVisitPayload, abortController: AbortController): Promise<FetchResponse<Visit>> {
  return openmrsFetch(`${restBaseUrl}/visit`, {
    signal: abortController.signal,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: payload,
  });
}

/**
 * Updates an existing visit by sending a POST request to the OpenMRS REST API.
 *
 * @param uuid The UUID of the visit to update.
 * @param payload The visit data to update, such as stop datetime or attributes.
 * @param abortController An AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the FetchResponse containing the updated Visit.
 *
 * @example
 * ```ts
 * import { updateVisit } from '@openmrs/esm-framework';
 * const abortController = new AbortController();
 * const response = await updateVisit('visit-uuid', {
 *   stopDatetime: new Date().toISOString()
 * }, abortController);
 * ```
 */
export function updateVisit(
  uuid: string,
  payload: UpdateVisitPayload,
  abortController: AbortController,
): Promise<FetchResponse<Visit>> {
  return openmrsFetch(`${restBaseUrl}/visit/${uuid}`, {
    signal: abortController.signal,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: payload,
  });
}

/**
 * @deprecated Use the `useVisit` hook instead.
 */
export function getVisitsForPatient(
  patientUuid: string,
  abortController: AbortController,
  v?: string,
): Promise<FetchResponse<{ results: Array<Visit> }>> {
  const custom = v ?? defaultVisitCustomRepresentation;

  return openmrsFetch(`${restBaseUrl}/visit?patient=${patientUuid}&v=${custom}`, {
    signal: abortController.signal,
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });
}

/** @deprecated */
export const getStartedVisit = new BehaviorSubject<VisitItem | null>(null);
