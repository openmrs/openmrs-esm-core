/** @module @category API */
import useSWR from 'swr';
import { getSynchronizationItems } from '@openmrs/esm-offline';
import { fhirBaseUrl, openmrsFetch, type FetchConfig } from '../openmrs-fetch';
import { type FetchResponse } from '../types';

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

export function useCurrentPatient(patientUuid: string | null, fetchInit?: FetchConfig) {
  return useSWR(patientUuid ? ['patient', patientUuid] : null, () => fetchPatientData(patientUuid!, fetchInit));
}

export async function fetchPatientData(patientUuid: string, fetchInit?: FetchConfig): Promise<fhir.Patient | null> {
  try {
    const onlinePatient = await openmrsFetch<fhir.Patient>(`${fhirBaseUrl}/Patient/${patientUuid}`, fetchInit);
    if (onlinePatient.ok) {
      return onlinePatient.data;
    }
  } catch (err) {
    // If online fetch fails, try offline
    console.error('Failed to fetch patient online:', err);
  }

  return getOfflineRegisteredPatientAsFhirPatient(patientUuid);
}

async function getOfflineRegisteredPatientAsFhirPatient(patientUuid: string): Promise<fhir.Patient | null> {
  const patientRegistrationSyncItems = await getSynchronizationItems<{
    fhirPatient: fhir.Patient;
  }>('patient-registration');
  const patientSyncItem = patientRegistrationSyncItems.find((item) => item.fhirPatient.id === patientUuid);

  return patientSyncItem?.fhirPatient ?? null;
}
