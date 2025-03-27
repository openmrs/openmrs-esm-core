import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { Help } from '@carbon/react/icons';
import { useSession } from '@openmrs/esm-framework';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.scss';

export default function HelpMenu() {
  const { t } = useTranslation();
  const { user } = useSession();
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
      {user && (
        <Button
          aria-controls="help-menu-popup"
          aria-expanded={helpMenuOpen}
          className={styles.helpMenuButton}
          kind="ghost"
          onClick={toggleHelpMenu}
          ref={helpMenuButtonRef}
          size="md"
        >
          <Help size={20} />
        </Button>
      )}
      {helpMenuOpen && (
        <div id="help-menu-popup" ref={popupRef} className={styles.helpMenuPopup}>
          <HelpMenuPopup />
        </div>
      )}
    </>
  );
}
