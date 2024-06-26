import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.scss';
import { ArrowUpRight } from '@carbon/react/icons';

const ReleaseNotes = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    window.open('https://o3-docs.openmrs.org/docs/changelog', '_blank');
  };

  return (
    <div onClick={handleClick} className={styles.helpButton}>
      {t('releaseNotes', 'Release Notes')}
      <ArrowUpRight />
    </div>
  );
};

export default ReleaseNotes;
