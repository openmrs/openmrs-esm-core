import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showSnackbar, type LoggedInUser } from '@openmrs/esm-framework';
import useSwrInfinite from 'swr/infinite';
import {
  type FetchResponse,
  fhirBaseUrl,
  openmrsFetch,
  useDebounce,
  useSession,
  useOpenmrsSWR,
} from '@openmrs/esm-framework';
import type { LocationEntry, LocationResponse } from './types';

interface LoginLocationData {
  locations: Array<LocationEntry>;
  isLoadingLocations: boolean;
  totalResults: number;
  hasMore: boolean;
  loadingNewData: boolean;
  setPage: (size: number | ((_size: number) => number)) => Promise<FetchResponse<LocationResponse>[]>;
}

function useFetchInfiniteLoginLocations(
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
    showSnackbar({
      title: t('errorLoadingLoginLocations', 'Error loading login locations'),
      subtitle: error?.message,
      kind: 'error',
    });
  }

  const memoizedLocations = useMemo(() => {
    return {
      locations: data?.length ? data?.flatMap((entries) => entries?.data?.entry ?? []) : null,
      isLoadingLocations: isLoading,
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
  const previousLoggedInLocationUuids = useMemo(
    () => user?.userProperties?.previousLoggedInLocations ?? '',
    [user?.userProperties?.previousLoggedInLocations],
  );
  searchParams.append('_id', previousLoggedInLocationUuids);
  if (useLoginLocationTag) {
    searchParams.append('_tag', 'Login Location');
  }
  if (typeof searchQuery === 'string' && searchQuery != '') {
    searchParams.append('name:contains', searchQuery);
  }

  const url = previousLoggedInLocationUuids ? `${fhirBaseUrl}/Location?${searchParams.toString()}` : null;

  const { data, error, isLoading, mutate } = useOpenmrsSWR<LocationResponse>(url);

  const memoisedResults = useMemo(() => {
    const indices = {};
    previousLoggedInLocationUuids?.split(',').forEach((locationUuid, indx) => {
      indices[locationUuid] = indx;
    });
    return {
      previousLoggedInLocations: data?.data?.entry?.sort((a, b) => indices[a.resource.id] - indices[b.resource.id]),
      error,
      isLoadingPreviousLoggedInLocations: isLoading,
      mutatePreviousLoggedInLocations: mutate,
    };
  }, [data, isLoading, error, mutate, previousLoggedInLocationUuids]);

  return memoisedResults;
}

export function useFetchDefaultLocation(useLoginLocationTag: boolean, searchTerm?: string) {
  const { user } = useSession();
  const defaultLocationUuid = user?.userProperties?.defaultLocation;
  const [isDefaultLocationValid, setIsDefaultLocationValid] = useState(false);
  let urlSearchParameters = new URLSearchParams();
  if (useLoginLocationTag) {
    urlSearchParameters.append('_tag', 'Login Location');
  }
  urlSearchParameters.append('_id', defaultLocationUuid);
  if (searchTerm) {
    urlSearchParameters.append('name:contains', searchTerm);
  }
  const url = defaultLocationUuid ? `${fhirBaseUrl}/Location?${urlSearchParameters.toString()}` : null;
  const { data, error, isLoading } = useOpenmrsSWR<LocationResponse>(url);

  useEffect(() => {
    // We can only validate a locationUuid if there is no search term filtering the result any more.
    if (!searchTerm) {
      setIsDefaultLocationValid(data?.ok && data?.data?.total > 0);
    }
  }, [data?.data?.total, data?.ok, searchTerm]);

  const results = useMemo(
    () => ({
      isDefaultLocationValid,
      defaultLocationArr: isDefaultLocationValid ? data?.data?.entry : [],
      error,
      isLoadingDefaultLocation: isLoading,
    }),
    [isDefaultLocationValid, data?.data?.entry, error, isLoading],
  );
  return results;
}

export function useLoginLocations(useLoginLocationTag: boolean, count: number = 0, searchQuery: string = '') {
  const debouncedSearchQuery = useDebounce(searchQuery);

  const defaultLocationData = useFetchDefaultLocation(useLoginLocationTag, debouncedSearchQuery);
  const previousLoggedInLocationsData = usePreviousLoggedInLocations(useLoginLocationTag, debouncedSearchQuery);
  const loginLocationsData = useFetchInfiniteLoginLocations(useLoginLocationTag, count, debouncedSearchQuery);

  const memoisedResults = useMemo(() => {
    const { defaultLocationArr, isLoadingDefaultLocation, isDefaultLocationValid } = defaultLocationData;
    const { previousLoggedInLocations, isLoadingPreviousLoggedInLocations } = previousLoggedInLocationsData;
    const { locations, isLoadingLocations, ...restData } = loginLocationsData;
    const defaultLocation = isDefaultLocationValid ? defaultLocationArr?.[0]?.resource?.id : null;

    return {
      ...restData,
      isLoadingLocations: isLoadingLocations || isLoadingPreviousLoggedInLocations || isLoadingDefaultLocation,
      locations: mergeLocations(defaultLocationArr, previousLoggedInLocations, locations),
      isDefaultLocationValid,
      defaultLocation,
      lastLoggedInLocation: defaultLocation ?? previousLoggedInLocations?.[0]?.resource?.id,
    };
  }, [loginLocationsData, previousLoggedInLocationsData, defaultLocationData]);

  return memoisedResults;
}

function mergeLocations(
  defaultLocationArr: Array<LocationEntry> | undefined,
  previousLoggedInLocations: Array<LocationEntry> | undefined,
  fetchedLocations: Array<LocationEntry> | undefined,
): Array<LocationEntry> {
  defaultLocationArr = defaultLocationArr ?? [];
  previousLoggedInLocations = previousLoggedInLocations ?? [];
  fetchedLocations = fetchedLocations ?? [];
  const uniqueUuids = new Set<string>();
  const result = [];

  const addLocation = (entry: LocationEntry) => {
    const uuid = entry.resource.id;
    if (!uniqueUuids.has(uuid)) {
      uniqueUuids.add(uuid);
      result.push(entry);
    }
  };

  defaultLocationArr.forEach(addLocation);
  previousLoggedInLocations.forEach(addLocation);
  fetchedLocations.forEach(addLocation);

  return result;
}

export function getUpdatedLoggedInLocations(previousLoggedInLocations: string, locationUuid: string): string {
  const prevLoggedInLocations = previousLoggedInLocations?.split(',') ?? [];
  const updatedLoggedInLocations = [locationUuid, ...prevLoggedInLocations?.filter((uuid) => uuid !== locationUuid)];
  return updatedLoggedInLocations.join(',');
}

export function getUserPropertiesWithDefaultAndLogInLocation(locationUuid: string, previousLoggedInLocations: string) {
  const updatedLoggedInLocations = getUpdatedLoggedInLocations(previousLoggedInLocations, locationUuid);
  const updatedUserProperties: LoggedInUser['userProperties'] = {
    previousLoggedInLocations: updatedLoggedInLocations,
    defaultLocation: locationUuid,
  };
  return updatedUserProperties;
}
