import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.scss';
import { MenuItem } from '@carbon/react';

const ReleaseNotes = () => {
  const { t } = useTranslation();

  return (
    <MenuItem
      className={styles.helpButton}
      label={t('releaseNotes', 'Release notes')}
      onClick={() => window.open('https://o3-docs.openmrs.org/docs/changelog', '_blank')}
    />
  );
};

export default ReleaseNotes;
