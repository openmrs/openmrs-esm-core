import { getOpenedWindowIndexByWorkspace, getWindowByWorkspace, workspace2Store, WorkspaceStoreState2 } from "./store";

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
  windows: Array<WorkspaceWindowConfig>;
}

export interface WorkspaceWindowConfig {
  windowName: string;
  canHide?: boolean;
  canMaximize?: boolean;
  overlay?: boolean;
  workspaces: Array<string>;
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

workspace2Store.subscribe((state) => {
  console.log(">>> workspace2Store state changed", state);
})

export async function launchWorkspace2(workspaceName: string, props: Record<string, any>) {
  const storeState = workspace2Store.getState();
  const setState = (newState: WorkspaceStoreState2) => {
    console.log(">>> launchWorkspace2 new state", newState);
    workspace2Store.setState(newState);
  }
  
  const window = getWindowByWorkspace(storeState, workspaceName);
  if(!window) {
    throw new Error();
  }

  const {windowName} = window;
  const openedWindowIndex  = getOpenedWindowIndexByWorkspace(storeState, workspaceName);
  const isWindowAlreadyOpened = openedWindowIndex >= 0;
  if(isWindowAlreadyOpened) {
    const {workspaces, props} = storeState.openedWindows[openedWindowIndex];

    // if invoking already opened workspace with same props, then no-op
    // TODO: check that props are same
    if(workspaces[workspaces.length - 1] === workspaceName) {
      // do nothing
    } else {
      // TODO: prompt for unsaved changes
      const discardUnsavedChanges = await Promise.resolve(true);
      if(discardUnsavedChanges) {
        console.log(">>>", "discarding unsaved changes");
        // discard the openedWindows element at openedWindowIndex
        // and create a new one with the requested workspace opened
        setState({
          ...storeState,
          openedWindows: [
            {
              windowName: windowName,
              workspaces: [workspaceName],
              props,
              maximized: false,
              hidden: false
            }, 
            ...storeState.openedWindows.filter((_, i) => i !== openedWindowIndex)
          ]
        })
      }
    }
  } else {
    setState({
      ...storeState,
      openedWindows: [
        { // most recently opened action at index 0
          windowName: windowName,
          workspaces: [workspaceName], // root workspace at index 0
          props,
              maximized: false,
          hidden: false
        }, 
        ...storeState.openedWindows
      ]
    })
  }
}