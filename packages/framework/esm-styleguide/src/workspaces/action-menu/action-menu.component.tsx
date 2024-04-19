import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ExtensionSlot, useLayoutType, useWorkspaces } from '@openmrs/esm-framework';
import styles from './action-menu.module.scss';
import { ComponentContext } from '@openmrs/esm-react-utils';

interface ActionMenuInterface {}

export const ActionMenu: React.FC<ActionMenuInterface> = () => {
  const { active, workspaceWindowState } = useWorkspaces();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const initialHeight = useRef(window.innerHeight);
  const { featureName } = useContext(ComponentContext);

  const isTablet = useLayoutType() === 'tablet';
  const isPhone = useLayoutType() === 'phone';

  useEffect(() => {
    const handleKeyboardVisibilityChange = () => {
      setKeyboardVisible(initialHeight.current > window.innerHeight);
      if (initialHeight.current != window.innerHeight) {
        initialHeight.current = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleKeyboardVisibilityChange);
    return () => window.removeEventListener('resize', handleKeyboardVisibilityChange);
  }, [initialHeight]);

  if (active && workspaceWindowState !== 'hidden' && (isTablet || isPhone)) {
    return null;
  }

  return (
    <aside
      className={classNames(styles.sideRail, {
        [styles.hiddenSideRail]: keyboardVisible,
        [styles.showSideRail]: !keyboardVisible,
      })}
    >
      <div className={styles.container}>
        <ExtensionSlot className={styles.chartExtensions} name={`action-menu-${featureName}-items-slot`} />
      </div>
    </aside>
  );
};

export default ActionMenu;
