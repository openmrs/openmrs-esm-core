/** @module @category API */
import { fhirBaseUrl, openmrsFetch, type FetchConfig, type FetchResponse } from '@openmrs/esm-api';
import { getSynchronizationItems } from '@openmrs/esm-offline';

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
 * Fetches a patient by their UUID from the FHIR API. This function first attempts
 * to fetch the patient from the server. If the server request fails and offline
 * patients are included, it will check for a matching patient in the offline
 * patient registration sync queue.
 *
 * @param patientUuid The UUID of the patient to fetch, or `null`.
 * @param fetchInit Optional fetch configuration options to pass to the request.
 * @param includeOfflinePatients Whether to include patients from the offline
 *   registration queue if the server request fails. Defaults to `true`.
 * @returns A Promise that resolves with the FHIR Patient object, or `null` if
 *   the patient UUID is null or the patient is not found.
 * @throws Rethrows any error from the server request if no offline patient is found.
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
  includeOfflinePatients: boolean = true,
): Promise<fhir.Patient | null> {
  if (patientUuid) {
    let err: Error | null = null;
    const [onlinePatient, offlinePatient] = await Promise.all([
      openmrsFetch<fhir.Patient>(`${fhirBaseUrl}/Patient/${patientUuid}`, fetchInit).catch<FetchResponse<fhir.Patient>>(
        (e) => (err = e),
      ),
      includeOfflinePatients ? getOfflineRegisteredPatientAsFhirPatient(patientUuid) : Promise.resolve(null),
    ]);

    if (onlinePatient.ok) {
      return onlinePatient.data;
    }

    if (offlinePatient) {
      return offlinePatient;
    }

    if (err) {
      throw err;
    }
  }

  return null;
}

async function getOfflineRegisteredPatientAsFhirPatient(patientUuid: string): Promise<fhir.Patient | null> {
  const patientRegistrationSyncItems = await getSynchronizationItems<{
    fhirPatient: fhir.Patient;
  }>('patient-registration');
  const patientSyncItem = patientRegistrationSyncItems.find((item) => item.fhirPatient.id === patientUuid);

  return patientSyncItem?.fhirPatient ?? null;
}
