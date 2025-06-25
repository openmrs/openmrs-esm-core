import { createGlobalStore } from "@openmrs/esm-state";
import { WorkspaceGroupDefinition2 } from "@openmrs/esm-globals";

export interface OpenedWindow {
  windowName: string;
  workspaces: Array<string>; // root workspace at index 0, child workspaces follow
  props: Record<string, any>;
  maximized: boolean;
  hidden: boolean;
}
export interface WorkspaceStoreState2 {
  registeredGroups: Record<string, WorkspaceGroupDefinition2>;
  openedGroup: {
    groupName: string;
    props: Record<string, any>;
  } | null;
  openedWindows: Array<OpenedWindow>; // most recently opened action at index 0, each element has a unique actionName
}

const initialState: WorkspaceStoreState2 = {
  registeredGroups: {},
  openedGroup: null,
  openedWindows: [],
};

export const workspace2Store = createGlobalStore('workspace2', initialState);


// given a workspace name, return the window that the workspace belongs to
export function getWindowByWorkspace(storeState: WorkspaceStoreState2, workspaceName: string) {
  const {registeredGroups} = storeState;
  for(const group of Object.values(registeredGroups)) {
    for(const window of group?.windows ?? []) {
      if(window.workspaces.includes(workspaceName)) {
        return window;
      }
    }
  }
  return null;
}

export function getOpenedWindowIndexByWorkspace(storeState: WorkspaceStoreState2, workspaceName: string) {
  return storeState.openedWindows.findIndex(a => a.workspaces.includes(workspaceName));
}

export function registerWorkspaceGroups2(workspaceGroupConfigs: Array<WorkspaceGroupDefinition2>) {
  const map : Record<string, WorkspaceGroupDefinition2> = {};
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