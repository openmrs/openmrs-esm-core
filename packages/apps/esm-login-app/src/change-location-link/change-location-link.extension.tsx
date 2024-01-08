import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigate, useSession } from '@openmrs/esm-framework';
import { Button } from '@carbon/react';
import { Location } from '@carbon/react/icons';
import styles from './change-location-link.scss';
import { SwitcherItem } from '@carbon/react';

const ChangeLocationLink: React.FC = () => {
  const { t } = useTranslation();
  const session = useSession();
  const currentLocation = session?.sessionLocation?.display;
  const referer = window.location.pathname;

  const changeLocation = () => {
    // update=true is passed as a query param for updating the location preference,
    // The location picker won't redirect with default location on finding the update=true param.
    navigate({
      to: `\${openmrsSpaBase}/login/location?returnToUrl=${referer}&update=true`,
    });
  };

  return (
    <SwitcherItem aria-label="Change Location" className={styles.panelItemContainer}>
      <div>
        <Location size={20} />
        <p>{currentLocation}</p>
      </div>
      <Button kind="ghost" onClick={changeLocation}>
        {t('change', 'Change')}
      </Button>
    </SwitcherItem>
  );
};

export default ChangeLocationLink;
