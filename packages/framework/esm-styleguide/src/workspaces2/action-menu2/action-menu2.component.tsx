/** @module @category Workspace */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ComponentContext, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu2.module.scss';
import { useWorkspace2Store } from '../workspace2';
import { SingleExtensionSlot } from '@openmrs/esm-react-utils';
import { WorkspaceWindowDefinition2 } from '@openmrs/esm-globals';

export interface ActionMenuProps {
  workspaceGroup: string;
}

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
    (window): window is (WorkspaceWindowDefinition2 & { icon: string }) => 
      window.icon !== undefined
  );

  if(windowsWithIcons.length === 0) {
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
        {windowsWithIcons.map(window => <SingleExtensionSlot key={window.icon} extensionId={window.icon} state={{windowName: window.name}} />)}
      </div>
    </aside>
  );
}

export default ActionMenu;
