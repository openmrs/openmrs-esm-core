/** @module @category Workspace */
import React, { useEffect, useRef, useState } from 'react';
import { type WorkspaceWindowDefinition2 } from '@openmrs/esm-globals';
import { loadLifeCycles } from '@openmrs/esm-routes';
import { isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import classNames from 'classnames';
import { mountRootParcel } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { useWorkspace2Store } from '../workspace2';
import styles from './action-menu2.module.scss';

export interface ActionMenuProps {
  workspaceGroup: string;
}

/**
 * This component renders the action menu (right nav on desktop, bottom on mobile)
 * for a workspace group. The action menu is only rendered when at least one
 * window in the workspace group has an icon defined.
 */
export function ActionMenu({ workspaceGroup }: ActionMenuProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const initialHeight = useRef(window.innerHeight);
  const layout = useLayoutType();
  const { registeredWindowsByGroupName } = useWorkspace2Store();

  useEffect(() => {
    const handleKeyboardVisibilityChange = () => {
      setKeyboardVisible(!isDesktop(layout) && initialHeight.current > window.innerHeight);
      if (initialHeight.current != window.innerHeight) {
        initialHeight.current = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleKeyboardVisibilityChange);
    return () => window.removeEventListener('resize', handleKeyboardVisibilityChange);
  }, [initialHeight]);

  const windowsWithIcons = registeredWindowsByGroupName[workspaceGroup].filter(
    (window): window is Required<typeof window> => window.icon !== undefined,
  );

  if (windowsWithIcons.length === 0) {
    return null; // No icons to display
  }

  return (
    <aside
      className={classNames(styles.sideRail, {
        [styles.sideRailHidden]: keyboardVisible,
        [styles.sideRailVisible]: !keyboardVisible,
      })}
    >
      <div className={styles.container}>
        {windowsWithIcons.map((window) => (
          <Parcel
            key={window.icon}
            config={() => loadLifeCycles(window.moduleName, window.icon)}
            mountParcel={mountRootParcel}
            windowName={window.name}
          />
        ))}
      </div>
    </aside>
  );
}

export default ActionMenu;
