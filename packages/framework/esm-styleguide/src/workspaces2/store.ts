import { Actions, useStoreWithActions } from "@openmrs/esm-react-utils";
import { createGlobalStore } from "@openmrs/esm-state";
import { WorkspaceGroupConfig } from "./workspace2";

export interface OpenedWindow {
  windowName: string;
  workspaces: Array<string>; // root workspace at index 0, child workspaces follow
  props: Record<string, any>;
  maximized: boolean;
  hidden: boolean;
}
export interface WorkspaceStoreState2 {
  registeredGroups: Record<string, WorkspaceGroupConfig>;
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

console.log(">>> blah");
export const workspace2Store = createGlobalStore('workspace2', initialState);


const workspace2StoreActions = {
  setWindowMaximized(state: WorkspaceStoreState2, windowName: string, maximized: boolean) {
    const openedWindowIndex = state.openedWindows.findIndex(a => a.windowName === windowName);
    const openedWindows = [...state.openedWindows];
    const currentWindow = {...openedWindows[openedWindowIndex], maximized};
    
    openedWindows[openedWindowIndex] = currentWindow;
    
    return {
      ...state,
      openedWindows,
    };
  },
  setWindowHidden(state: WorkspaceStoreState2, windowName: string, hidden: boolean) {
    const openedWindowIndex = state.openedWindows.findIndex(a => a.windowName === windowName);
    const openedWindows = [...state.openedWindows];
    const currentWindow = {...openedWindows[openedWindowIndex], hidden};
    
    openedWindows[openedWindowIndex] = currentWindow;
    
    return {
      ...state,
      openedWindows,
    };
  },
  closeWorkspace(state, workspaceName: string) {
    const openedWindowIndex = getOpenedWindowIndexByWorkspace(state, workspaceName);
    if (openedWindowIndex < 0) {
      return state; // no-op if the window does not exist
    }
    
    const window = {...state.openedWindows[openedWindowIndex]};
    const workspaceIndex = window.workspaces.findIndex((w) => w === workspaceName);
    const openedWindows = [...state.openedWindows];
    window.workspaces = window.workspaces.slice(0, workspaceIndex);
    openedWindows[openedWindowIndex] = window;
    
    return {
      ...state,
      openedWindows,
    };
  }
} satisfies Actions<WorkspaceStoreState2>;

// given a workspace name, return the window that the workspace belongs to
export function getWindowByWorkspace(storeState: WorkspaceStoreState2, workspaceName: string) {
  const {registeredGroups} = storeState;
  for(const group of Object.values(registeredGroups)) {
    for(const window of group.windows) {
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

export function useWorkspace2Store() {
  return useStoreWithActions(workspace2Store, workspace2StoreActions);
}