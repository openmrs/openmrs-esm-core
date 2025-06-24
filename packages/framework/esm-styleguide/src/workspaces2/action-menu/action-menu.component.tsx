/** @module @category Workspace */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ExtensionSlot, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu.module.scss';

export interface ActionMenuProps {
  workspaceGroup: string;
}

export function ActionMenu({ workspaceGroup }: ActionMenuProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const initialHeight = useRef(window.innerHeight);
  const layout = useLayoutType();

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

  const extensionSlotName = `action-menu-${workspaceGroup}-items-slot`; // TODO: refactor into function

  return (
    <aside
      className={classNames(styles.sideRail, {
        [styles.sideRailHidden]: keyboardVisible,
        [styles.sideRailVisible]: !keyboardVisible,
      })}
    >
      <div className={styles.container}>
        <ExtensionSlot className={styles.chartExtensions} name={extensionSlotName} />
      </div>
    </aside>
  );
}

export default ActionMenu;
