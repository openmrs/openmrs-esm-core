import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSwrInfinite, { type SWRInfiniteResponse } from 'swr/infinite';
import useSwrImmutable from 'swr/immutable';
import {
  fhirBaseUrl,
  openmrsFetch,
  refetchCurrentUser,
  restBaseUrl,
  type FetchResponse,
  type Session,
  useDebounce,
} from '@openmrs/esm-framework';
import type { LocationEntry, LocationResponse } from './types';

// "swr/infinite" doesn't export InfiniteKeyedMutator directly
type InfiniteKeyedMutator<T> = SWRInfiniteResponse<T extends (infer I)[] ? I : T>['mutate'];

interface LoginLocationData {
  error: Error;
  hasMore: boolean;
  isLoading: boolean;
  loadingNewData: boolean;
  locations: Array<LocationEntry>;
  mutate: InfiniteKeyedMutator<FetchResponse<LocationResponse>[]>;
  setPage: (size: number | ((_size: number) => number)) => Promise<FetchResponse<LocationResponse>[]>;
  totalResults: number;
}

export function useLoginLocations(
  count: number = 0,
  searchQuery: string = '',
  useLoginLocationTag: boolean,
): LoginLocationData {
  const { t } = useTranslation();
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

    if (useLoginLocationTag) {
      urlSearchParameters.append('_tag', 'Login Location');
    }

    if (typeof debouncedSearchQuery === 'string' && debouncedSearchQuery != '') {
      urlSearchParameters.append('name:contains', debouncedSearchQuery);
    }

    return url + urlSearchParameters.toString();
  }

  const { data, isLoading, isValidating, setSize, error, mutate } = useSwrInfinite<
    FetchResponse<LocationResponse>,
    Error
  >(constructUrl, openmrsFetch);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const memoizedLocations = useMemo(() => {
    return {
      locations: data?.length ? data?.flatMap((entries) => entries?.data?.entry ?? []) : null,
      isLoading,
      totalResults: data?.[0]?.data?.total ?? null,
      hasMore: data?.length ? data?.[data.length - 1]?.data?.link?.some((link) => link.relation === 'next') : false,
      loadingNewData: isValidating,
      setPage: setSize,
      error,
      mutate,
    };
  }, [isLoading, data, isValidating, setSize, error, mutate]);

  return memoizedLocations;
}

export async function performLogin(username: string, password: string): Promise<{ data: Session }> {
  const abortController = new AbortController();
  const token = window.btoa(`${username}:${password}`);
  const url = `${restBaseUrl}/session`;

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
