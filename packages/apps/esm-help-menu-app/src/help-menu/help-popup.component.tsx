import React, { useState } from 'react';
import styles from './help-popup.styles.scss';
import { ExtensionSlot } from '@openmrs/esm-framework';

export default function HelpMenuPopup() {
  return (
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      <ExtensionSlot name="help-menu-slot"></ExtensionSlot>
    </div>
  );
}
