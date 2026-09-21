/** @module @category API */
import { fhirBaseUrl, openmrsFetch, type FetchConfig, type FetchResponse } from '@openmrs/esm-api';

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
 * Fetches a patient by their UUID from the FHIR API.
 *
 * @param patientUuid The UUID of the patient to fetch, or `null`.
 * @param fetchInit Optional fetch configuration options to pass to the request.
 * @returns A Promise that resolves with the FHIR Patient object, or `null` if
 *   the patient UUID is null.
 * @throws Rethrows any error from the server request.
 *
 * @example
 * ```ts
 * import { fetchCurrentPatient } from '@openmrs/esm-framework';
 * const patient = await fetchCurrentPatient('patient-uuid');
 * if (patient) {
 *   console.log('Patient name:', patient.name?.[0]?.text);
 * }
 * ```
 */
export async function fetchCurrentPatient(
  patientUuid: PatientUuid,
  fetchInit?: FetchConfig,
): Promise<fhir.Patient | null> {
  if (patientUuid) {
    const response = await openmrsFetch<fhir.Patient>(`${fhirBaseUrl}/Patient/${patientUuid}`, fetchInit);
    return response.data;
  }

  return null;
}
