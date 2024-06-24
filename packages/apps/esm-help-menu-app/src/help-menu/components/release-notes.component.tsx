import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from '@openmrs/esm-framework';
import styles from './styles.scss';

const ReleaseNotes = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    window.open('https://o3-docs.openmrs.org/docs/changelog', '_blank');
  };

  return (
    <div onClick={handleClick} className={styles.helpButton}>
      {t('releaseNotes', 'Release Notes')}
    </div>
  );
};

export default ReleaseNotes;
