/** @module @category API */
import { Observable, BehaviorSubject } from "rxjs";
import { take, map } from "rxjs/operators";
import { openmrsObservableFetch } from "../openmrs-fetch";
import {
  FetchResponse,
  NewVisitPayload,
  UpdateVisitPayload,
  Visit,
} from "../types";
import { getGlobalStore } from "@openmrs/esm-state";

export const defaultVisitCustomRepresentation =
  "custom:(uuid,encounters:(uuid,encounterDatetime," +
  "form:(uuid,name),location:ref," +
  "encounterType:ref,encounterProviders:(uuid,display," +
  "provider:(uuid,display))),patient:(uuid,uuid)," +
  "visitType:(uuid,name,display)," +
  "attributes:(uuid,display,attributeType:(name,datatypeClassname,uuid),value)," +
  "location:(uuid,name,display),startDatetime,stopDatetime)";

export interface VisitStoreState {
  patientUuid: string | null;
  manuallySetVisitUuid: string | null;
}

const initialState = getVisitLocalStorage() || {
  patientUuid: null,
  manuallySetVisitUuid: null,
};
export function getVisitStore() {
  return getGlobalStore<VisitStoreState>("visit", initialState);
}

export function setCurrentVisit(patientUuid: string, visitUuid: string) {
  getVisitStore().setState({ patientUuid, manuallySetVisitUuid: visitUuid });
}

getVisitStore().subscribe((state) => {
  setVisitLocalStorage(state);
});

function setVisitLocalStorage(value: VisitStoreState) {
  localStorage.setItem("openmrs:visitStoreState", JSON.stringify(value));
}

function getVisitLocalStorage(): VisitStoreState | null {
  try {
    return JSON.parse(
      localStorage.getItem("openmrs:visitStoreState") || "null"
    );
  } catch (e) {
    return null;
  }
}

export function getVisitsForPatient(
  patientUuid: string,
  abortController: AbortController,
  v?: string
): Observable<FetchResponse<{ results: Array<Visit> }>> {
  const custom = v ?? defaultVisitCustomRepresentation;

  return openmrsObservableFetch(
    `/ws/rest/v1/visit?patient=${patientUuid}&v=${custom}`,
    {
      signal: abortController.signal,
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  )
    .pipe(take(1))
    .pipe(
      map((response: FetchResponse<{ results: Array<Visit> }>) => {
        return response;
      })
    );
}

export function saveVisit(
  payload: NewVisitPayload,
  abortController: AbortController
): Observable<FetchResponse<any>> {
  return openmrsObservableFetch(`/ws/rest/v1/visit`, {
    signal: abortController.signal,
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: payload,
  });
}

export function updateVisit(
  uuid: string,
  payload: UpdateVisitPayload,
  abortController: AbortController
): Observable<any> {
  return openmrsObservableFetch(`/ws/rest/v1/visit/${uuid}`, {
    signal: abortController.signal,
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: payload,
  });
}

/** @deprecated */
export const getStartedVisit = new BehaviorSubject<VisitItem | null>(null);

export interface VisitItem {
  mode: VisitMode;
  visitData?: Visit;
  status: VisitStatus;
  anythingElse?: any;
}

export enum VisitMode {
  NEWVISIT = "startVisit",
  EDITVISIT = "editVisit",
  LOADING = "loadingVisit",
}

export enum VisitStatus {
  NOTSTARTED = "notStarted",
  ONGOING = "ongoing",
}
