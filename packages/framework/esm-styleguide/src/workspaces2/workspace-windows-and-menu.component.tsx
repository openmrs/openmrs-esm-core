import React, { useEffect } from 'react';
import { subscribeOpenmrsEvent } from '@openmrs/esm-emr-api';
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';
import { ActionMenu } from './action-menu2/action-menu2.component';
import { closeWorkspaceGroup2, useWorkspace2Store } from './workspace2';
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
  const { openedGroup, openedWindows, registeredGroupsByName, registeredWindowsByName } = useWorkspace2Store();

  useEffect(() => {
    const unsubscribe = subscribeOpenmrsEvent('before-page-changed', (pageChangedEvent) => {
      const { newPage, cancelNavigation, oldUrl, newUrl } = pageChangedEvent;

      if (!openedGroup) {
        return;
      }

      // Always close on app change - this takes precedence as a safety boundary
      if (newPage) {
        cancelNavigation(closeWorkspaceGroup2().then((isClosed) => !isClosed));
        return;
      }

      const group = registeredGroupsByName[openedGroup.groupName];
      const scopePattern = group?.scopePattern;

      // No scopePattern means no additional scope-based closing (original behavior)
      if (!scopePattern) {
        return;
      }

      if (process.env.NODE_ENV !== 'production' && !scopePattern.startsWith('^')) {
        console.warn(
          `Workspace group "${openedGroup.groupName}" has a scopePattern without a start anchor (^). ` +
            `This may cause unexpected behavior. Pattern: "${scopePattern}"`,
        );
      }

      let shouldClose = false;

      try {
        const oldPathname = new URL(oldUrl, window.location.origin).pathname;
        const newPathname = new URL(newUrl, window.location.origin).pathname;
        const regex = new RegExp(scopePattern);

        const oldMatch = oldPathname.match(regex);
        const newMatch = newPathname.match(regex);

        if (!oldMatch || !newMatch) {
          // One or both URLs don't match the pattern - close workspace
          shouldClose = true;
        } else if (oldMatch.length > 1) {
          // Has capture groups - compare captured values
          // Handle case where matches have different number of groups
          if (oldMatch.length !== newMatch.length) {
            shouldClose = true;
          } else {
            const capturesMatch = oldMatch.slice(1).every((val, i) => val === newMatch[i + 1]);
            shouldClose = !capturesMatch;
          }
        }
        // Both match with same captures (or no captures) - stay open
      } catch {
        // If URL parsing fails, close as a safety measure
        shouldClose = true;
      }

      if (shouldClose) {
        // Prompt to close the workspaces
        // should only cancel navigation if the user cancels the prompt
        cancelNavigation(closeWorkspaceGroup2().then((isClosed) => !isClosed));
      }
    });

    return unsubscribe;
  }, [openedGroup, registeredGroupsByName]);

  if (!openedGroup) {
    return null;
  }

  const group = registeredGroupsByName[openedGroup.groupName];
  const hasMaximizedWindow = openedWindows.some((window) => window.maximized);

  const { name: groupName } = group;
  const windowsWithIcons = Object.values(registeredWindowsByName)
    .filter((window): window is Required<typeof window> => window.group === groupName && window.icon !== undefined)
    .sort((a, b) => (a.order ?? Number.MAX_VALUE) - (b.order ?? Number.MAX_VALUE));
  const showActionMenu = windowsWithIcons.length > 0;

  return (
    <div
      className={classNames(styles.workspaceWindowsAndMenuContainer, {
        [styles.overlay]: group.overlay,
        [styles.hasMaximizedWindow]: hasMaximizedWindow,
      })}
    >
      <div className={styles.workspaceWindowsContainer}>
        {openedWindows.map((openedWindow) => {
          return (
            <ActiveWorkspaceWindow
              key={openedWindow.windowName}
              openedWindow={openedWindow}
              showActionMenu={showActionMenu}
            />
          );
        })}
      </div>
      {showActionMenu && <ActionMenu workspaceGroup={group} groupProps={openedGroup.props} />}
    </div>
  );
}
