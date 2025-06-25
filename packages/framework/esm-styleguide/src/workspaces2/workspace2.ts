import { getOpenedWindowIndexByWorkspace, getWindowByWorkspace, workspace2Store, WorkspaceStoreState2 } from "@openmrs/esm-extensions";
import { useStoreWithActions, type Actions } from "@openmrs/esm-react-utils";

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

export function useWorkspace2Store() {
  return useStoreWithActions(workspace2Store, workspace2StoreActions);
}