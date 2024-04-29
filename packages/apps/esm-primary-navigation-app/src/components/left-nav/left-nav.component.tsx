/** @module @category UI */
import React from 'react';
import { ExtensionSlot, getActiveAppNames, useConnectedExtensions } from '@openmrs/esm-framework/src/internal';
import type { SideNavProps } from '@carbon/react';
import { SideNav } from '@carbon/react';
import styles from './left-nav.module.scss';

type LeftNavMenuProps = SideNavProps;

const basePath = window.getOpenmrsSpaBase();
const defaultNavSlot = 'default-dashboard-slot';

export const LeftNavMenu = React.forwardRef<HTMLElement, LeftNavMenuProps>((props, ref) => {
  const currentPath = window.location ?? { pathname: '' };
  const activePages = getActiveAppNames();
  const leftNavSlot = activePages && activePages.length === 1 ? `${activePages[0]}-dashboard-slot` : undefined;
  const leftNavItems = useConnectedExtensions(leftNavSlot);
  const slotName = leftNavSlot && leftNavItems.length > 0 ? leftNavSlot : defaultNavSlot;

  return (
    <SideNav ref={ref} expanded aria-label="Left navigation" className={styles.leftNav} {...props}>
      <ExtensionSlot name="global-nav-menu-slot" />
      {slotName ? <ExtensionSlot name={slotName} state={{ basePath, currentPath }} /> : null}
    </SideNav>
  );
});
