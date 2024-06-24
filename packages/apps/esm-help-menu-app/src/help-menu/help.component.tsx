import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.css';
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
      <div role="button" onClick={toggleHelpMenu} ref={helpMenuButtonRef} className={classNames(styles.helpMenuButton)}>
        <Help size={24} />
      </div>
      {helpMenuOpen && (
        <div ref={popupRef}>
          <HelpMenuPopup />
        </div>
      )}
    </>
  );
}
