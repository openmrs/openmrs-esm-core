import React, { useState } from 'react';
import styles from './help-popup.styles.scss';
import GenericModal from './subHelpMenu/tutorial';
import { useTranslation } from 'react-i18next';

export default function HelpMenuPopup(props) {
  const { t } = useTranslation();
  const [tutorialsModalOpen, setTutorialsModalOpen] = useState(false);

  const handleTutorialsModalOpen = () => {
    setTutorialsModalOpen(true);
  };

  const handleTutorialsModalClose = () => {
    setTutorialsModalOpen(false);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.farRight}>
        <GenericModal
          isOpen={tutorialsModalOpen}
          onClose={handleTutorialsModalClose}
          heading="Tutorials"
          label="Home"
          content="Welcome to OpenMRS 3.0.1! Here are some tutorials to help you get started."
        />
        <button className={styles.helpButton} onClick={props.close}>
          {t('releaseNotes', 'Release Notes')}
        </button>
        <button className={styles.helpButton} onClick={handleTutorialsModalOpen}>
          {t('tutorials', 'Tutorials')}
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          {t('contactUs', 'Contact us')}
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          {t('docs', 'Docs')}
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          {t('feedbackForum', 'Feedback Forum')}
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          {t('version', 'OpenMRS 3.0.1')}
        </button>
      </div>
    </div>
  );
}

type HelpPopupProps = {
  close(): void;
};
