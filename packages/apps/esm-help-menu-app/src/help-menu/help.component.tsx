import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@carbon/react';
import { Help } from '@carbon/react/icons';
import { useAssignedExtensions, useSession } from '@openmrs/esm-framework';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.scss';

export default function HelpMenu() {
  const { user } = useSession();
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const helpMenuButtonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const helpMenuItems = useAssignedExtensions('help-menu-slot');

  const toggleHelpMenu = () => {
    setHelpMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        helpMenuButtonRef.current &&
        !helpMenuButtonRef.current.contains(event.target as Node | null) &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node | null)
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

  if (helpMenuItems.length === 0) {
    return null;
  }

  return (
    <>
      {user && (
        <Button
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
