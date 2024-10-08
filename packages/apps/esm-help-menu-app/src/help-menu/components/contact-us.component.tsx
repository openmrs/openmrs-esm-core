import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.scss';
import { MenuItem } from '@carbon/react';

const ContactUs = () => {
  const { t } = useTranslation();
  return (
    <MenuItem
      className={styles.helpButton}
      label={t('communityforum', 'Community forum')}
      onClick={() => window.open('https://talk.openmrs.org', '_blank')}
    />
  );
};

export default ContactUs;
