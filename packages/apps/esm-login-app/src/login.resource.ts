import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSwrInfinite from 'swr/infinite';
import useSwrImmutable from 'swr/immutable';
import {
  type FetchResponse,
  fhirBaseUrl,
  openmrsFetch,
  useDebounce,
  showNotification,
  useSession,
  useOpenmrsSWR,
} from '@openmrs/esm-framework';
import type { LocationEntry, LocationResponse } from './types';

interface LoginLocationData {
  locations: Array<LocationEntry>;
  isLoading: boolean;
  totalResults: number;
  hasMore: boolean;
  loadingNewData: boolean;
  setPage: (size: number | ((_size: number) => number)) => Promise<FetchResponse<LocationResponse>[]>;
}

function useInfiniteLoginLocations(
  useLoginLocationTag: boolean,
  count: number = 0,
  searchQuery: string = '',
): LoginLocationData {
  const { t } = useTranslation();

  function constructUrl(page: number, prevPageData: FetchResponse<LocationResponse>) {
    if (prevPageData) {
      const nextLink = prevPageData.data?.link?.find((link) => link.relation === 'next');

      if (!nextLink) {
        return null;
      }

      const nextUrl = new URL(nextLink.url);
      // default for production
      if (nextUrl.origin === window.location.origin) {
        return nextLink.url;
      }

      // in development, the request should be funnelled through the local proxy
      return new URL(
        `${nextUrl.pathname}${nextUrl.search ? `?${nextUrl.search}` : ''}`,
        window.location.origin,
      ).toString();
    }

    let url = `${fhirBaseUrl}/Location?`;
    let urlSearchParameters = new URLSearchParams();
    urlSearchParameters.append('_summary', 'data');

    if (count) {
      urlSearchParameters.append('_count', '' + count);
    }

    if (page) {
      urlSearchParameters.append('_getpagesoffset', '' + page * count);
    }

    if (useLoginLocationTag) {
      urlSearchParameters.append('_tag', 'Login Location');
    }

    if (typeof searchQuery === 'string' && searchQuery != '') {
      urlSearchParameters.append('name:contains', searchQuery);
    }

    return url + urlSearchParameters.toString();
  }

  const { data, isLoading, isValidating, setSize, error } = useSwrInfinite<FetchResponse<LocationResponse>, Error>(
    constructUrl,
    openmrsFetch,
  );

  if (error) {
    showNotification({
      title: t('errorLoadingLoginLocations', 'Error loading login locations'),
      kind: 'error',
      critical: true,
      description: error?.message,
    });
  }

  const memoizedLocations = useMemo(() => {
    return {
      locations: data?.length ? data?.flatMap((entries) => entries?.data?.entry ?? []) : null,
      isLoading,
      totalResults: data?.[0]?.data?.total ?? null,
      hasMore: data?.length ? data?.[data.length - 1]?.data?.link?.some((link) => link.relation === 'next') : false,
      loadingNewData: isValidating,
      setPage: setSize,
      error,
    };
  }, [isLoading, data, isValidating, setSize]);

  return memoizedLocations;
}

export function usePreviousLoggedInLocations(useLoginLocationTag: boolean, searchQuery: string = '') {
  const { user } = useSession();
  const searchParams = new URLSearchParams();
  searchParams.append('_summary', 'data');
  const previousLoggedInLocationUuids = user?.userProperties?.previousLoggedInLocations ?? '';
  searchParams.append('_id', previousLoggedInLocationUuids);
  if (useLoginLocationTag) {
    searchParams.append('_tag', 'Login Location');
  }
  if (typeof searchQuery === 'string' && searchQuery != '') {
    searchParams.append('name:contains', searchQuery);
  }

  const url = previousLoggedInLocationUuids ? `${fhirBaseUrl}/Location?${searchParams.toString()}` : null;

  const { data, error, isLoading, mutate } = useOpenmrsSWR<LocationResponse>(url);

  const memoisedResults = useMemo(
    () => ({
      previousLoggedInLocations: data?.data?.entry ?? [],
      error,
      isLoadingPreviousLoggedInLocations: isLoading,
      mutatePreviousLoggedInLocations: mutate,
    }),
    [data, isLoading, error, mutate],
  );

  return memoisedResults;
}

export function useLoginLocations(
  useLoginLocationTag: boolean,
  count: number = 0,
  searchQuery: string = '',
): LoginLocationData {
  const debouncedSearchQuery = useDebounce(searchQuery);

  const loginLocationsData = useInfiniteLoginLocations(useLoginLocationTag, count, debouncedSearchQuery);

  const previousLoggedInLocationsData = usePreviousLoggedInLocations(useLoginLocationTag, debouncedSearchQuery);

  const memoisedResults = useMemo(() => {
    const { locations, isLoading: isLoadingLocations, ...restData } = loginLocationsData;
    const { previousLoggedInLocations, isLoadingPreviousLoggedInLocations } = previousLoggedInLocationsData;
    const previousLoggedInLocationUuids = previousLoggedInLocations?.map((entry) => entry.resource.id);

    // Excluding the previously logged in locations from fetched locations list since they are separately fetched and shown at the top of the list
    const filteredLocations = previousLoggedInLocationUuids.length
      ? locations?.filter((entry) => !previousLoggedInLocationUuids.includes(entry.resource.id))
      : locations;
    return {
      ...restData,
      isLoading: isLoadingLocations || isLoadingPreviousLoggedInLocations,
      // The previously logged in locations will be shown at the top of the list.
      locations: [...(previousLoggedInLocations ?? []), ...(filteredLocations ?? [])],
    };
  }, [loginLocationsData, previousLoggedInLocationsData]);

  return memoisedResults;
}

export function useValidateLocationUuid(userPreferredLocationUuid: string) {
  const url = userPreferredLocationUuid ? `${fhirBaseUrl}/Location?_id=${userPreferredLocationUuid}` : null;
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
      isLocationValid: data?.ok,
      defaultLocation: data?.data?.entry ?? [],
      error,
      isLoading,
    }),
    [data, isLoading, error],
  );

  return results;
}
