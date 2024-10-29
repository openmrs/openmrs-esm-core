/** @module @category Workspace */
import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ComponentContext, ExtensionSlot, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu.module.scss';

export interface ActionMenuProps {
  isWithinWorkspace?: boolean;
  name?: string;
  actionMenuProps?: Record<string, unknown>;
}

export function ActionMenu({ isWithinWorkspace, name, actionMenuProps = {} }: ActionMenuProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const initialHeight = useRef(window.innerHeight);
  const { featureName } = useContext(ComponentContext);
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

  const extensionSlotName = `action-menu-${name && name != 'default' ? name : featureName}-items-slot`;

  return (
    <aside
      className={classNames(styles.sideRail, {
        [styles.withinWorkspace]: isWithinWorkspace,
        [styles.sideRailHidden]: keyboardVisible,
        [styles.sideRailVisible]: !keyboardVisible,
      })}
    >
      <div className={styles.container}>
        <ExtensionSlot className={styles.chartExtensions} name={extensionSlotName} state={actionMenuProps} />
      </div>
    </aside>
  );
}

export default ActionMenu;
