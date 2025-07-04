import React from "react";
import { createRoot } from "react-dom/client";
import { ActionMenu } from './action-menu2/action-menu2.component';
import ActiveWorkspaceWindow from "./active-workspace-window.component";
import { useWorkspace2Store } from "./workspace2";

export function renderWorkspaceWindowsAndMenu(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<WorkspaceWindowsAndMenu />);
  }  
}

function WorkspaceWindowsAndMenu() {
  const {openedGroup, openedWindows} = useWorkspace2Store();
  
  // TODO: check which workspace group is open 
  if(!openedGroup) {
    return null;
  }

  return (
    <>
      {openedWindows.map(window => {
        return (
          <ActiveWorkspaceWindow window={window} />
        );
      })}
      <ActionMenu workspaceGroup={openedGroup.groupName} />
    </>
  );
}
