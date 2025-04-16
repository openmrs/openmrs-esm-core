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

export function getVisitStore() {
  return getGlobalStore<VisitStoreState>('visit', initialState);
}

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
