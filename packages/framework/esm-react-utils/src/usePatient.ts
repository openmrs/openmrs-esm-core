/** @module @category API */
import { useMemo } from 'react';
import { useCurrentPatient } from '@openmrs/esm-api';

export type NullablePatient = fhir.Patient | null;

function getPatientUuidFromUrl() {
  const match = /\/patient\/([a-zA-Z0-9\-]+)\/?/.exec(location.pathname);
  return match && match[1];
}

/**
 * This React hook returns a patient object. If the `patientUuid` is provided
 * as a parameter, then the patient for that UUID is returned. If the parameter
 * is not provided, the patient UUID is obtained from the current route, and
 * a route listener is set up to update the patient whenever the route changes.
 */
export function usePatient(patientUuid?: string) {
  const patientUuidFromUrl = getPatientUuidFromUrl();
  const currentPatientUuid = patientUuid ?? patientUuidFromUrl;
  const { data: patient, error, isValidating } = useCurrentPatient(currentPatientUuid ?? null, {});

  return useMemo(
    () => ({
      isLoading: isValidating && !error && !patient,
      patient,
      patientUuid: currentPatientUuid,
      error,
    }),
    [isValidating, error, patient, currentPatientUuid],
  );
}
