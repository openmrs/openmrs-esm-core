import { createRoot } from "react-dom/client";
import { ActionMenu } from './action-menu/action-menu.component';
import React from "react";
import { ComponentContext, useAssignedExtensions, useStore } from "@openmrs/esm-react-utils";
import { createGlobalStore } from "@openmrs/esm-state";

export interface WorkspaceStoreState2 {
  registeredGroups: Record<string, WorkspaceGroupConfig>;
  openedGroup: {
    groupName: string;
    props: Record<string, any>;
  } | null;
  openedActions: Array<{ // most recently opened action at index 0, each element has a unique actionName
    actionName: string;
    workspaces: Array<string>; // root workspace at index 0, child workspaces follow
    props: Record<string, any>;
  }>;
}

const initialState: WorkspaceStoreState2 = {
  registeredGroups: {},
  openedGroup: null,
  openedActions: [],
};

export const workspace2Store = createGlobalStore('workspace2', initialState);

export function renderWorkspacesAndActionMenu(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActiveWorkspacesAndActionMenu />);
  }  
}

export function useWorkspace2Store() {
  return useStore(workspace2Store);
}

function ActiveWorkspacesAndActionMenu() {
  const {openedGroup} = useWorkspace2Store();
  const slotName = `action-menu-${openedGroup?.groupName}-items-slot`; // TODO: refactor into function
  const actionMenuItems = useAssignedExtensions(slotName);
  
  // TODO: check which workspace group is open 
  if(!openedGroup || actionMenuItems.length === 0) {
    return null;
  }

  return (
    <ComponentContext.Provider
      value={{
        featureName: 'workspaces2',
        moduleName: 'workspaces2', // TODO?
      }}>
      <ActionMenu workspaceGroup={openedGroup.groupName} />
    </ComponentContext.Provider>
  );
}

export function launchWorkspaceGroup2(groupName: string, props?: Record<string, any>) {
  workspace2Store.setState(state => ({
    ...state,
    openedGroup: {
      groupName,
      props: props ?? {}
    },
  }))
}

export function closeWorkspaceGroup2() {
  workspace2Store.setState(state => ({
    ...state,
    openedGroup: null,
    openedGroupModuleName: null
  }))
}

export interface WorkspaceGroupConfig {
  groupName: string;
  actions: Array<{
    actionName: string;
    canHide: boolean;
    workspaces: Array<string>;
  }>;
}

export function registerWorkspaceGroups(workspaceGroupConfigs: Array<WorkspaceGroupConfig>) {
  const map : Record<string, WorkspaceGroupConfig> = {};
  for(const config of workspaceGroupConfigs) {
    map[config.groupName] = config;
  }
  // TODO: verify
  workspace2Store.setState(state => ({
    ...state,
    registeredGroups: {
      ...state.registeredGroups,
      ...map
    }
  }));
}

// given a workspace name, return the action that the workspace belongs to
function getWorkspaceActionName(workspaceName: string, workspaceState: WorkspaceStoreState2) {
  const {registeredGroups} = workspaceState;
  for(const group of Object.values(registeredGroups)) {
    for(const action of group.actions) {
      if(action.workspaces.includes(workspaceName)) {
        return action.actionName;
      }
    }
  }
  return null;
}

export async function launchWorkspace2(workspaceName: string, props: Record<string, any>) {
  const workspaceState = workspace2Store.getState();
  const setState = (newState: WorkspaceStoreState2) => {
    console.log(">>> launchWorkspace2 new state", newState);
    workspace2Store.setState(newState);
  }
  
  const actionName = getWorkspaceActionName(workspaceName, workspaceState);
  if(!actionName) {
    throw new Error();
  }
  const openedActionIndex  = workspaceState.openedActions.findIndex(a => a.actionName == actionName);
  if(openedActionIndex >= 0) {
    const {workspaces, props} = workspaceState.openedActions[openedActionIndex];

    // if invoking already opened workspace with same props, then no-op
    // TODO: check that props are same
    if(workspaces[workspaces.length - 1] === workspaceName) {
      // do nothing
    } else {
      // TODO: prompt for unsaved changes
      const discardUnsavedChanges = await Promise.resolve(true);
      if(discardUnsavedChanges) {
        console.log(">>>", "discarding unsaved changes");
        // discard the openedAction element corresponding to actionName
        // and create a new one with the requested workspace opened
        setState({
          ...workspaceState,
          openedActions: [
            {
              actionName,
              workspaces: [workspaceName],
              props,
            }, 
            ...workspaceState.openedActions.filter((_, i) => i !== openedActionIndex)
          ]
        })
      }
    }
  } else {
    setState({
      ...workspaceState,
      openedActions: [
        { // most recently opened action at index 0
          actionName,
          workspaces: [workspaceName], // root workspace at index 0
          props,
        }, 
        ...workspaceState.openedActions
      ]
    })
  }
}