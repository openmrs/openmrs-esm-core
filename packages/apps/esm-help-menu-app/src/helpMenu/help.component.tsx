import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.css';
import { Help } from '@carbon/react/icons';

export default function Root(props) {
  return window.spaEnv === 'development' || Boolean(localStorage.getItem('openmrs:devtools')) ? (
    <>
      <HelpMenu {...props} />
    </>
  ) : null;
}

function HelpMenu() {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);

  const toggleHelpMenu = () => {
    setHelpMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.helpMenuButton}`) && !event.target.closest(`.${styles.popup}`)) {
        setHelpMenuOpen(false);
      }
    };

    if (helpMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [helpMenuOpen]);

  return (
    <>
      <div
        role="button"
        onClick={toggleHelpMenu}
        className={classNames(styles.helpMenuButton)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
        }}
      >
        <Help size={24} />
      </div>
      {helpMenuOpen && <HelpMenuPopup close={toggleHelpMenu} />}
    </>
  );
}
