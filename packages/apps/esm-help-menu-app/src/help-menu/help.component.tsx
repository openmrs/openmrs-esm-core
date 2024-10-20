import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Help } from '@carbon/react/icons';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.scss';

export default function HelpMenu() {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const helpMenuButtonRef = useRef(null);
  const popupRef = useRef(null);

  const toggleHelpMenu = () => {
    setHelpMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        helpMenuButtonRef.current &&
        !helpMenuButtonRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setHelpMenuOpen(false);
      }
    };

    window.addEventListener(`mousedown`, handleClickOutside);
    window.addEventListener(`touchstart`, handleClickOutside);
    return () => {
      window.removeEventListener(`mousedown`, handleClickOutside);
      window.removeEventListener(`touchstart`, handleClickOutside);
    };
  }, []);

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
        {!helpMenuOpen && <span className={styles.helpLabel}>Help</span>} {/* Label is hidden when menu is open */}
      </button>
      {helpMenuOpen && (
        <div id="help-menu-popup" ref={popupRef} className={styles.helpMenuPopup}>
          <HelpMenuPopup />
        </div>
      )}
    </>
  );
}
