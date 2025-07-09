import { getGroupByWindowName, getOpenedWindowIndexByWorkspace, getWindowByWorkspaceName, workspace2Store, WorkspaceStoreState2 } from "@openmrs/esm-extensions";
import { useStoreWithActions, type Actions } from "@openmrs/esm-react-utils";

export async function launchWorkspaceGroup2<GroupProps extends Record<string, any>>(groupName: string, groupProps: GroupProps) {
  const {openedGroup} = workspace2Store.getState();
  if(openedGroup && (openedGroup.groupName !== groupName || !areEqualShallow(openedGroup.props, groupProps))) {
    // prompt for unsaved changes with better UI
    const discardUnsavedChanges = await confirm("Yo, switch group context?");
    if(!discardUnsavedChanges) {
      return; 
    }
  }

  workspace2Store.setState(state => ({
    ...state,
    openedGroup: {
      groupName,
      props: groupProps ?? {}
    },
    openedWindows: []
  }))
}

export async function closeWorkspaceGroup2() {
  const state = workspace2Store.getState();
  const {openedGroup, openedWindows} = state;
  if(openedGroup) {

    if(openedWindows.length > 0) {
      // prompt for unsaved changes with better UI
      const discardUnsavedChanges = await confirm("Yo, close group?");
      if(!discardUnsavedChanges) {
        return;
      }
    }
    workspace2Store.setState(state => ({
      ...state,
      openedGroup: null,
      openedWindows: []
    }))
  }
}

workspace2Store.subscribe((state) => {
  console.log(">>> workspace2Store state changed", state);
})

export async function launchWorkspace2<
    GroupProp extends Record<string, any>,
    WindowProps extends Record<string, any>>(workspaceName: string, groupProps: GroupProp, windowProps: WindowProps) {
  const storeState = workspace2Store.getState();
  
  const window = getWindowByWorkspaceName(workspaceName);
  if(!window) {
    throw new Error();
  }

  const {openedGroup} = storeState;
  const {name: windowName} = window;
  const group = getGroupByWindowName(windowName);
  if(!group) {
    throw new Error();
  }

  const openedWindowIndex  = getOpenedWindowIndexByWorkspace(workspaceName);
  const isWindowAlreadyOpened = openedWindowIndex >= 0;

  // if current opened group is not the same as the requested group, or if the group props are different, then prompt for unsaved changes
  if(openedGroup && (openedGroup.groupName !== group?.name || !areEqualShallow(openedGroup.props, groupProps))) {
    // prompt for unsaved changes with better UI
    const discardUnsavedChanges = await confirm("Yo, switch group context?");
    if(discardUnsavedChanges) {
      workspace2Store.setState({
      ...storeState,
      openedGroup: {
        groupName: group.name,
        props: groupProps
      },
      openedWindows: [
        // discard all opened windows, open a new one with the requested workspace
        // most recently opened action appended to the end
        {
          windowName: windowName,
          workspaces: [workspaceName], // root workspace at index 0
          props: windowProps,
          maximized: false,
          hidden: false
        },
      ]
    })
    }
  }
  else if(isWindowAlreadyOpened) {
    const groupProps = storeState.openedGroup?.props ?? {};
    const {workspaces, props: currentWindowProps} = storeState.openedWindows[openedWindowIndex];

    // if invoking already opened workspace with same props
    if(workspaces.includes(workspaceName) && areEqualShallow(currentWindowProps, windowProps)) {
      // restore the window if it is hidden or not the most recently opened one
      const workspace = storeState.openedWindows[openedWindowIndex];
      if(workspace.hidden || openedWindowIndex !== storeState.openedWindows.length - 1) {
        workspace2Store.setState(workspace2StoreActions.restoreWindow(storeState, windowName));
      }
    } else {
      // TODO: prompt for unsaved changes with better UI
      const discardUnsavedChanges = await confirm("Yo, switch window context?");;
      if(discardUnsavedChanges) {
        // discard the openedWindows element at openedWindowIndex
        // and create a new one with the requested workspace opened
        workspace2Store.setState({
          ...storeState,
          openedGroup: {
            groupName: group.name,
            props: groupProps
          },
          openedWindows: [
            ...storeState.openedWindows.filter((_, i) => i !== openedWindowIndex),
            // most recently opened workspace at the end of the array
            {
              windowName: windowName,
              workspaces: [workspaceName],
              props: windowProps,
              maximized: false,
              hidden: false
            }, 
          ]
        })
      }
    }
  } else {
    workspace2Store.setState({
      ...storeState,
      openedGroup: {
        groupName: group.name,
        props: groupProps
      },
      openedWindows: [
        ...storeState.openedWindows,
        // most recently opened workspace at the end of the array
        {
          windowName: windowName,
          workspaces: [workspaceName], // root workspace at index 0
          props: windowProps,
          maximized: false,
          hidden: false
        }
      ]
    })
  }
}

function areEqualShallow(a, b) {
  for(var key in a) {
    if(!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for(var key in b) {
    if(!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }
  return true;
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
  hideWindow(state: WorkspaceStoreState2, windowName: string) {
    const openedWindowIndex = state.openedWindows.findIndex(a => a.windowName === windowName);
    const openedWindows = [...state.openedWindows];
    const currentWindow = {...openedWindows[openedWindowIndex], hidden: true};
    
    openedWindows[openedWindowIndex] = currentWindow;
    
    return {
      ...state,
      openedWindows,
    };
  },
  restoreWindow(state: WorkspaceStoreState2, windowName: string) {
    const openedWindowIndex = state.openedWindows.findIndex(a => a.windowName === windowName);
    const currentWindow = {...state.openedWindows[openedWindowIndex], hidden: false};
    const openedWindows = [...state.openedWindows.filter((_, i) => i !== openedWindowIndex), currentWindow];
    return {
      ...state,
      openedWindows,
    };
    
  },
  closeWorkspace(state, workspaceName: string) {
    const openedWindowIndex = getOpenedWindowIndexByWorkspace(workspaceName);
    if (openedWindowIndex < 0) {
      return state; // no-op if the window does not exist
    }
    
    const window = {...state.openedWindows[openedWindowIndex]};
    const workspaceIndex = window.workspaces.findIndex((w) => w === workspaceName);
    const openedWindows = [...state.openedWindows];
    // close all child workspaces as well
    window.workspaces = window.workspaces.slice(0, workspaceIndex);

    if(window.workspaces.length === 0) {
      // if no workspaces left, remove the window
      openedWindows.splice(openedWindowIndex, 1);
    } else {
      // if there are still workspaces left, just update the window
      openedWindows[openedWindowIndex] = window;
    }
    
    return {
      ...state,
      openedWindows,
    };
  }
} satisfies Actions<WorkspaceStoreState2>;

export function useWorkspace2Store() {
  return useStoreWithActions(workspace2Store, workspace2StoreActions);
}