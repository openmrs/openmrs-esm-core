import { ReplaySubject, Observable } from "rxjs";
import { fhir } from "../fhir";
import { mergeAll, filter, map } from "rxjs/operators";
import { FetchResponse } from "../types";

export type CurrentPatient = fhir.Patient | FetchResponse<fhir.Patient>;

export interface CurrentPatientOptions {
  includeConfig?: boolean;
}

export interface PatientWithFullResponse extends CurrentPatientOptions {
  includeConfig: true;
}

export interface OnlyThePatient extends CurrentPatientOptions {
  includeConfig: false;
}

export type PatientUuid = string | null;

const currentPatientSubject = new ReplaySubject<
  Promise<{ data: fhir.Patient }>
>(1);

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
export function fetchCurrentPatient(patientUuid: PatientUuid) {
  if (patientUuid) {
    currentPatientSubject.next(
      fhir.read<fhir.Patient>({ type: "Patient", patient: patientUuid })
    );
  }
}

/**
 * @deprecated Remove soon.
 */
const currentPatientUuidSubject = new ReplaySubject<PatientUuid>(1);

/**
 * @category API Object
 * @deprecated Remove soon.
 */
export function refetchCurrentPatient() {
  // nothing would happen here
}

/**
 * @category API Object
 * @deprecated Remove soon.
 */
export function getCurrentPatientUuid(): Observable<PatientUuid> {
  return currentPatientUuidSubject.asObservable();
}
