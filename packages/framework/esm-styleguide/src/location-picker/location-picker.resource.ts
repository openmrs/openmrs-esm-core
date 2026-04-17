import { useMemo } from 'react';
import useSwrImmutable from 'swr/immutable';
import useSwrInfinite from 'swr/infinite';
import { type FetchResponse, fhirBaseUrl, openmrsFetch } from '@openmrs/esm-api';
import { type FHIRLocationResource } from '@openmrs/esm-emr-api';
import { useDebounce } from '@openmrs/esm-react-utils';

export interface LocationResponse {
  type: string;
  total: number;
  resourceType: string;
  meta: {
    lastUpdated: string;
  };
  link: Array<{
    relation: string;
    url: string;
  }>;
  id: string;
  entry: Array<FHIRLocationResource>;
}
export interface LoginLocationData {
  locations: Array<FHIRLocationResource>;
  isLoading: boolean;
  totalResults?: number;
  hasMore: boolean;
  loadingNewData: boolean;
  error: Error | null;
  setPage: (size: number | ((_size: number) => number)) => Promise<FetchResponse<LocationResponse>[] | undefined>;
}

/**
 * A React hook that fetches a location by its UUID using the FHIR API.
 *
 * @param locationUuid Optional UUID of the location to fetch. If not provided,
 *   the hook returns null for the location without making a request.
 * @returns An object containing the location data, loading state, and any error.
 *
 * @category API
 */
export function useLocationByUuid(locationUuid?: string) {
  const url = locationUuid ? `/ws/fhir2/R4/Location?_id=${locationUuid}` : null;

  const { data, error, isLoading } = useSwrImmutable<FetchResponse<LocationResponse>>(url, openmrsFetch, {
    shouldRetryOnError(err) {
      if (err?.response?.status) {
        return err.response.status >= 500;
      }
      return false;
    },
  });

  return useMemo(
    () => ({
      location: data?.data?.entry ? data.data.entry[0] : null,
      error: url ? error : null,
      isLoading: url ? isLoading : false,
    }),
    [data, isLoading, error, url],
  );
}

/**
 * A React hook that fetches locations from the FHIR API with support for
 * pagination, filtering by tag, and searching by name. Uses SWR infinite
 * loading for efficient pagination.
 *
 * @param locationTag Optional tag to filter locations (e.g., 'Login Location').
 * @param count The number of locations to fetch per page. Defaults to 0 (no limit).
 * @param searchQuery Optional search string to filter locations by name.
 * @returns An object containing the locations array, loading states, pagination info, and any error.
 *
 * @category API
 */
export function useLocations(locationTag?: string, count: number = 0, searchQuery: string = ''): LoginLocationData {
  const debouncedSearchQuery = useDebounce(searchQuery);
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

    if (locationTag) {
      urlSearchParameters.append('_tag', locationTag);
    }

    if (typeof debouncedSearchQuery === 'string' && debouncedSearchQuery !== '') {
      urlSearchParameters.append('name:contains', debouncedSearchQuery);
    }

    return url + urlSearchParameters.toString();
  }

  const { data, isLoading, isValidating, setSize, error } = useSwrInfinite<FetchResponse<LocationResponse>, Error>(
    constructUrl,
    openmrsFetch,
  );

  const memoizedLocations = useMemo(() => {
    return {
      locations: data?.length ? data?.flatMap((entries) => entries?.data?.entry ?? []) : [],
      isLoading,
      totalResults: data?.[0]?.data?.total,
      hasMore: data?.length ? data?.[data.length - 1]?.data?.link?.some((link) => link.relation === 'next') : false,
      loadingNewData: isValidating,
      error: error || null,
      setPage: setSize,
    };
  }, [isLoading, data, isValidating, setSize, error]);

  return memoizedLocations;
}
