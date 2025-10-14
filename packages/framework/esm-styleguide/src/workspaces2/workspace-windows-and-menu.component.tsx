import React from 'react';
import { createRoot } from 'react-dom/client';
import { ActionMenu } from './action-menu2/action-menu2.component';
import ActiveWorkspaceWindow from './active-workspace-window.component';
import { useWorkspace2Store } from './workspace2';
import styles from './workspace-windows-and-menu.module.scss';
import classNames from 'classnames';

export function renderWorkspaceWindowsAndMenu(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<WorkspaceWindowsAndMenu />);
  }
}

/**
 * This component renders the workspace action menu of a workspace group
 * and all the active workspace windows within that group.
 */
function WorkspaceWindowsAndMenu() {
  const { openedGroup, openedWindows, registeredGroupsByName } = useWorkspace2Store();

  if (!openedGroup) {
    return null;
  }

  const group = registeredGroupsByName[openedGroup.groupName];

  return (
    <div
      className={classNames(styles.workspaceWindowsAndMenuContainer, {
        [styles.overlay]: group.overlay,
      })}
    >
      <div className={styles.workspaceWindowsContainer}>
        {openedWindows.map((openedWindow) => {
          return <ActiveWorkspaceWindow key={openedWindow.windowName} openedWindow={openedWindow} />;
        })}
      </div>
      <ActionMenu workspaceGroup={openedGroup} />
    </div>
  );
}
