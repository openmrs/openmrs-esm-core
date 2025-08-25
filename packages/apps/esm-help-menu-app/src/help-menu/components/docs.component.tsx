import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from '@carbon/react/icons';
import { Link } from '@carbon/react';
import styles from './styles.scss';

const Docs = () => {
  const { t } = useTranslation();
  return (
    <Link
      className={styles.helpButton}
      href="https://om.rs/o3docs"
      rel="noopener noreferrer"
      renderIcon={ArrowUpRight}
      target="_blank"
    >
      {t('docs', 'Docs')}
    </Link>
  );
};

export default Docs;
