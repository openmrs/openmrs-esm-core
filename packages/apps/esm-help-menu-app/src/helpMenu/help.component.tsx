import React, { useState } from 'react';
import classNames from 'classnames';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.css';
import { Help } from '@carbon/react/icons';

export default function Root(props) {
  return window.spaEnv === 'development' || Boolean(localStorage.getItem('openmrs:devtools')) ? (
    <HelpMenu {...props} />
  ) : null;
}

function HelpMenu() {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);

  return (
    <>
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
    </>
  );

  function toggleHelpMenu() {
    setHelpMenuOpen(!helpMenuOpen);
  }
}
