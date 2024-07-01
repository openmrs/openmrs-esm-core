import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.scss';
import { Help } from '@carbon/react/icons';

export default function HelpMenu() {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const helpMenuButtonRef = useRef(null);
  const popupRef = useRef(null);

  const toggleHelpMenu = () => {
    setHelpMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        helpMenuButtonRef.current &&
        !helpMenuButtonRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setHelpMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [helpMenuOpen]);

  return (
    <>
      <button
        aria-expanded={helpMenuOpen}
        aria-controls="help-menu-popup"
        onClick={toggleHelpMenu}
        ref={helpMenuButtonRef}
        className={classNames(styles.helpMenuButton)}
      >
        <Help size={24} />
      </button>
      {helpMenuOpen && (
        <div id="help-menu-popup" ref={popupRef} className={styles.helpMenuPopup}>
          <HelpMenuPopup />
        </div>
      )}
    </>
  );
}
