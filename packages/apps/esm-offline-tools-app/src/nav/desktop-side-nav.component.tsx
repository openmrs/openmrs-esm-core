import { attach, detach, ExtensionSlot, isDesktop, useLayoutType } from '@openmrs/esm-framework';
import { SideNav } from '@carbon/react';
import React, { useEffect } from 'react';
import styles from './desktop-side-nav.styles.scss';

const DesktopSideNav: React.FC = () => {
  const layout = useLayoutType();

  useEffect(() => {
    attach('nav-menu-slot', 'offline-tools-nav-items');
    return () => detach('nav-menu-slot', 'offline-tools-nav-items');
  }, []);

  return (
    isDesktop(layout) && (
      <SideNav expanded aria-label="Menu" className={styles.link}>
        <ExtensionSlot name="nav-menu-slot" />
      </SideNav>
    )
  );
};

export default DesktopSideNav;
