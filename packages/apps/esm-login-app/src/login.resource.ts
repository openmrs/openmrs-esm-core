import { useMemo } from 'react';
import useSwrImmutable from 'swr/immutable';
import type { FetchResponse, Session } from '@openmrs/esm-framework';
import { openmrsFetch, refetchCurrentUser } from '@openmrs/esm-framework';
import type { LocationResponse } from './types';

export async function performLogin(username: string, password: string): Promise<{ data: Session }> {
  const abortController = new AbortController();
  const token = window.btoa(`${username}:${password}`);
  const url = `/ws/rest/v1/session`;

  return openmrsFetch(url, {
    headers: {
      Authorization: `Basic ${token}`,
    },
    signal: abortController.signal,
  }).then((res) => {
    refetchCurrentUser();
    return res;
  });
}

export function useValidateLocationUuid(userPreferredLocationUuid: string) {
  const url = userPreferredLocationUuid ? `/ws/fhir2/R4/Location?_id=${userPreferredLocationUuid}` : null;
  const { data, error, isLoading } = useSwrImmutable<FetchResponse<LocationResponse>>(url, openmrsFetch, {
    shouldRetryOnError(err) {
      if (err?.response?.status) {
        return err.response.status >= 500;
      }
      return false;
    },
  });
  const results = useMemo(
    () => ({
      isLocationValid: data?.ok && data?.data?.total > 0,
      defaultLocation: data?.data?.entry ?? [],
      error,
      isLoading,
    }),
    [data, isLoading, error],
  );
  return results;
}
