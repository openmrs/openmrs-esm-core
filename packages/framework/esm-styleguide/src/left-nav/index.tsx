/** @module @category UI */
import { SideNav } from '@carbon/react';
import { ExtensionSlot, useAssignedExtensions, useExtensionSlot, useStore } from '@openmrs/esm-react-utils';
import { createGlobalStore } from '@openmrs/esm-state';
import React from 'react';
import styles from './left-nav.module.scss';

interface LeftNavStore {
  slotName: string | null;
  basePath: string;
  mode: 'normal' | 'collapsed';
}

const leftNavStore = createGlobalStore<LeftNavStore>('left-nav', {
  slotName: null,
  basePath: window.spaBase,
  mode: 'normal',
});

interface SetLeftNavParams {
  name: string;
  basePath: string;

  /**
   * In normal mode, the left nav is shown in desktop mode, and collapse into hamburger menu button in tablet mode
   * In collapsed mode, the left nav is always collapsed, regardless of desktop / tablet mode
   */
  mode?: 'normal' | 'collapsed';
}

export function setLeftNav({ name, basePath, mode }: SetLeftNavParams) {
  leftNavStore.setState({ slotName: name, basePath, mode: mode ?? 'normal' });
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
  const navMenuItems = useAssignedExtensions(slotName ?? '');

  if (props.isChildOfHeader && slotName && navMenuItems.length > 0) {
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
