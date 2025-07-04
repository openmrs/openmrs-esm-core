/** @module @category Workspace */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ComponentContext, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu2.module.scss';
import { InlineLoading } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { getLoader } from '@openmrs/esm-routes';
import Parcel from 'single-spa-react/parcel';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import { useWorkspace2Store } from '../workspace2';
import { SingleExtensionSlot } from '@openmrs/esm-react-utils';

export interface ActionMenuProps {
  workspaceGroup: string;
}

export function ActionMenu({ workspaceGroup }: ActionMenuProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const initialHeight = useRef(window.innerHeight);
  const layout = useLayoutType();
  const { registeredGroups } = useWorkspace2Store();
  const group = registeredGroups[workspaceGroup];

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

  const icons = group.windows.filter(window => window.icon).map(window => window.icon);

  if(icons.length === 0) {
    return null; // No icons to display
  }

  return (
    <ComponentContext.Provider
      value={{
        featureName: 'workspaces2',
        moduleName: group.groupName, // TODO?
      }}>
      <aside
        className={classNames(styles.sideRail, {
          [styles.sideRailHidden]: keyboardVisible,
          [styles.sideRailVisible]: !keyboardVisible,
        })}
      >
        <div className={styles.container}>
          {icons.map(icon => <SingleExtensionSlot key={icon} extensionId={icon} />)}
        </div>
      </aside>
    </ComponentContext.Provider>
  );
}

export default ActionMenu;
