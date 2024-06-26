import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.scss';
import { ArrowUpRight } from '@carbon/react/icons';

const ContactUs = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    window.open('https://talk.openmrs.org/', '_blank');
  };

  return (
    <div onClick={handleClick} className={styles.helpButton}>
      {t('communityforum', 'Community Forum')}
      <ArrowUpRight />
    </div>
  );
};

export default ContactUs;
