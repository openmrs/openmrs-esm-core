import { ReplaySubject, Observable } from "rxjs";
import { fhir } from "../fhir";
import { mergeAll, filter, map } from "rxjs/operators";
import { FetchResponse } from "../types";
import { openmrsFetch } from "../openmrs-fetch";
import { getConfig } from "@openmrs/esm-config";

let currentPatientUuid: string;
const currentPatientUuidSubject = new ReplaySubject<PatientUuid>(1);
const currentPatientSubject = new ReplaySubject<
  Promise<{ data: fhir.Patient }>
>(1);

window.addEventListener("single-spa:routing-event", () => {
  const u = getPatientUuidFromUrl();

  if (u && u !== currentPatientUuid) {
    currentPatientUuid = u;
    currentPatientUuidSubject.next(u);

    if (u) {
      currentPatientSubject.next(
        fhir.read<fhir.Patient>({
          type: "Patient",
          patient: currentPatientUuid,
        })
      );
    }
  }
});

function getPatientUuidFromUrl() {
  const match = /\/patient\/([a-zA-Z0-9\-]+)\/?/.exec(location.pathname);
  return match && match[1];
}

export async function fetchPatientPhotoUrl(
  patientUuid: string,
  abortController: AbortController
): Promise<PhotoUrl> {
  const { concepts } = await getConfig("@openmrs/esm-patient-registration-app");
  if (concepts && concepts.patientPhotoUuid) {
    const { data } = await openmrsFetch(
      `/ws/rest/v1/obs?patient=${patientUuid}&concept=${concepts.patientPhotoUuid}&v=full`,
      {
        method: "GET",
        signal: abortController.signal,
      }
    );
    if (data.results.length) {
      return data.results[0].value.links.uri;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getCurrentPatient(): Observable<fhir.Patient>;
function getCurrentPatient(
  opts: PatientWithFullResponse
): Observable<FetchResponse<fhir.Patient>>;
function getCurrentPatient(opts: OnlyThePatient): Observable<fhir.Patient>;
function getCurrentPatient(
  opts: CurrentPatientOptions = { includeConfig: false }
): Observable<CurrentPatient> {
  const result = currentPatientSubject.asObservable().pipe(
    mergeAll(),
    map((r) => (opts.includeConfig ? r : r.data)),
    filter(Boolean)
  );
  return result as Observable<CurrentPatient>;
}

export { getCurrentPatient };

export function refetchCurrentPatient() {
  currentPatientSubject.next(
    fhir.read<fhir.Patient>({ type: "Patient", patient: currentPatientUuid })
  );
}

export function getCurrentPatientUuid(): Observable<PatientUuid> {
  return currentPatientUuidSubject.asObservable();
}

export type CurrentPatient = fhir.Patient | FetchResponse<fhir.Patient>;

interface CurrentPatientOptions {
  includeConfig?: boolean;
}
interface PatientWithFullResponse extends CurrentPatientOptions {
  includeConfig: true;
}
interface OnlyThePatient extends CurrentPatientOptions {
  includeConfig: false;
}

export type PatientUuid = string | null;
export type PhotoUrl = string | null;
