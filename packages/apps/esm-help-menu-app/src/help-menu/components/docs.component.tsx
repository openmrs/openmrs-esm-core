import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.scss';
import { MenuItem } from '@carbon/react';

const Docs = () => {
  const { t } = useTranslation();
  return (
    <MenuItem
      className={styles.helpButton}
      label={t('documentation', 'Documentation')}
      onClick={() => window.open('https://o3-docs.openmrs.org', '_blank')}
    />
  );
};

export default Docs;
