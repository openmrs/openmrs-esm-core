/** @module @category UI */
import React from 'react';
import { ExtensionSlot, useStore, leftNavStore } from '@openmrs/esm-framework/src/internal';
import type { SideNavProps } from '@carbon/react';
import { SideNav } from '@carbon/react';
import styles from './left-nav.module.scss';

type LeftNavMenuProps = SideNavProps;

export const LeftNavMenu = React.forwardRef<HTMLElement, LeftNavMenuProps>((props, ref) => {
  const { slotName, basePath } = useStore(leftNavStore);
  const currentPath = window.location ?? { pathname: '' };

  return (
    <SideNav ref={ref} expanded aria-label="Left navigation" className={styles.leftNav} {...props}>
      <ExtensionSlot name="global-nav-menu-slot" />
      {slotName ? <ExtensionSlot name={slotName} state={{ basePath, currentPath }} /> : null}
    </SideNav>
  );
});
