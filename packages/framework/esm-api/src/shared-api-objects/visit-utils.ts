import { openmrsFetch } from "../openmrs-fetch";
import { NewVisitPayload, UpdateVisitPayload, Visit } from "../types";

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

interface OpenmrsVisitResponse {
  results: Array<Visit>;
}

const defaultView = [
  "custom:(uuid,encounters:(uuid,encounterDatetime,",
  "form:(uuid,name),location:ref,",
  "encounterType:ref,encounterProviders:(uuid,display,",
  "provider:(uuid,display))),patient:(uuid,uuid),",
  "visitType:(uuid,name,display),attributes:(uuid,display,value),location:(uuid,name,display),startDatetime,",
  "stopDatetime)",
].join("");

export function getVisitsForPatient(
  patientUuid: string,
  abort = new AbortController(),
  v = defaultView
) {
  return openmrsFetch<OpenmrsVisitResponse>(
    `/ws/rest/v1/visit?patient=${patientUuid}&v=${v}`,
    {
      signal: abort.signal,
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  ).then((r) => r.data);
}

export function saveVisit(
  payload: NewVisitPayload,
  abort = new AbortController()
) {
  return openmrsFetch(`/ws/rest/v1/visit`, {
    signal: abort.signal,
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: payload,
  }).then(() => {});
}

export function updateVisit(
  visitUuid: string,
  payload: UpdateVisitPayload,
  abort = new AbortController()
) {
  return openmrsFetch(`/ws/rest/v1/visit/${visitUuid}`, {
    signal: abort.signal,
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: payload,
  }).then(() => {});
}
