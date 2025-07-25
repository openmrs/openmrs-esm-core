import { type WorkspaceDefinition2, type WorkspaceGroupDefinition2, type WorkspaceWindowDefinition2 } from '@openmrs/esm-globals';
import { createGlobalStore } from '@openmrs/esm-state';

export interface OpenedWorkspace {
  workspaceName: string;
  props: Record<string, any> | null;
  hasUnsavedChanges: boolean;
  uuid: string; // unique identifier for the workspace instance, used to track unique instances of the same workspace
}
export interface OpenedWindow {
  windowName: string;
  openedWorkspaces: Array<OpenedWorkspace>; // root workspace at index 0, child workspaces follow
  props: Record<string, any> | null;
  maximized: boolean;
  hidden: boolean;
}
export interface WorkspaceStoreState2 {
  registeredGroupsByName: Record<string, WorkspaceGroupDefinition2>;
  registeredWindowsByName: Record<string, WorkspaceWindowDefinition2 & { moduleName: string }>;
  registeredWorkspacesByName: Record<string, WorkspaceDefinition2 & { moduleName: string }>;
  registeredWindowsByGroupName: Record<string, Array<WorkspaceWindowDefinition2 & { moduleName: string }>>;
  registeredWorkspacesByWindowName: Record<string, Array<WorkspaceDefinition2>>;
  openedGroup: {
    groupName: string;
    props: Record<string, any> | null;
  } | null;
  openedWindows: Array<OpenedWindow>; // most recently opened action at the end of array, each element has a unique windowName

  workspaceTitleByWorkspaceName: Record<string, string>;
}

const initialState: WorkspaceStoreState2 = {
  registeredGroupsByName: {},
  registeredWindowsByName: {},
  registeredWorkspacesByName: {},
  registeredWindowsByGroupName: {},
  registeredWorkspacesByWindowName: {},
  openedGroup: null,
  openedWindows: [],
  workspaceTitleByWorkspaceName: {},
};

export const workspace2Store = createGlobalStore('workspace2', initialState);

// given a workspace name, return the window that the workspace belongs to
export function getWindowByWorkspaceName(workspaceName: string) {
  const { registeredWorkspacesByName, registeredWindowsByName } = workspace2Store.getState();
  const workspace = registeredWorkspacesByName[workspaceName];
  if (!workspace) {
    return new Error(`No workspace found with name: ${workspaceName}`);
  } else {
    const window = registeredWindowsByName[workspace.window];
    if (!window) {
      return new Error(`No workspace window found with name: ${workspace.window} for workspace: ${workspaceName}`);
    } else {
      return window;
    }
  }
}

// given a window name, return the group that the window belongs to
export function getGroupByWindowName(windowName: string) {
  const { registeredGroupsByName, registeredWindowsByName } = workspace2Store.getState();
  const window = registeredWindowsByName[windowName];
  if (!window) {
    return new Error(`No workspace window found with name: ${windowName}`);
  } else {
    const group = registeredGroupsByName[window.group];
    if (!group) {
      return new Error(`No workspace group found with name: ${window.group} for window: ${windowName}`);
    } else {
      return group;
    }
  }
}

export function getOpenedWindowIndexByWorkspace(workspaceName: string) {
  const { openedWindows } = workspace2Store.getState();
  return openedWindows.findIndex((a) =>
    a.openedWorkspaces.find((openedWorkspace) => openedWorkspace.workspaceName === workspaceName),
  );
}

export function registerWorkspaceGroups2(workspaceGroupDefs: Array<WorkspaceGroupDefinition2>) {
  if (workspaceGroupDefs.length == 0) {
    return;
  }
  const { registeredGroupsByName } = workspace2Store.getState();
  const newRegisteredGroupsByName = { ...registeredGroupsByName };
  for (const workspaceGroupDef of workspaceGroupDefs) {
    if (newRegisteredGroupsByName[workspaceGroupDef.name]) {
      throw new Error(`Cannot register workspace group ${workspaceGroupDef.name} more than once`);
    }
    newRegisteredGroupsByName[workspaceGroupDef.name] = workspaceGroupDef;
  }

  workspace2Store.setState({
    registeredGroupsByName: newRegisteredGroupsByName,
  });
}

export function registerWorkspaceWindows2(appName: string, workspaceWindowDefs: Array<WorkspaceWindowDefinition2>) {
  if (workspaceWindowDefs.length == 0) {
    return;
  }
  const { registeredWindowsByGroupName, registeredWindowsByName } = workspace2Store.getState();
  const newRegisteredWindowsByName = { ...registeredWindowsByName };
  const newRegisteredWindowsByGroupName = { ...registeredWindowsByGroupName };
  for (const windowDef of workspaceWindowDefs) {
    if (newRegisteredWindowsByName[windowDef.name]) {
      throw new Error(`Cannot register workspace window ${windowDef.name} more than once`);
    }
    const registeredWindowDef = { ...windowDef, moduleName: appName };
    newRegisteredWindowsByName[windowDef.name] = registeredWindowDef;
    if (!newRegisteredWindowsByGroupName[windowDef.group]) {
      newRegisteredWindowsByGroupName[windowDef.group] = [];
    }
    newRegisteredWindowsByGroupName[windowDef.group].push(registeredWindowDef);
  }

  workspace2Store.setState({
    registeredWindowsByName: newRegisteredWindowsByName,
    registeredWindowsByGroupName: newRegisteredWindowsByGroupName,
  });
}

export function registerWorkspaces2(moduleName: string, workspaceDef: Array<WorkspaceDefinition2>) {
  if (workspaceDef.length == 0) {
    return;
  }
  const { registeredWorkspacesByName, registeredWorkspacesByWindowName } = workspace2Store.getState();
  const newRegisteredWorkspacesByName = { ...registeredWorkspacesByName };
  const newRegisteredWorkspacesByWindowName = { ...registeredWorkspacesByWindowName };
  for (const workspaceConfig of workspaceDef) {
    if (newRegisteredWorkspacesByName[workspaceConfig.name]) {
      throw new Error(`Cannot register workspace ${workspaceConfig.name} more than once`);
    }
    const workspaceConfigWithLoader = { ...workspaceConfig, moduleName };
    newRegisteredWorkspacesByName[workspaceConfig.name] = workspaceConfigWithLoader;
    if (!newRegisteredWorkspacesByWindowName[workspaceConfig.window]) {
      newRegisteredWorkspacesByWindowName[workspaceConfig.window] = [];
    }
    newRegisteredWorkspacesByWindowName[workspaceConfig.window].push(workspaceConfigWithLoader);
  }

  workspace2Store.setState({
    registeredWorkspacesByName: newRegisteredWorkspacesByName,
    registeredWorkspacesByWindowName: newRegisteredWorkspacesByWindowName,
  });
}
