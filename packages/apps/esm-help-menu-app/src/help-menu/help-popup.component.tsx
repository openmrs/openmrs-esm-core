import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionSlot } from '@openmrs/esm-framework';
import styles from './help-popup.styles.scss';

export default function HelpMenuPopup() {
  const { t } = useTranslation();

  return (
    <div
      className={styles.popup}
      onClick={(e) => e.stopPropagation()}
      aria-label={t('helpMenu', 'Help menu')}
      role="menu"
      tabIndex={-1}
    >
      <ExtensionSlot className={styles.helpextension} name="help-menu-slot" />
    </div>
  );
}
