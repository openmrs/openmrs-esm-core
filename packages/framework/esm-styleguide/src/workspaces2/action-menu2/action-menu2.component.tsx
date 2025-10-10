/** @module @category Workspace */
import React from 'react';
import { mountRootParcel } from 'single-spa';
import { loadLifeCycles } from '@openmrs/esm-routes';
import Parcel from 'single-spa-react/parcel';
import { useWorkspace2Store } from '../workspace2';
import styles from './action-menu2.module.scss';
import { type OpenedGroup } from '@openmrs/esm-extensions';

export interface ActionMenuProps {
  workspaceGroup: OpenedGroup;
}

/**
 * This component renders the action menu (right nav on desktop, bottom on mobile)
 * for a workspace group. The action menu is only rendered when at least one
 * window in the workspace group has an icon defined.
 */
export function ActionMenu({ workspaceGroup }: ActionMenuProps) {
  const { registeredWindowsByName } = useWorkspace2Store();
  const {groupName, props} = workspaceGroup;

  const windowsWithIcons = Object.values(registeredWindowsByName)
    .filter((window): window is Required<typeof window> => window.group === groupName && window.icon !== undefined)
    .sort((a, b) => (a.order ?? Number.MAX_VALUE) - (b.order ?? Number.MAX_VALUE));

  if (windowsWithIcons.length === 0) {
    return null; // No icons to display
  }

  return (
    <aside className={styles.sideRail}>
      <div className={styles.container}>
        {windowsWithIcons.map((window) => (
          <Parcel
            key={window.icon}
            config={() => loadLifeCycles(window.moduleName, window.icon)}
            mountParcel={mountRootParcel}
            windowName={window.name}
            groupProps={props}
          />
        ))}
      </div>
    </aside>
  );
}

export default ActionMenu;
