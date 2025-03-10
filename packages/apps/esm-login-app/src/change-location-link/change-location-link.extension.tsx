import { HeaderGlobalAction } from '@carbon/react';
import { LocationIcon, navigate, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './change-location-link.scss';

const ChangeLocationLink: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const currentLocation = session?.sessionLocation?.display;

  const changeLocation = () => {
    // update=true is passed as a query param for updating the location preference,
    // The location picker won't redirect with default location on finding the update=true param.
    navigate({
      to: `\${openmrsSpaBase}/login/location?returnToUrl=${window.location.pathname}&update=true`,
    });
  };

  return (
    <HeaderGlobalAction
      aria-label={t('changeLocation', 'Change location')}
      className={styles.changeLocationButton}
      onClick={changeLocation}
    >
      <LocationIcon size={16} />
      <span className={styles.currentLocationText}>{currentLocation}</span>
    </HeaderGlobalAction>
  );
};

export default ChangeLocationLink;
