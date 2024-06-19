import React, { useState } from 'react';
import styles from './help-popup.styles.scss';
import GenericModal from './subHelpMenu/tutorial';
import { useTranslation } from 'react-i18next';
import { ExtensionSlot } from '@openmrs/esm-framework';

export default function HelpMenuPopup({ close }) {
  const { t } = useTranslation();
  const [tutorialsModalOpen, setTutorialsModalOpen] = useState(false);

  const handleTutorialsModalOpen = () => {
    setTutorialsModalOpen(true);
  };

  const handleTutorialsModalClose = () => {
    setTutorialsModalOpen(false);
  };

  return (
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      <div className={styles.farRight}>
        <GenericModal
          isOpen={tutorialsModalOpen}
          onClose={handleTutorialsModalClose}
          heading="Tutorials"
          label="Home"
          content="Welcome to OpenMRS 3.0.1! Here are some tutorials to help you get started."
        />
        <button className={styles.helpButton} onClick={close}>
          {t('releaseNotes', 'Release Notes')}
        </button>
        <button className={styles.helpButton} onClick={handleTutorialsModalOpen}>
          {t('tutorials', 'Tutorials')}
        </button>
        <button className={styles.helpButton} onClick={close}>
          {t('contactUs', 'Contact us')}
        </button>
        <button className={styles.helpButton} onClick={close}>
          {t('docs', 'Docs')}
        </button>
        <button className={styles.helpButton} onClick={close}>
          {t('feedbackForum', 'Feedback Forum')}
        </button>
        <button className={styles.helpButton} onClick={close}>
          {t('version', 'OpenMRS 3.0.1')}
        </button>
        <ExtensionSlot className={styles.helpMenuExtension} name="help-menu-slot"></ExtensionSlot>
      </div>
    </div>
  );
}
