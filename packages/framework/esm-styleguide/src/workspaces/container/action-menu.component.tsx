/** @module @category Workspace */
import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ComponentContext, ExtensionSlot, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu.module.scss';

/**
 * @deprecated Use `WorkspaceContainer` instead
 */
export function ActionMenu() {
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

  return (
    <aside
      className={classNames(styles.sideRail, {
        [styles.sideRailHidden]: keyboardVisible,
        [styles.sideRailVisible]: !keyboardVisible,
      })}
    >
      <div className={styles.container}>
        <ExtensionSlot className={styles.chartExtensions} name={`action-menu-${featureName}-items-slot`} />
      </div>
    </aside>
  );
}

export default ActionMenu;
