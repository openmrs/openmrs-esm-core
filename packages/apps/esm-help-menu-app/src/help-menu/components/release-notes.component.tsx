import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from '@carbon/react/icons';
import { Link } from '@carbon/react';
import styles from './styles.scss';

const ReleaseNotes = () => {
  const { t } = useTranslation();

  return (
    <Link
      className={styles.helpButton}
      href="https://openmrs.atlassian.net/wiki/spaces/docs/pages/26249097/Releases"
      rel="noopener noreferrer"
      renderIcon={ArrowUpRight}
      target="_blank"
    >
      {t('releaseNotes', 'Release notes')}
    </Link>
  );
};

export default ReleaseNotes;
