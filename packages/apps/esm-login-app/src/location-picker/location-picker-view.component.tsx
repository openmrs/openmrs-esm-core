import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, type Location, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, InlineLoading } from '@carbon/react';
import {
  navigate,
  setSessionLocation,
  useConfig,
  useConnectivity,
  useSession,
  LocationPicker,
  getCoreTranslation,
} from '@openmrs/esm-framework';
import type { LoginReferrer } from '../login/login.component';
import { useDefaultLocation, useLocationCount } from './location-picker.resource';
import type { ConfigSchema } from '../config-schema';
import styles from './location-picker.scss';

interface LocationPickerProps {
  hideWelcomeMessage?: boolean;
  currentLocationUuid?: string;
}

const LocationPickerView: React.FC<LocationPickerProps> = ({ hideWelcomeMessage, currentLocationUuid }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();
  const { chooseLocation } = config;
  const isLoginEnabled = useConnectivity();
  const [searchParams] = useSearchParams();
  const isUpdateFlow = useMemo(() => searchParams.get('update') === 'true', [searchParams]);
  const { defaultLocation, updateDefaultLocation, savePreference, setSavePreference } =
    useDefaultLocation(isUpdateFlow);
  const {
    isLoading: isLoadingLocationCount,
    locationCount,
    firstLocation,
  } = useLocationCount(chooseLocation.useLoginLocationTag);

  const { user, sessionLocation } = useSession();
  const { currentUser, userProperties } = useMemo(
    () => ({
      currentUser: user?.display,
      userUuid: user?.uuid,
      userProperties: user?.userProperties,
    }),
    [user],
  );

  const [activeLocation, setActiveLocation] = useState(() => {
    if (currentLocationUuid && hideWelcomeMessage) {
      return currentLocationUuid;
    }
    return sessionLocation?.uuid ?? defaultLocation;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };

  const changeLocation = useCallback(
    (locationUuid?: string, saveUserPreference?: boolean) => {
      setIsSubmitting(true);

      const referrer = state?.referrer;
      const returnToUrl = new URLSearchParams(location?.search).get('returnToUrl');

      const sessionDefined = setSessionLocation(locationUuid, new AbortController());

      updateDefaultLocation(locationUuid, saveUserPreference);
      sessionDefined.then(() => {
        if (referrer && !['/', '/login', '/login/location'].includes(referrer)) {
          navigate({ to: '${openmrsSpaBase}' + referrer });
          return;
        }
        if (returnToUrl && returnToUrl !== '/') {
          navigate({ to: returnToUrl });
        } else {
          navigate({ to: config.links.loginSuccess });
        }
        return;
      });
    },
    [state?.referrer, config.links.loginSuccess, updateDefaultLocation],
  );

  // Handle cases where the location picker is disabled, there is only one location, or there are no locations.
  useEffect(() => {
    if (isLoadingLocationCount) return;

    if (locationCount == 0) {
      changeLocation();
    } else if (locationCount == 1 || !chooseLocation.enabled) {
      changeLocation(firstLocation!.resource.id, true);
    }
  }, [locationCount, isLoadingLocationCount]);

  // Handle cases where the login location is present in the userProperties.
  useEffect(() => {
    if (isUpdateFlow) {
      return;
    }
    if (defaultLocation && !isSubmitting) {
      setActiveLocation(defaultLocation);
      changeLocation(defaultLocation, true);
    }
  }, [changeLocation, isSubmitting, defaultLocation, isUpdateFlow]);

  const handleSubmit = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      if (!activeLocation) return;

      changeLocation(activeLocation, savePreference);
    },
    [activeLocation, changeLocation, savePreference],
  );

  return (
    <div className={styles.locationPickerContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.locationCard}>
          <div className={styles.paddedContainer}>
            <p className={styles.welcomeTitle}>
              {t('welcome', 'Welcome')} {currentUser}
            </p>
            <p className={styles.welcomeMessage}>
              {t(
                'selectYourLocation',
                'Select your location from the list below. Use the search bar to find your location.',
              )}
            </p>
          </div>
          <LocationPicker
            selectedLocationUuid={activeLocation}
            defaultLocationUuid={userProperties.defaultLocation}
            locationTag={chooseLocation.useLoginLocationTag && 'Login Location'}
            onChange={(locationUuid) => setActiveLocation(locationUuid)}
          />
          <div className={styles.footerContainer}>
            <Checkbox
              id="checkbox"
              className={styles.savePreferenceCheckbox}
              labelText={t('rememberLocationForFutureLogins', 'Remember my location for future logins')}
              checked={savePreference}
              onChange={(_, { checked }) => setSavePreference(checked)}
            />
            <Button
              className={styles.confirmButton}
              kind="primary"
              type="submit"
              disabled={!activeLocation || !isLoginEnabled || isSubmitting}
            >
              {isSubmitting ? (
                <InlineLoading className={styles.loader} description={t('submitting', 'Submitting')} />
              ) : (
                <span>{getCoreTranslation('confirm')}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationPickerView;
