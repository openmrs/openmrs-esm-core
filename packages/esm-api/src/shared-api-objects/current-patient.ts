import { ReplaySubject, Observable, Subscribable, Subscription } from "rxjs";
import { fhir } from "../fhir";
import { mergeAll, filter, map } from "rxjs/operators";
import { FetchResponse } from "../types";

let currentPatientUuid: string | null;
const currentPatientUuidSubject = new ReplaySubject<PatientUuid>(1);
const currentPatientSubject = new ReplaySubject<
  Promise<{ data: fhir.Patient }>
>(1);

// single-spa:before-routing-event happens *after* the URL is changed but
// *before* the corresponding routing events (`popstate` etc) occur.
window.addEventListener("single-spa:before-routing-event", () => {
  const u = getPatientUuidFromUrl();

  currentPatientUuid = u;
  currentPatientUuidSubject.next(u);

  if (currentPatientUuid) {
    currentPatientSubject.next(
      fhir.read<fhir.Patient>({
        type: "Patient",
        patient: currentPatientUuid,
      })
    );
  }
});

function getPatientUuidFromUrl() {
  const match = /\/patient\/([a-zA-Z0-9\-]+)\/?/.exec(location.pathname);
  return match && match[1];
}

/**
 * @category API Object
 */
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

/**
 * @category API Object
 */
export function refetchCurrentPatient() {
  if (currentPatientUuid) {
    currentPatientSubject.next(
      fhir.read<fhir.Patient>({ type: "Patient", patient: currentPatientUuid })
    );
  }
}

/**
 * @category API Object
 */
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
