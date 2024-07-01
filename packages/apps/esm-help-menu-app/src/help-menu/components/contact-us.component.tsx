import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.scss';
import { ArrowUpRight } from '@carbon/react/icons';
import { Link } from '@carbon/react';

const ContactUs = () => {
  const { t } = useTranslation();
  return (
    <Link
      className={styles.helpButton}
      href="https://talk.openmrs.org"
      rel="noopener noreferrer"
      renderIcon={ArrowUpRight}
      target="_blank"
    >
      {t('communityforum', 'Community forum')}
    </Link>
  );
};

export default ContactUs;
