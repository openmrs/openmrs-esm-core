import React from "react";
import { ComponentContext, useAssignedExtensions } from "@openmrs/esm-react-utils";
import { createRoot } from "react-dom/client";
import { ActionMenu } from './action-menu/action-menu.component';
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
  const slotName = `action-menu-${openedGroup?.groupName}-items-slot`; // TODO: refactor into function
  const actionMenuItems = useAssignedExtensions(slotName);
  
  // TODO: check which workspace group is open 
  if(!openedGroup) {
    return null;
  }

  const showMenu = actionMenuItems.length > 0;
  return (
    <>
      {openedWindows.map(window => {
        return (
          <ActiveWorkspaceWindow window={window} />
        );
      })}
      <ComponentContext.Provider
        value={{
          featureName: 'workspaces2',
          moduleName: openedGroup.groupName, // TODO?
        }}>
        {
          showMenu &&
          <ActionMenu workspaceGroup={openedGroup.groupName} />
        }
      </ComponentContext.Provider>
    </>
  );
}
