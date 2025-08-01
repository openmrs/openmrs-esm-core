import React from 'react';
import { createRoot } from 'react-dom/client';
import { ActionMenu } from './action-menu2/action-menu2.component';
import ActiveWorkspaceWindow from './active-workspace-window.component';
import { useWorkspace2Store } from './workspace2';
import styles from './workspace-windows-and-menu.module.scss';

export function renderWorkspaceWindowsAndMenu(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<WorkspaceWindowsAndMenu />);
  }
}

/**
 * This comoponent renders the workspace action menu of a workspace group
 * and all the active workspace windows within that group.
 */
function WorkspaceWindowsAndMenu() {
  const { openedGroup, openedWindows } = useWorkspace2Store();

  if (!openedGroup) {
    return null;
  }

  return (
    <>
      <div className={styles.workspaceWindowsContainer}>
        {openedWindows.map((openedWindow) => {
          return <ActiveWorkspaceWindow key={openedWindow.windowName} openedWindow={openedWindow} />;
        })}
      </div>
      <ActionMenu workspaceGroup={openedGroup.groupName} />
    </>
  );
}
