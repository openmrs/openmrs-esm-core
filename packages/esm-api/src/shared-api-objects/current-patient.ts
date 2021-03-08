import { ReplaySubject, Observable } from "rxjs";
import { fhir } from "../fhir";
import { mergeAll, filter, map } from "rxjs/operators";
import { FetchResponse } from "../types";

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
  currentPatientSubject.next(
    fhir.read<fhir.Patient>({ type: "Patient", patient: currentPatientUuid })
  );
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
