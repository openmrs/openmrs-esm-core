import React from 'react';
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';
import { ActionMenu } from './action-menu2/action-menu2.component';
import { useWorkspace2Store } from './workspace2';
import ActiveWorkspaceWindow from './active-workspace-window.component';
import styles from './workspace-windows-and-menu.module.scss';

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
  const hasMaximizedWindow = openedWindows.some((window) => window.maximized);

  return (
    <div
      className={classNames(styles.workspaceWindowsAndMenuContainer, {
        [styles.overlay]: group.overlay,
        [styles.hasMaximizedWindow]: hasMaximizedWindow,
      })}
    >
      <div className={styles.workspaceWindowsContainer}>
        {openedWindows.map((openedWindow) => {
          return <ActiveWorkspaceWindow key={openedWindow.windowName} openedWindow={openedWindow} />;
        })}
      </div>
      <ActionMenu workspaceGroup={group} groupProps={openedGroup.props} />
    </div>
  );
}
