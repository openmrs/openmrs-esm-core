/** @module @category API */
import { BehaviorSubject } from 'rxjs';
import { openmrsFetch, restBaseUrl } from '../openmrs-fetch';
import type { FetchResponse, NewVisitPayload, UpdateVisitPayload, Visit } from '../types';
import { getGlobalStore } from '@openmrs/esm-state';

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

export interface VisitStoreState {
  patientUuid: string | null;
  manuallySetVisitUuid: string | null;
}

const initialState = getVisitLocalStorage() || {
  patientUuid: null,
  manuallySetVisitUuid: null,
};

export function getVisitStore() {
  return getGlobalStore<VisitStoreState>('visit', initialState);
}

export function setCurrentVisit(patientUuid: string, visitUuid: string) {
  getVisitStore().setState({ patientUuid, manuallySetVisitUuid: visitUuid });
}

getVisitStore().subscribe((state) => {
  setVisitLocalStorage(state);
});

function setVisitLocalStorage(value: VisitStoreState) {
  localStorage.setItem('openmrs:visitStoreState', JSON.stringify(value));
}

function getVisitLocalStorage(): VisitStoreState | null {
  try {
    return JSON.parse(localStorage.getItem('openmrs:visitStoreState') || 'null');
  } catch (e) {
    return null;
  }
}

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

export function updateVisit(uuid: string, payload: UpdateVisitPayload, abortController: AbortController) {
  return openmrsFetch(`${restBaseUrl}/visit/${uuid}`, {
    signal: abortController.signal,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: payload,
  });
}

/** @deprecated */
export const getStartedVisit = new BehaviorSubject<VisitItem | null>(null);
