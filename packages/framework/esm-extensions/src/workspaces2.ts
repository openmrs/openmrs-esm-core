import {
  type WorkspaceDefinition2,
  type WorkspaceGroupDefinition2,
  type WorkspaceWindowDefinition2,
} from '@openmrs/esm-globals';
import { createGlobalStore } from '@openmrs/esm-state';

export interface OpenedWorkspace {
  workspaceName: string;
  props: Record<string, any> | null;
  hasUnsavedChanges: boolean;
  /** Unique identifier for the workspace instance, used to track unique instances of the same workspace */
  uuid: string;
}
export interface OpenedWindow {
  windowName: string;
  /** Root workspace at index 0, child workspaces follow */
  openedWorkspaces: Array<OpenedWorkspace>;
  props: Record<string, any> | null;
  maximized: boolean;
}

export interface OpenedGroup {
  groupName: string;
  props: Record<string, any> | null;
}
export interface WorkspaceStoreState2 {
  registeredGroupsByName: Record<string, WorkspaceGroupDefinition2 & { moduleName: string }>;
  registeredWindowsByName: Record<string, WorkspaceWindowDefinition2 & { moduleName: string }>;
  registeredWorkspacesByName: Record<string, WorkspaceDefinition2 & { moduleName: string }>;
  openedGroup: OpenedGroup | null;
  /** Most recently opened window at the end of array. Each element has a unique windowName */
  openedWindows: Array<OpenedWindow>;

  /**
   * While there can be multiple openedWindows, only the most recently opened window can be
   * toggled shown or hidden, the rest are implicitly hidden.
   **/
  isMostRecentlyOpenedWindowHidden: boolean;

  workspaceTitleByWorkspaceName: Record<string, string>;
}

const initialState: WorkspaceStoreState2 = {
  registeredGroupsByName: {},
  registeredWindowsByName: {},
  registeredWorkspacesByName: {},
  openedGroup: null,
  openedWindows: [],
  workspaceTitleByWorkspaceName: {},
  isMostRecentlyOpenedWindowHidden: false,
};

export const workspace2Store = createGlobalStore<WorkspaceStoreState2>('workspace2', initialState);

/**
 * Given a workspace name, return the window that the workspace belongs to
 * @param workspaceName
 * @returns
 */
export function getWindowByWorkspaceName(workspaceName: string) {
  const { registeredWorkspacesByName, registeredWindowsByName } = workspace2Store.getState();
  const workspace = registeredWorkspacesByName[workspaceName];
  if (!workspace) {
    throw new Error(`No workspace found with name: ${workspaceName}`);
  } else {
    const workspaceWindow = registeredWindowsByName[workspace.window];
    if (!workspaceWindow) {
      throw new Error(`No workspace window found with name: ${workspace.window} for workspace: ${workspaceName}`);
    } else {
      return workspaceWindow;
    }
  }
}

/**
 * Given a window name, return the group that the window belongs to
 * @param windowName
 * @returns
 */
export function getGroupByWindowName(windowName: string) {
  const { registeredGroupsByName, registeredWindowsByName } = workspace2Store.getState();
  const workspaceWindow = registeredWindowsByName[windowName];
  if (!workspaceWindow) {
    throw new Error(`No workspace window found with name: ${windowName}`);
  } else {
    const group = registeredGroupsByName[workspaceWindow.group];
    if (!group) {
      throw new Error(`No workspace group found with name: ${workspaceWindow.group} for window: ${windowName}`);
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

export function registerWorkspaceGroups2(appName: string, workspaceGroupDefs: Array<WorkspaceGroupDefinition2>) {
  if (workspaceGroupDefs.length == 0) {
    return;
  }
  const { registeredGroupsByName } = workspace2Store.getState();
  const newRegisteredGroupsByName = { ...registeredGroupsByName };
  for (const workspaceGroupDef of workspaceGroupDefs) {
    if (newRegisteredGroupsByName[workspaceGroupDef.name]) {
      throw new Error(`Cannot register workspace group ${workspaceGroupDef.name} more than once`);
    }
    newRegisteredGroupsByName[workspaceGroupDef.name] = { ...workspaceGroupDef, moduleName: appName };
  }

  workspace2Store.setState({
    registeredGroupsByName: newRegisteredGroupsByName,
  });
}

export function registerWorkspaceWindows2(appName: string, workspaceWindowDefs: Array<WorkspaceWindowDefinition2>) {
  if (workspaceWindowDefs.length == 0) {
    return;
  }
  const { registeredWindowsByName } = workspace2Store.getState();
  const newRegisteredWindowsByName = { ...registeredWindowsByName };
  for (const windowDef of workspaceWindowDefs) {
    if (newRegisteredWindowsByName[windowDef.name]) {
      throw new Error(`Cannot register workspace window ${windowDef.name} more than once`);
    }
    const registeredWindowDef = { ...windowDef, moduleName: appName };
    newRegisteredWindowsByName[windowDef.name] = registeredWindowDef;
  }

  workspace2Store.setState({
    registeredWindowsByName: newRegisteredWindowsByName,
  });
}

export function registerWorkspaces2(moduleName: string, workspaceDefs: Array<WorkspaceDefinition2>) {
  if (workspaceDefs.length == 0) {
    return;
  }
  const { registeredWorkspacesByName } = workspace2Store.getState();
  const newRegisteredWorkspacesByName = { ...registeredWorkspacesByName };
  for (const workspaceDef of workspaceDefs) {
    if (newRegisteredWorkspacesByName[workspaceDef.name]) {
      throw new Error(`Cannot register workspace ${workspaceDef.name} more than once`);
    }
    const workspaceDefWithLoader = { ...workspaceDef, moduleName };
    newRegisteredWorkspacesByName[workspaceDef.name] = workspaceDefWithLoader;
  }

  workspace2Store.setState({
    registeredWorkspacesByName: newRegisteredWorkspacesByName,
  });
}
