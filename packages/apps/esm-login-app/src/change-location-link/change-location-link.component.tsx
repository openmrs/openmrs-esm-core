import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import { Location } from '@carbon/react/icons';
import styles from './change-location-link.scss';

interface ChangeLocationLinkProps {
  referer?: string;
  currentLocation: string;
}

const ChangeLocationLink: React.FC<ChangeLocationLinkProps> = ({ referer, currentLocation }) => {
  const { t } = useTranslation();

  const changeLocation = () => {
    // update=true is passed as a query param for updating the location preference,
    // The location picker won't redirect with default location on finding the update=true param.
    navigate({
      to: `\${openmrsSpaBase}/login/location?returnToUrl=${referer}&update=true`,
    });
  };

  return (
    <div className={styles.changeLocationLinkContainer}>
      <Location size={20} />
      <div>
        {currentLocation}
        <Button kind="ghost" onClick={changeLocation}>
          {t('change', 'Change')}
        </Button>
      </div>
    </div>
  );
};

export default ChangeLocationLink;
