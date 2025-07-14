import { getGroupByWindowName, getOpenedWindowIndexByWorkspace, getWindowByWorkspaceName, workspace2Store, WorkspaceStoreState2 } from "@openmrs/esm-extensions";
import { useStoreWithActions, type Actions } from "@openmrs/esm-react-utils";

/**
 * Attempts to launch the specified workspace group with the given group props. Note that only one workspace group
 * may be opened at any given time. If a workspace group is already opened, calling `launchWorkspaceGroup2` with 
 * either a different group name, or same group name but different group props, will result in prompting for unsaved
 * changes. If the user confirms, the opened group, along with its windows (and their workspaces), is closed, and
 * the requested group is immediately opened.
 * @param groupName 
 * @param groupProps 
 * @returns a Promise that resolves to true if the specified workspace group with the specified group props 
 *  is successfully opened, or that it already is opened.
 */
export async function launchWorkspaceGroup2<GroupProps extends Record<string, any>>(groupName: string, groupProps: GroupProps | null): Promise<boolean> {
  const {openedGroup} = workspace2Store.getState();
  if(openedGroup) {
    if(openedGroup.groupName !== groupName || !arePropsCompatible(openedGroup.props, groupProps)) {
      // prompt for unsaved changes with better UI
      const discardUnsavedChanges = await confirm("Yo, switch group context?");
      if(!discardUnsavedChanges) {
        return false; 
      }
      // else, go outside the loop and open the new group with no openedWindows
    } else {
      // no-op, group with group props is already opened
      return true;
    }
  }

  workspace2Store.setState(state => ({
    ...state,
    openedGroup: {
      groupName,
      props: groupProps
    },
    openedWindows: []
  }))

  return true;
}

/**
 * 
 * @returns a Promise that resolves to true if there is no opened group to begin with or we successfully closed 
 * the opened group; false otherwise.  
 */
export async function closeWorkspaceGroup2() {
  const state = workspace2Store.getState();
  const {openedGroup, openedWindows} = state;
  if(openedGroup) {

    if(openedWindows.length > 0) {
      // prompt for unsaved changes with better UI
      const discardUnsavedChanges = await confirm("Yo, close group?");
      if(!discardUnsavedChanges) {
        return false;
      }
    }
    workspace2Store.setState(state => ({
      ...state,
      openedGroup: null,
      openedWindows: []
    }))
    return true;
  }

  // no openedGroup with being with, return true
  return true;
}

workspace2Store.subscribe((state) => {
  console.log(">>> workspace2Store state changed", state);
})

// note that this will *never* result in child workspaces
export async function launchWorkspace2<
    WorkspaceProps extends Record<string, any>,
    WindowProps extends Record<string, any>,
    GroupProp extends Record<string, any>,>(
      workspaceName: string,
      workspaceProps: WorkspaceProps,
      windowProps: WindowProps | null = null,
      groupProps: GroupProp | null = null, 
  ): Promise<boolean> {
  const storeState = workspace2Store.getState();
  
  if(!storeState.registeredWorkspacesByName[workspaceName]) {
    throw new Error(`Unable to launch workspace ${workspaceName}. Workspace is not registered`);
  }
  const windowDef = getWindowByWorkspaceName(workspaceName);
  if(!windowDef) {
    throw new Error(`Unable to launch workspace ${workspaceName}. Workspace is not registerd to a workspace window`);
  }

  const {openedGroup} = storeState;
  const {name: windowName} = windowDef;
  const groupDef = getGroupByWindowName(windowName);
  if(!groupDef) {
    throw new Error(`Unable to launch workspace ${workspaceName}. Workspace window ${windowDef.name} is not registerd to a workspace group`);
  }

  const openedWindowIndex  = getOpenedWindowIndexByWorkspace(workspaceName);
  const isWindowAlreadyOpened = openedWindowIndex >= 0;

  // if current opened group is not the same as the requested group, or if the group props are different, then prompt for unsaved changes
  if(openedGroup && (openedGroup.groupName !== groupDef.name || !arePropsCompatible(openedGroup.props, groupProps))) {
    // prompt for unsaved changes with better UI
    const discardUnsavedChanges = await confirm("Yo, switch group context?");
    if(discardUnsavedChanges) {
      workspace2Store.setState({
        ...storeState,
        openedGroup: {
          groupName: groupDef.name,
          props: groupProps
        },
        openedWindows: [
          // discard all opened windows, open a new one with the requested workspace
          // most recently opened action appended to the end
          {
            windowName: windowName,
            openedWorkspaces: [{workspaceName: workspaceName, props: workspaceProps}], // root workspace at index 0
            props: windowProps,
            maximized: false,
            hidden: false
          },
        ]
      })
      return true;
    } else {
      return false;
    }
  }
  else if(isWindowAlreadyOpened) {
    const openedWindow = storeState.openedWindows[openedWindowIndex];
    const groupProps = storeState.openedGroup?.props ?? {};
    const {openedWorkspaces} = openedWindow;

    if(arePropsCompatible(openedWindow.props, windowProps)) {
      
      // this case is tricky, this results in restoring the window is if:
      // 1. the workspace is opened (but not necessarily as a leaf workspace)
      // 2. the props of the opened workspace is same as workspace props (from the function input)
      //
      // Otherwise, we close all workspaces in this window, and open this newly requested one
      const openedWorkspace = openedWorkspaces.find(w => w.workspaceName === workspaceName);
      if(openedWorkspace && arePropsCompatible(openedWorkspace.props, workspaceProps)) {
        // restore the window if it is hidden or not the most recently opened one
        if(openedWindow.hidden || openedWindowIndex !== storeState.openedWindows.length - 1) {
          workspace2Store.setState(workspace2StoreActions.restoreWindow(storeState, windowName));
        }
        return true;
      } else {
        const discardUnsavedChanges = await confirm("Yo, switch workspace context (and close other workspaces in window)?");
        if(discardUnsavedChanges) {
          workspace2Store.setState({
            ...storeState,
            openedGroup: {
              groupName: groupDef.name,
              props: storeState?.openedGroup?.props ?? groupProps
            },
            openedWindows: [
              ...storeState.openedWindows.filter((_, i) => i !== openedWindowIndex),
              // most recently opened workspace at the end of the array
              {
                windowName: windowName,
                openedWorkspaces: [{workspaceName: workspaceName, props: workspaceProps}],
                props: openedWindow?.props ?? windowProps,
                maximized: false,
                hidden: false
              }, 
            ]
          });
          return true;
        } else {
          return false;
        }
      }
    } else {
      // TODO: prompt for unsaved changes with better UI
      const discardUnsavedChanges = await confirm("Yo, switch window context?");
      if(discardUnsavedChanges) {
        // discard the openedWindows element at openedWindowIndex
        // and create a new one with the requested workspace opened
        workspace2Store.setState({
          ...storeState,
          openedGroup: {
            groupName: groupDef.name,
            props: storeState?.openedGroup?.props ?? groupProps ?? groupProps
          },
          openedWindows: [
            ...storeState.openedWindows.filter((_, i) => i !== openedWindowIndex),
            // most recently opened workspace at the end of the array
            {
              windowName: windowName,
              openedWorkspaces: [{workspaceName: workspaceName, props: workspaceProps}],
              props: windowProps,
              maximized: false,
              hidden: false
            }, 
          ]
        });
        return true;
      } else {
        return false;
      }
    }
  } else {
    workspace2Store.setState({
      ...storeState,
      openedGroup: {
        groupName: groupDef.name,
        props: groupProps
      },
      openedWindows: [
        ...storeState.openedWindows,
        // most recently opened workspace at the end of the array
        {
          windowName: windowName,
          openedWorkspaces: [{workspaceName: workspaceName, props: workspaceProps}], // root workspace at index 0
          props: windowProps,
          maximized: false,
          hidden: false
        }
      ]
    })
    return true;
  }
}

/**
 * When we launch a workspace, we may pass in workspace / windows / group props. If the workspace or 
 * window or group is currently opened, we have to check whether the current props are compatible with 
 * the passed in props. 2 props A and B are compatible if:
 *   either one is nullish (because this indicates that the caller does not care about prop incompatibility)
 *   neither is nullish, and A and B are shallow equal.
 * @param a props
 * @param b props
 * @returns whether props a and b are compatible
 */
function arePropsCompatible(a: Record<string, any> | null, b: Record<string, any> | null) {
  if(a == null || b == null) {
    return true;
  }

  // check that every prop in a is also in b, and they are equal
  for(var key in a) {
    if(!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }

  // check that every prop in b is also in a, and they are equal
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
    const workspaceIndex = window.openedWorkspaces.findIndex((w) => w.workspaceName === workspaceName);
    const openedWindows = [...state.openedWindows];
    // close all children of the input workspace as well
    window.openedWorkspaces = window.openedWorkspaces.slice(0, workspaceIndex);

    if(window.openedWorkspaces.length === 0) {
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
  },
  openChildWorkspace(state, parentWorkspaceName: string, childWorkspaceName: string, childWorkspaceProps: Record<string, any>) {
    const childWorkspaceDef = state.registeredWorkspacesByName[childWorkspaceName];
    if(!childWorkspaceDef) {
      throw new Error(`No workspace named "${childWorkspaceName}" registered`);
    }
    const parentWorkspaceDef = state.registeredWorkspacesByName[parentWorkspaceName];
    if(!parentWorkspaceDef) {
      throw new Error(`No workspace named "${parentWorkspaceName}" registered`);
    }
    if(parentWorkspaceDef.window !== childWorkspaceDef.window) {
      throw new Error(`Child workspace ${childWorkspaceName} does not belong to the same workspace window as parent workspace ${parentWorkspaceName}`);
    }

    // as the request workspace should be a child workspace, the corresponding window
    // to contain the workspace should already be opened 
    const openedWindowIndex = state.openedWindows.findIndex(window => window.windowName === childWorkspaceDef.window);
    if(openedWindowIndex == -1) {
      throw new Error(`Cannot open child workspace ${childWorkspaceName} as window ${childWorkspaceDef.window} is not opened`);
    }
    const openedWindow = state.openedWindows[openedWindowIndex];
    const { openedWorkspaces } = openedWindow; 
    if(openedWorkspaces[openedWorkspaces.length - 1].workspaceName !== parentWorkspaceName) {
      throw new Error(`Cannot open child workspace ${childWorkspaceName} from parent workspace ${parentWorkspaceName} as the parent is not the most recently opened workspace within the workspace window`);
    }
 
    return {
      openedWindows: state.openedWindows.map((w, i) => {
        if(i == openedWindowIndex) {
          return {...w, openedWorkspaces: [...w.openedWorkspaces, {workspaceName: childWorkspaceName, props: childWorkspaceProps}]};
        } else {
          return w;
        }
      })
    }
  }
} satisfies Actions<WorkspaceStoreState2>;

export function useWorkspace2Store() {
  return useStoreWithActions(workspace2Store, workspace2StoreActions);
}