import { fhir } from "../fhir";
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

/**
 * @category API Object
 */
export function fetchCurrentPatient(
  patientUuid: PatientUuid,
  contentOverrides?: Partial<Parameters<typeof fhir.read>[0]>
) {
  if (patientUuid) {
    return fhir.read<fhir.Patient>({
      type: "Patient",
      patient: patientUuid,
      ...contentOverrides,
    });
  }

  return Promise.resolve(null);
}
