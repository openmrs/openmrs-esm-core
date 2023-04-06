/** @module @category API */
import { getSynchronizationItems } from "@openmrs/esm-offline";
import { FetchConfig, fhirBaseUrl, openmrsFetch } from "../openmrs-fetch";
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

export async function fetchCurrentPatient(
  patientUuid: PatientUuid,
  fetchInit?: FetchConfig,
  includeOfflinePatients: boolean = true
): Promise<fhir.Patient | null> {
  if (patientUuid) {
    let err: Error | null = null;
    const [onlinePatient, offlinePatient] = await Promise.all([
      openmrsFetch<fhir.Patient>(
        `${fhirBaseUrl}/Patient/${patientUuid}`,
        fetchInit
      ).catch<FetchResponse<fhir.Patient>>((e) => (err = e)),
      includeOfflinePatients
        ? getOfflineRegisteredPatientAsFhirPatient(patientUuid)
        : Promise.resolve(null),
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

async function getOfflineRegisteredPatientAsFhirPatient(
  patientUuid: string
): Promise<fhir.Patient | null> {
  const patientRegistrationSyncItems = await getSynchronizationItems<{
    fhirPatient: fhir.Patient;
  }>("patient-registration");
  const patientSyncItem = patientRegistrationSyncItems.find(
    (item) => item.fhirPatient.id === patientUuid
  );

  return patientSyncItem?.fhirPatient ?? null;
}
