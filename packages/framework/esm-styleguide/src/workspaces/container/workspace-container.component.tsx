import React from 'react';
import { WorkspaceOverlay } from './workspace-overlay.component';
import { WorkspaceWindow } from './workspace-window.component';
import ActionMenu from './action-menu.component';
import styles from './workspace.module.scss';

export interface WorkspaceContainerProps {
  contextKey: string;
  overlay?: boolean;
  showSiderailAndBottomNav?: boolean;
  additionalWorkspaceProps?: object;
}

export function WorkspaceContainer({
  contextKey,
  overlay,
  showSiderailAndBottomNav,
  additionalWorkspaceProps,
}: WorkspaceContainerProps) {
  return (
    <>
      <div
        className={
          showSiderailAndBottomNav
            ? styles.workspaceContainerWithActionMenu
            : styles.workspaceContainerWithoutActionMenu
        }
      >
        {overlay ? (
          <WorkspaceOverlay contextKey={contextKey} additionalWorkspaceProps={additionalWorkspaceProps} />
        ) : (
          <WorkspaceWindow contextKey={contextKey} additionalWorkspaceProps={additionalWorkspaceProps} />
        )}
      </div>
      {showSiderailAndBottomNav && <ActionMenu />}
    </>
  );
}
