/** @module @category UI */
import React from 'react';
import { ExtensionSlot, getActiveAppNames, useConnectedExtensions } from '@openmrs/esm-framework/src/internal';
import type { SideNavProps } from '@carbon/react';
import { SideNav } from '@carbon/react';
import styles from './left-nav.module.scss';

type LeftNavMenuProps = SideNavProps & { leftNavSlot: string | null };

const basePath = window.getOpenmrsSpaBase();

const LeftNavMenu = React.forwardRef<HTMLElement, LeftNavMenuProps>((props, ref) => {
  const { leftNavSlot, ...remainingProps } = props;
  const currentPath = window.location ?? { pathname: '' };
  const slotName = leftNavSlot;

  return (
    <SideNav ref={ref} expanded aria-label="Left navigation" className={styles.leftNav} {...remainingProps}>
      <ExtensionSlot name="global-nav-menu-slot" />
      {slotName ? <ExtensionSlot name={slotName} state={{ basePath, currentPath }} /> : null}
    </SideNav>
  );
});

export default LeftNavMenu;
