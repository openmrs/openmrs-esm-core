import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from '@openmrs/esm-framework';
import styles from './styles.scss';

const Release = () => {
  const { t } = useTranslation();

  const releaseNotes = () => {
    navigate({ to: 'https://o3-docs.openmrs.org/docs/changelog' });
  };

  return (
    <div onClick={releaseNotes} className={styles.helpButton}>
      {t('releaseNotes', 'Release Notes')}
    </div>
  );
};

export default Release;
