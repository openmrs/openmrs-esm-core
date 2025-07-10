/** @module @category Workspace */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ComponentContext, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu2.module.scss';
import { useWorkspace2Store } from '../workspace2';
import { SingleExtensionSlot } from '@openmrs/esm-react-utils';

export interface ActionMenuProps {
  workspaceGroup: string;
}

export function ActionMenu({ workspaceGroup }: ActionMenuProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const initialHeight = useRef(window.innerHeight);
  const layout = useLayoutType();
  const { registeredGroupsByName, registeredWindowsByGroupName } = useWorkspace2Store();
  const group = registeredGroupsByName[workspaceGroup];

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

  const icons = registeredWindowsByGroupName[workspaceGroup].filter(window => window.icon).map(window => window.icon);

  if(icons.length === 0) {
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
        {icons.map(icon => icon && <SingleExtensionSlot key={icon} extensionId={icon} />)}
      </div>
    </aside>
  );
}

export default ActionMenu;
