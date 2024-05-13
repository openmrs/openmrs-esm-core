/** @module @category Workspace */
import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ComponentContext, ExtensionSlot, useLayoutType } from '@openmrs/esm-react-utils';
import { useWorkspaces } from '../workspaces';
import styles from './action-menu.module.scss';

/**
 * This renders the [Siderail and Bottom Nav](https://zeroheight.com/23a080e38/p/948cf1-siderail-and-bottom-nav/b/86907e),
 * collectively known as the Action Menu. The Siderail is rendered on the right side of the screen
 * on desktop, and the Bottom Nav is rendered at the bottom of the screen on tablet or mobile.
 *
 * The action menu provides an extension slot, to which buttons are attached as extensions. The slot
 * derives its name from the `featureName` of the top-level component in which this `ActionMenu`
 * appears (feature names are generally provided in the lifecycle functions in an app's `index.ts` file).
 * The slot is named `action-menu-${featureName}-items-slot`. For the patient chart, this is
 * `action-menu-patient-chart-items-slot`.
 */
export function ActionMenu() {
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
}

export default ActionMenu;
