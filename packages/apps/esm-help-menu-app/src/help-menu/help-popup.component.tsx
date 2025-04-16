import React from 'react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './help-popup.styles.scss';

export default function HelpMenuPopup() {
  return (
    <div className={styles.popup} onClick={(e) => e.stopPropagation()} aria-label="Help Menu" role="menu" tabIndex={-1}>
      <ExtensionSlot className={styles.helpextension} name="help-menu-slot" />
    </div>
  );
}
