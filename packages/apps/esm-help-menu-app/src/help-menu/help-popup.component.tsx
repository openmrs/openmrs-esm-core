import React, { useState } from 'react';
import styles from './help-popup.styles.scss';
import { ExtensionSlot } from '@openmrs/esm-framework';

export default function HelpMenuPopup() {
  return (
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      <ExtensionSlot className={styles.helpextension} name="help-menu-slot" />
    </div>
  );
}
