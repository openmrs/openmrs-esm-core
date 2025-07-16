/** @module @category API */
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { fetchCurrentPatient } from '@openmrs/esm-emr-api';

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
  const [currentPatientUuid, setCurrentPatientUuid] = useState(patientUuid ?? getPatientUuidFromUrl());

  const {
    data: patient,
    error,
    isValidating,
  } = useSWR<NullablePatient, Error | null>(currentPatientUuid ? ['patient', currentPatientUuid] : null, () =>
    fetchCurrentPatient(currentPatientUuid!, {}),
  );

  useEffect(() => {
    const handleRouteUpdate = () => {
      const newPatientUuid = getPatientUuidFromUrl();
      if (newPatientUuid !== currentPatientUuid) {
        setCurrentPatientUuid(newPatientUuid);
      }
    };

    window.addEventListener('single-spa:routing-event', handleRouteUpdate);
    return () => window.removeEventListener('single-spa:routing-event', handleRouteUpdate);
  }, [currentPatientUuid]);

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
