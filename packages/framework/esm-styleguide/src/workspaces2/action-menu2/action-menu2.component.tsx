/** @module @category Workspace */
import React from 'react';
import { IconButton } from '@carbon/react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { ComponentContext, isDesktop, useLayoutType } from '@openmrs/esm-react-utils';
import { type WorkspaceGroupDefinition2 } from '@openmrs/esm-globals';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { closeWorkspaceGroup2 } from '../workspace2';
import { CloseIcon } from '../../icons';
import styles from './action-menu2.module.scss';

export interface ActionMenuProps {
  workspaceGroup: WorkspaceGroupDefinition2 & { moduleName: string };
  groupProps: Record<string, any> | null;
}

/**
 * This component renders the action menu (right nav on desktop, bottom on mobile)
 * for a workspace group. The action menu is only rendered when at least one
 * window in the workspace group has an icon defined.
 */
export function ActionMenu({ workspaceGroup, groupProps }: ActionMenuProps) {
  const layout = useLayoutType();
  const { persistence } = workspaceGroup;

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
        <ComponentContext.Provider
          value={{
            moduleName: workspaceGroup.moduleName,
            featureName: workspaceGroup.name,
          }}
        >
          <ExtensionSlot className={styles.container} name={workspaceGroup.name} state={{ groupProps }} />
        </ComponentContext.Provider>
      </div>
    </aside>
  );
}

export default ActionMenu;
