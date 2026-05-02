import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@carbon/react';
import { Help } from '@carbon/react/icons';
import { useAssignedExtensions, useSession } from '@openmrs/esm-framework';
import HelpMenuPopup from './help-popup.component';
import styles from './help.styles.scss';
export default function HelpMenu() {
  const { user } = useSession();
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  // Typed as HTMLButtonElement to enable safe .contains() checks under strict mode
  const helpMenuButtonRef = useRef<HTMLButtonElement>(null);
  // Typed as HTMLDivElement to enable safe .contains() checks under strict mode
  const popupRef = useRef<HTMLDivElement>(null);
  const helpMenuItems = useAssignedExtensions('help-menu-slot');
  const toggleHelpMenu = () => {
    setHelpMenuOpen((prevState) => !prevState);
  };
  useEffect(() => {
    // Handler is registered on both mousedown and touchstart to support mouse and touch devices
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        helpMenuButtonRef.current &&
        // event.target is EventTarget | null; cast to Node | null as required by .contains()
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
