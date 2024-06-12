import React from 'react';
import { WorkspaceOverlay } from './workspace-overlay.component';
import { WorkspaceWindow } from './workspace-window.component';
import ActionMenu from './action-menu.component';
import styles from './workspace.module.scss';
import classNames from 'classnames';

export interface WorkspaceContainerProps {
  contextKey: string;
  overlay?: boolean;
  includeSiderailAndBottomNav?: boolean;
  additionalWorkspaceProps?: object;
}

export function WorkspaceContainer({
  contextKey,
  overlay,
  includeSiderailAndBottomNav,
  additionalWorkspaceProps,
}: WorkspaceContainerProps) {
  return (
    <>
      <div
        className={
          includeSiderailAndBottomNav
            ? styles.workspaceContainerWithActionMenu
            : styles.workspaceContainerWithoutActionMenu
        }
        test-id="container"
      >
        {overlay ? (
          <WorkspaceOverlay contextKey={contextKey} additionalWorkspaceProps={additionalWorkspaceProps} />
        ) : (
          <WorkspaceWindow contextKey={contextKey} additionalWorkspaceProps={additionalWorkspaceProps} />
        )}
      </div>
      {includeSiderailAndBottomNav && <ActionMenu />}
    </>
  );
}
