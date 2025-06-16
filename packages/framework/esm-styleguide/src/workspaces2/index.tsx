import { createRoot } from "react-dom/client";
import { ActionMenu } from './action-menu.component';
import React, { useContext } from "react";
import { ComponentContext } from "@openmrs/esm-react-utils";
import { createGlobalStore } from "@openmrs/esm-state";

export interface WorkspaceStoreState {
  registeredGroups: Array<string>;
  openedGroup: string | null;
  openedGroupModuleName: string | null;
}

const initialState: WorkspaceStoreState = {
  registeredGroups: [],
  openedGroup: null,
  openedGroupModuleName: null,
};

export const workspace2Store = createGlobalStore('workspace', initialState);

export function renderWorkspacesAndActionMenu(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActiveWorkspacesAndActionMenu />);
  }  
}

function ActiveWorkspacesAndActionMenu() {
  const {moduleName} = useContext(ComponentContext);
  // TODO: check which workspace group is open 
  if(!moduleName) {
    return null;
  }
  
  return (
    <ComponentContext.Provider
      value={{
        featureName: 'workspaces2',
        moduleName,
      }}>
      <ActionMenu />
    </ComponentContext.Provider>
  );
}

export function launchWorkspaceGroup2(groupName: string) {
  const {moduleName} = useContext(ComponentContext);
  workspace2Store.setState(state => ({
    ...state,
    openedGroup: groupName,
    openedGroupModuleName: moduleName
  }))
}

export function closeWorkspaceGroup2() {
  workspace2Store.setState(state => ({
    ...state,
    openedGroup: null,
    openedGroupModuleName: null
  }))
}