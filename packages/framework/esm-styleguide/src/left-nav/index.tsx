/** @module @category UI */
import React, { useContext, useEffect } from 'react';
import { SideNav, type SideNavProps } from '@carbon/react';
import {
  ComponentContext,
  ExtensionSlot,
  useAssignedExtensions,
  useLeftNavStore,
  RenderIfValueIsTruthy,
} from '@openmrs/esm-react-utils';
import styles from './left-nav.module.scss';

/**
 * This component renders the left nav in desktop mode. It's also used to render the same
 * nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx
 *
 * Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
 * is deprecated; it simply renders nothing.
 */
export const LeftNavMenu = React.forwardRef<HTMLElement, SideNavProps>((props, ref) => {
  const { slotName, basePath, componentContext } = useLeftNavStore();
  const currentPath = window.location ?? { pathname: '' };
  const navMenuItems = useAssignedExtensions(slotName ?? '');

  if (props.isChildOfHeader && slotName && navMenuItems.length > 0) {
    return (
      <SideNav ref={ref} expanded aria-label="Left navigation" className={styles.leftNav} {...props}>
        <ExtensionSlot name="global-nav-menu-slot" />
        {slotName ? (
          <RenderIfValueIsTruthy
            value={componentContext}
            fallback={<ExtensionSlot name={slotName} state={{ basePath, currentPath }} />}
          >
            <ComponentContext.Provider value={componentContext!}>
              <ExtensionSlot name={slotName} state={{ basePath, currentPath }} />
            </ComponentContext.Provider>
          </RenderIfValueIsTruthy>
        ) : null}
      </SideNav>
    );
  } else {
    return <></>;
  }
});
