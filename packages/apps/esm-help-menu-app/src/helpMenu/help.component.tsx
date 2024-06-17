import React, { useState } from 'react';
import classNames from 'classnames';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.css';
import { Help } from '@carbon/react/icons';
import { useExtensionStore, ExtensionSlot } from '@openmrs/esm-framework';

export default function Root(props) {
  return window.spaEnv === 'development' || Boolean(localStorage.getItem('openmrs:devtools')) ? (
    <>
      <HelpMenu {...props} />
    </>
  ) : null;
}

function HelpMenu() {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const extensionStore = useExtensionStore();

  return (
    <>
      <ExtensionSlot className={styles.helpMenuExtension} name="help-menu-slot">
        <div
          role="button"
          onClick={toggleHelpMenu}
          className={classNames(styles.helpMenuButton, {})}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '2' }}
        >
          <div>
            <Help size={24} />
          </div>
        </div>
        {helpMenuOpen && <HelpMenuPopup close={toggleHelpMenu} />}
      </ExtensionSlot>
    </>
  );

  function toggleHelpMenu() {
    setHelpMenuOpen(!helpMenuOpen);
  }
}
