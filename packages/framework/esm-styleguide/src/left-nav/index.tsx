/** @module @category UI */
import { SideNav } from '@carbon/react';
import { ExtensionSlot, useStore } from '@openmrs/esm-react-utils';
import { createGlobalStore } from '@openmrs/esm-state';
import React from 'react';
import styles from './left-nav.module.scss';

interface LeftNavStore {
  slotName: string | null;
  basePath: string;
}

const leftNavStore = createGlobalStore<LeftNavStore>('left-nav', {
  slotName: null,
  basePath: window.spaBase,
});

export function setLeftNav({ name, basePath }) {
  leftNavStore.setState({ slotName: name, basePath });
}

export function unsetLeftNav(name) {
  if (leftNavStore.getState().slotName == name) {
    leftNavStore.setState({ slotName: null });
  }
}

export function useLeftNavStore() {
  return useStore(leftNavStore);
}
type LeftNavMenuProps = SideNavProps;

/**
 * This component renders the left nav in desktop mode. It's also used to render the same
 * nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx
 *
 * Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
 * is deprecated; it simply renders nothing.
 */
export const LeftNavMenu = React.forwardRef<HTMLElement, LeftNavMenuProps>((props, ref) => {
  const { slotName, basePath } = useLeftNavStore();
  const currentPath = window.location ?? { pathname: '' };

  if (props.isChildOfHeader) {
    return (
      <SideNav ref={ref} expanded aria-label="Left navigation" className={styles.leftNav} {...props}>
        <ExtensionSlot name="global-nav-menu-slot" />
        {slotName ? <ExtensionSlot name={slotName} state={{ basePath, currentPath }} /> : null}
      </SideNav>
    );
  } else {
    return <></>;
  }
});
