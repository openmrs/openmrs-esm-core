import { restBaseUrl } from '@openmrs/esm-api';
import { useOpenmrsFetchAll } from '@openmrs/esm-react-utils';
import { type Encounter } from '@openmrs/esm-emr-api';

interface UseEncountersByVisitResult {
  encounters: Array<Encounter> | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

export function useEncountersByVisit(patientUuid: string, visitUuid: string): UseEncountersByVisitResult {
  const customRepresentation =
    'custom:(uuid,encounterType:(uuid,display),encounterProviders:(provider:(person:(display))),encounterDatetime,visit:(uuid))';
  const url = `${restBaseUrl}/encounter?patient=${patientUuid}&order=desc&visit=${visitUuid}&v=${customRepresentation}`;
  const { data: encounters, isLoading, error } = useOpenmrsFetchAll<Encounter>(url);

  return { encounters, isLoading, error };
}
