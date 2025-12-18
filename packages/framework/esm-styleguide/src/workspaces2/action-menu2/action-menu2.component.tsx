/** @module @category Workspace */
import React from 'react';
import Parcel from 'single-spa-react/parcel';
import { IconButton } from '@carbon/react';
import { mountRootParcel } from 'single-spa';
import { loadLifeCycles } from '@openmrs/esm-routes';
import { isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { type WorkspaceGroupDefinition2 } from '@openmrs/esm-globals';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { closeWorkspaceGroup2, useWorkspace2Store } from '../workspace2';
import { CloseIcon } from '../../icons';
import styles from './action-menu2.module.scss';

export interface ActionMenuProps {
  workspaceGroup: WorkspaceGroupDefinition2;
  groupProps: Record<string, any> | null;
}

/**
 * This component renders the action menu (right nav on desktop, bottom on mobile)
 * for a workspace group. The action menu is only rendered when at least one
 * window in the workspace group has an icon defined.
 */
export function ActionMenu({ workspaceGroup, groupProps }: ActionMenuProps) {
  const { registeredWindowsByName } = useWorkspace2Store();
  const layout = useLayoutType();
  const { name: groupName, persistence } = workspaceGroup;

  const windowsWithIcons = Object.values(registeredWindowsByName)
    .filter((window): window is Required<typeof window> => window.group === groupName && window.icon !== undefined)
    .sort((a, b) => (a.order ?? Number.MAX_VALUE) - (b.order ?? Number.MAX_VALUE));

  if (windowsWithIcons.length === 0) {
    return null; // No icons to display
  }
  const isClosable = persistence == 'closable';

  return (
    <aside className={styles.sideRail}>
      <div className={styles.container}>
        {isClosable && isDesktop(layout) && (
          <IconButton
            align="left"
            onClick={() => closeWorkspaceGroup2()}
            label={getCoreTranslation('close')}
            kind="ghost"
          >
            <CloseIcon />
          </IconButton>
        )}
        {windowsWithIcons.map((window) => (
          <Parcel
            key={window.icon}
            config={() => loadLifeCycles(window.moduleName, window.icon)}
            mountParcel={mountRootParcel}
            windowName={window.name}
            groupProps={groupProps}
          />
        ))}
      </div>
      {isClosable && !isDesktop(layout) && (
        <IconButton
          align="left"
          onClick={() => closeWorkspaceGroup2()}
          label={getCoreTranslation('close')}
          kind="ghost"
        >
          <CloseIcon />
        </IconButton>
      )}
    </aside>
  );
}

export default ActionMenu;
