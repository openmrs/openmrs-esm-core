import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigate } from '@openmrs/esm-framework';
import styles from './styles.scss';

const Contact = () => {
  const { t } = useTranslation();

  const contactus = () => {
    navigate({ to: 'https://openmrs.org/contact/' });
  };

  return (
    <div onClick={contactus} className={styles.helpButton}>
      {t('contactUs', 'Contact us')}
    </div>
  );
};

export default Contact;
