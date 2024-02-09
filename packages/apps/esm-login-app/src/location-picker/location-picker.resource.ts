import { type FetchResponse, openmrsFetch, setUserProperties, showToast, useSession } from '@openmrs/esm-framework';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidateLocationUuid } from '../login.resource';
import useSwrImmutable from 'swr/immutable';
import { type LocationResponse } from '../types';

export function useDefaultLocation(isUpdateFlow: boolean) {
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

  const defaultLocation = useMemo(() => {
    return userProperties?.defaultLocation;
  }, [userProperties?.defaultLocation]);

  const { isLocationValid, defaultLocation: defaultLocationFhir } = useValidateLocationUuid(defaultLocation);

  useEffect(() => {
    if (defaultLocation) {
      setSavePreference(true);
    }
  }, [setSavePreference, defaultLocation]);

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
        const updatedUserProperties = { ...userProperties };
        delete updatedUserProperties.defaultLocation;
        await setUserProperties(userUuid, updatedUserProperties);
      }
    },
    [userProperties, userUuid],
  );

  const updateDefaultLocation = useCallback(
    async (locationUuid: string, saveDefaultLocation: boolean) => {
      if (savePreference && locationUuid === defaultLocation) {
        return;
      }

      updateUserPropsWithDefaultLocation(locationUuid, saveDefaultLocation).then(() => {
        if (saveDefaultLocation) {
          showToast({
            title: !isUpdateFlow
              ? t('locationPreferenceAdded', 'Selected location will be used for your next logins')
              : t('locationPreferenceUpdated', 'Login location preference updated'),
            description: !isUpdateFlow
              ? t('selectedLocationPreferenceSetMessage', 'You can change your preference from the user menu')
              : t('locationPreferenceAdded', 'Selected location will be used for your next logins'),
            kind: 'success',
          });
        } else if (defaultLocation) {
          showToast({
            title: t('locationPreferenceRemoved', 'Login location preference removed'),
            description: t('removedLoginLocationPreference', 'The login location preference has been removed.'),
            kind: 'success',
          });
        }
      });
    },
    [savePreference, defaultLocation, updateUserPropsWithDefaultLocation, t, isUpdateFlow],
  );

  return {
    defaultLocationFhir,
    defaultLocation: isLocationValid ? defaultLocation : null,
    updateDefaultLocation,
    savePreference,
    setSavePreference,
  };
}

export function useLocationCount(useLoginLocationTag: boolean) {
  const url = `/ws/fhir2/R4/Location?_count=1`;
  if (useLoginLocationTag) {
    url.concat(`&tag=Login Location`);
  }
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
      locationCount: data?.data?.total,
      firstLocation: data?.data?.entry ? data.data.entry[0] : null,
      error,
      isLoading,
    }),
    [data, isLoading, error],
  );
}
