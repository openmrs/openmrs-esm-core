import React, { useState } from 'react';
import styles from './help-popup.styles.scss';
import GenericModal from './subHelpMenu/tutorial';

export default function HelpMenuPopup(props) {
  const [releaseNotesModalOpen, setReleaseNotesModalOpen] = useState(false);
  const [tutorialsModalOpen, setTutorialsModalOpen] = useState(false);

  const handleReleaseNotesModalOpen = () => {
    setReleaseNotesModalOpen(true);
  };

  const handleReleaseNotesModalClose = () => {
    setReleaseNotesModalOpen(false);
  };

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
          Release Notes
        </button>
        <button className={styles.helpButton} onClick={handleTutorialsModalOpen}>
          Tutorials
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          Contact us
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          Docs
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          Feedback forum
        </button>
        <button className={styles.helpButton} onClick={props.close}>
          OpenMRS 3.0.1
        </button>
      </div>
    </div>
  );
}

type HelpPopupProps = {
  close(): void;
};
