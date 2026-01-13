/** @module @category UI */
import React from 'react';
import { SideNav, type SideNavProps } from '@carbon/react';
import {
  ComponentContext,
  ExtensionSlot,
  RenderIfValueIsTruthy,
  useAssignedExtensions,
  useLeftNavStore,
} from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import styles from './left-nav.module.scss';

/**
 * Extended props for the LeftNavMenu component
 */
interface LeftNavMenuProps extends SideNavProps {
  /**
   * Flag indicating if this component is a child of the header component.
   * When true, the component renders the left nav menu.
   * When false, it renders an empty fragment.
   */
  isChildOfHeader?: boolean;
}

/**
 * This component renders the left nav in desktop mode. It's also used to render the same
 * nav when the hamburger menu is clicked on in tablet mode. See side-menu-panel.component.tsx
 *
 * Use of this component by anything other than <SideMenuPanel> (where isChildOfHeader == false)
 * is deprecated; it simply renders nothing.
 */
export const LeftNavMenu = React.forwardRef<HTMLElement, LeftNavMenuProps>((props, ref) => {
  const { slotName, basePath, componentContext, state } = useLeftNavStore();
  const currentPath = window.location ?? { pathname: '' };
  const navMenuItems = useAssignedExtensions(slotName ?? '');

  if (props.isChildOfHeader && slotName && navMenuItems.length > 0) {
    return (
      <SideNav
        aria-label={getCoreTranslation('leftNavigation', 'Left navigation')}
        className={styles.leftNav}
        expanded
        ref={ref}
        {...props}
      >
        <ExtensionSlot name="global-nav-menu-slot" />
        {slotName ? (
          <RenderIfValueIsTruthy
            value={componentContext}
            fallback={<ExtensionSlot name={slotName} state={{ basePath, currentPath, ...state }} />}
          >
            <ComponentContext.Provider value={componentContext!}>
              <ExtensionSlot name={slotName} state={{ basePath, currentPath, ...state }} />
            </ComponentContext.Provider>
          </RenderIfValueIsTruthy>
        ) : null}
      </SideNav>
    );
  } else {
    return null;
  }
});
