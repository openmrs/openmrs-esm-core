import React from 'react';
import styles from './help-popup.styles.scss';

export default function HelpMenuPopup(props: HelpPopupProps) {
  return (
    <div className={styles.popup}>
      <div className={styles.farRight}>
        <button className={styles.helpButton} onClick={props.close}>
          Release Notes
        </button>
        <button className={styles.helpButton} onClick={props.close}>
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
