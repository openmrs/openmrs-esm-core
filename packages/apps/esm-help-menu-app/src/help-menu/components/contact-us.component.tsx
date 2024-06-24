import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.scss';

const ContactUs = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    window.open('https://openmrs.org/contact/', '_blank');
  };

  return (
    <div onClick={handleClick} className={styles.helpButton}>
      {t('contactUs', 'Contact us')}
    </div>
  );
};

export default ContactUs;
