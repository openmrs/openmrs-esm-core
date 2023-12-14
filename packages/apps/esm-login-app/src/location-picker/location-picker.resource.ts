import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSwrInfinite from 'swr/infinite';
import useSwrImmutable from 'swr/immutable';
import {
  FetchResponse,
  fhirBaseUrl,
  openmrsFetch,
  setUserProperties,
  showNotification,
  showToast,
  useSession,
} from '@openmrs/esm-framework';
import { LocationEntry, LocationResponse } from '../types';

interface LoginLocationData {
  locations: Array<LocationEntry>;
  isLoading: boolean;
  totalResults: number;
  hasMore: boolean;
  loadingNewData: boolean;
  setPage: (size: number | ((_size: number) => number)) => Promise<FetchResponse<LocationResponse>[]>;
}

export function useLoginLocations(
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
    };
  }, [isLoading, data, isValidating, setSize]);

  return memoizedLocations;
}

/**
 * The hook is created to validate a locationUuid and also allow searching with a search term
 * for the same location so that the searching by name is validated from the backend itself,
 * which is similar to the hook `useLoginLocations`.
 * The result from this hook and `useLoginLocations` are merged and hence searching is
 * required as well in this hook
 */
export function useValidateLocationUuid(locationUuid: string, searchTerm?: string) {
  const [isLocationValid, setIsLocationValid] = useState(false);
  let urlSearchParameters = new URLSearchParams();
  urlSearchParameters.append('_id', locationUuid);
  if (searchTerm) {
    urlSearchParameters.append('name:contains', searchTerm);
  }
  const url = locationUuid ? `/ws/fhir2/R4/Location?${urlSearchParameters.toString()}` : null;
  const { data, error, isLoading } = useSwrImmutable<FetchResponse<LocationResponse>>(url, openmrsFetch, {
    shouldRetryOnError(err) {
      if (err?.response?.status) {
        return err.response.status >= 500;
      }
      return false;
    },
  });

  useEffect(() => {
    // We can only validate a locationUuid if there is no search term filtering the result any more.
    if (!searchTerm) {
      setIsLocationValid(data?.ok && data?.data?.total > 0);
    }
  }, [data?.data?.total, data?.ok, searchTerm]);

  const results = useMemo(
    () => ({
      isLocationValid,
      location: data?.data?.entry ?? [],
      error,
      isLoading,
    }),
    [isLocationValid, data?.data?.entry, error, isLoading],
  );
  return results;
}

export function useDefaultLocation(isUpdateFlow: boolean, searchTerm: string) {
  const { t } = useTranslation();
  const [savePreference, setSavePreference] = useState(false);
  const { user } = useSession();

  const { userUuid, userProperties } = useMemo(
    () => ({
      userUuid: user?.uuid,
      userProperties: user?.userProperties,
    }),
    [user],
  );

  const userDefaultLocationUuid = useMemo(() => userProperties?.defaultLocation, [userProperties?.defaultLocation]);

  const {
    isLoading: isLoadingValidation,
    isLocationValid,
    location: defaultLocationFhir,
  } = useValidateLocationUuid(userDefaultLocationUuid, searchTerm);

  useEffect(() => {
    if (userDefaultLocationUuid) {
      setSavePreference(true);
    }
  }, [setSavePreference, userDefaultLocationUuid]);

  const updateUserPropsWithDefaultLocation = useCallback(
    async (locationUuid: string, saveDefaultLocation: boolean) => {
      if (saveDefaultLocation) {
        // If the user checks the checkbox for saving the preference
        const updatedUserProperties = {
          ...userProperties,
          defaultLocation: locationUuid,
        };
        await setUserProperties(userUuid, updatedUserProperties);
      } else if (!!userProperties?.defaultLocation) {
        // If the user doesn't want to save the preference,
        // the old preference should be deleted
        delete userProperties.defaultLocation;
        await setUserProperties(userUuid, userProperties);
      }
    },
    [userProperties, userUuid],
  );

  const updateDefaultLocation = useCallback(
    async (locationUuid: string, saveDefaultLocation: boolean) => {
      if (savePreference && locationUuid === userDefaultLocationUuid) {
        return;
      }

      updateUserPropsWithDefaultLocation(locationUuid, saveDefaultLocation).then(() => {
        if (saveDefaultLocation) {
          showToast({
            title: !isUpdateFlow
              ? t('locationPreferenceAdded', 'Selected location will be used for your next logins')
              : t('locationPreferenceUpdated', 'Login location preference updated'),
            description: !isUpdateFlow
              ? t('selectedLocationPreferenceSetMessage', 'You can change your preference from the user dashboard')
              : t('locationPreferenceAdded', 'Selected location will be used for your next logins'),
            kind: 'success',
          });
        } else if (userDefaultLocationUuid) {
          showToast({
            title: t('locationPreferenceRemoved', 'Login location preference removed'),
            description: t('removedLoginLocationPreference', 'The login location preference has been removed.'),
            kind: 'success',
          });
        }
      });
    },
    [savePreference, userDefaultLocationUuid, updateUserPropsWithDefaultLocation, t, isUpdateFlow],
  );

  return {
    isLoadingValidation,
    defaultLocationFhir,
    userDefaultLocationUuid: isLocationValid ? userDefaultLocationUuid : null,
    updateDefaultLocation,
    savePreference,
    setSavePreference,
  };
}

export function useInfiniteScrolling({
  inLoadingState,
  shouldLoadMore,
  onIntersection,
}: {
  inLoadingState: boolean;
  shouldLoadMore: boolean;
  onIntersection: () => void;
}) {
  const observer = useRef(null);
  const loadingIconRef = useCallback(
    (node: HTMLDivElement) => {
      if (inLoadingState) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && shouldLoadMore) {
            onIntersection();
          }
        },
        {
          threshold: 1,
        },
      );
      if (node) observer.current.observe(node);
    },
    [inLoadingState, shouldLoadMore, onIntersection],
  );
  return {
    observer,
    loadingIconRef,
  };
}
