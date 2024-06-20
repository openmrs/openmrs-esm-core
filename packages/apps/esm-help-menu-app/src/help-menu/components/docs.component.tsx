import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';
import { navigate } from '@openmrs/esm-framework';

const Docs = () => {
  const { t } = useTranslation();

  const docs = () => {
    navigate({ to: 'https://o3-docs.openmrs.org/' });
  };

  return (
    <div onClick={docs} className={styles.helpButton}>
      {t('docs', 'Docs')}
    </div>
  );
};

export default Docs;
