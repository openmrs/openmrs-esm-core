import { WorkspaceDefinition2, WorkspaceGroupDefinition2, WorkspaceWindowDefinition2 } from "@openmrs/esm-globals";
import { createGlobalStore } from "@openmrs/esm-state";

export interface OpenedWindow {
  windowName: string;
  workspaces: Array<string>; // root workspace at index 0, child workspaces follow
  props: Record<string, any>;
  maximized: boolean;
  hidden: boolean;
}
export interface WorkspaceStoreState2 {
  registeredGroupsByName: Record<string, WorkspaceGroupDefinition2>;
  registeredWindowsByName: Record<string, WorkspaceWindowDefinition2>; 
  registeredWorkspacesByName: Record<string, WorkspaceDefinition2>;
  registeredWindowsByGroupName: Record<string, Array<WorkspaceWindowDefinition2>>;
  registeredWorkspacesByWindowName: Record<string, Array<WorkspaceDefinition2>>;
  openedGroup: {
    groupName: string;
    props: Record<string, any>;
  } | null;
  openedWindows: Array<OpenedWindow>; // most recently opened action at the end of array, each element has a unique actionName
}

const initialState: WorkspaceStoreState2 = {
  registeredGroupsByName: {},
  registeredWindowsByName: {}, 
  registeredWorkspacesByName: {},
  registeredWindowsByGroupName: {},
  registeredWorkspacesByWindowName: {},
  openedGroup: null,
  openedWindows: [],
};

export const workspace2Store = createGlobalStore('workspace2', initialState);


// given a workspace name, return the window that the workspace belongs to
export function getWindowByWorkspaceName(workspaceName: string) {

  const {registeredWorkspacesByName, registeredWindowsByName} = workspace2Store.getState();
  const workspace = registeredWorkspacesByName[workspaceName];
  if(!workspace) {
    return new Error(`No workspace found with name: ${workspaceName}`);
  } else {
    const window = registeredWindowsByName[workspace.window];
    if(!window) {
      return new Error(`No workspace window found with name: ${workspace.window} for workspace: ${workspaceName}`);
    } else {
      return window;
    }
  }
}

// given a window name, return the group that the window belongs to
export function getGroupByWindowName(windowName: string) {
  const {registeredGroupsByName, registeredWindowsByName} = workspace2Store.getState();
  const window = registeredWindowsByName[windowName];
  if(!window) {
    return new Error(`No workspace window found with name: ${windowName}`);
  } else {
    const group = registeredGroupsByName[window.group];
    if(!group) {
      return new Error(`No workspace group found with name: ${window.group} for window: ${windowName}`);
    } else {
      return group;
    }
  }
}

export function getOpenedWindowIndexByWorkspace(workspaceName: string) {
  const {openedWindows} = workspace2Store.getState();
  return openedWindows.findIndex(a => a.workspaces.includes(workspaceName));
}

export function registerWorkspaceGroups2(workspaceGroupConfigs: Array<WorkspaceGroupDefinition2>) {
  const {registeredGroupsByName} = workspace2Store.getState();
  const newRegisteredGroupsByName = {...registeredGroupsByName}
  for(const config of workspaceGroupConfigs) {
    newRegisteredGroupsByName[config.name] = config;
  }

  workspace2Store.setState({
    registeredGroupsByName: newRegisteredGroupsByName,
  });
}

export function registerWorkspaceWindows2(workspaceWindowConfigs: Array<WorkspaceWindowDefinition2>) {
  const {registeredWindowsByGroupName, registeredWindowsByName} = workspace2Store.getState();
  const newRegisteredWindowsByName = {...registeredWindowsByName};
  const newRegisteredWindowsByGroupName = {...registeredWindowsByGroupName};
  for(const config of workspaceWindowConfigs) {
    newRegisteredWindowsByName[config.name] = config;
    if(!newRegisteredWindowsByGroupName[config.group]) {
      newRegisteredWindowsByGroupName[config.group] = [];
    }
    newRegisteredWindowsByGroupName[config.group].push(config);
  }

  workspace2Store.setState({
    registeredWindowsByName: newRegisteredWindowsByName,
    registeredWindowsByGroupName: newRegisteredWindowsByGroupName,
  });
}

export function registerWorkspaces2(workspaceConfigs: Array<WorkspaceDefinition2>) {
  const {registeredWorkspacesByName, registeredWorkspacesByWindowName} = workspace2Store.getState();
  const newRegisteredWorkspacesByName = {...registeredWorkspacesByName};
  const newRegisteredWorkspacesByWindowName = {...registeredWorkspacesByWindowName};
  for(const config of workspaceConfigs) {
    newRegisteredWorkspacesByName[config.name] = config;
    if(!newRegisteredWorkspacesByWindowName[config.window]) {
      newRegisteredWorkspacesByWindowName[config.window] = [];
    }
    newRegisteredWorkspacesByWindowName[config.window].push(config);
  }

  workspace2Store.setState({
    registeredWorkspacesByName: newRegisteredWorkspacesByName,
    registeredWorkspacesByWindowName: newRegisteredWorkspacesByWindowName,
  });
}