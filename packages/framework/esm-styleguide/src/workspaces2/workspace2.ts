import { type Context, useContext } from 'react';
import { SingleSpaContext } from 'single-spa-react';
import { v4 as uuidV4 } from 'uuid';
import {
  getGroupByWindowName,
  getOpenedWindowIndexByWorkspace,
  getWindowByWorkspaceName,
  type OpenedWindow,
  type OpenedWorkspace,
  workspace2Store,
  type WorkspaceStoreState2,
} from '@openmrs/esm-extensions';
import { useStoreWithActions, type Actions } from '@openmrs/esm-react-utils';
import { shallowEqual } from '@openmrs/esm-utils';
import { showModal } from '../modals';
import { type Workspace2DefinitionProps } from './workspace2.component';

/**
 * Attempts to launch the specified workspace group with the given group props. Note that only one workspace group
 * may be opened at any given time. If a workspace group is already opened, calling `launchWorkspaceGroup2` with
 * either a different group name, or same group name but different incompatible props**, will result in prompting to
 * confirm closing workspaces. If the user confirms, the opened group, along with its windows (and their workspaces), is closed, and
 * the requested group is immediately opened.
 *
 * ** 2 sets of props are compatible if either one is nullish, or if they are shallow equal.
 * @experimental
 * @param groupName
 * @param groupProps
 * @returns a Promise that resolves to true if the specified workspace group with the specified group props
 *  is successfully opened, or that it already is opened.
 */
export async function launchWorkspaceGroup2<GroupProps extends object>(
  groupName: string,
  groupProps: GroupProps | null,
): Promise<boolean> {
  const { openedGroup } = workspace2Store.getState();
  if (openedGroup) {
    if (openedGroup.groupName !== groupName || !arePropsCompatible(openedGroup.props, groupProps)) {
      const okToCloseWorkspaces = await promptForClosingWorkspaces({
        reason: 'CLOSE_WORKSPACE_GROUP',
        explicit: false,
      });
      if (!okToCloseWorkspaces) {
        return false;
      }
      // else, proceed to open the new group with no openedWindows
    } else {
      // no-op, group with group props is already opened
      return true;
    }
  }

  workspace2Store.setState((state) => ({
    ...state,
    openedGroup: {
      groupName,
      props: groupProps,
    },
    openedWindows: [],
  }));

  return true;
}

/**
 * Closes the workspace group that is currently opened. Note that only one workspace group
 * may be opened at any given time
 * @experimental
 * @param discardUnsavedChanges If true, then the workspace group is forced closed, with no prompt
 * for confirmation for unsaved changes in any opened workspace. This should be used sparingly
 * for clean-up purpose, ex: when exiting an app.
 * @returns a Promise that resolves to true if there is no opened group to begin with or we successfully closed
 * the opened group; false otherwise.
 */
export async function closeWorkspaceGroup2(discardUnsavedChanges?: boolean) {
  const state = workspace2Store.getState();
  const { openedGroup, openedWindows } = state;
  if (openedGroup) {
    if (openedWindows.length > 0) {
      const okToCloseWorkspaces =
        discardUnsavedChanges ||
        (await promptForClosingWorkspaces({ reason: 'CLOSE_WORKSPACE_GROUP', explicit: true }));
      if (!okToCloseWorkspaces) {
        return false;
      }
    }
    workspace2Store.setState((state) => ({
      ...state,
      openedGroup: null,
      openedWindows: [],
    }));
    return true;
  }

  // no openedGroup with begin with, return true
  return true;
}

/**
 * Attempts to launch the specified workspace with the given workspace props. This also implicitly opens
 * the workspace window to which the workspace belongs (if it's not opened already),
 * and the workspace group to which the window belongs (if it's not opened already).
 *
 * When calling `launchWorkspace2`, we need to also pass in the workspace props. While not required,
 * we can also pass in the window props (shared by other workspaces in the window) and the group props
 * (shared by all windows and their workspaces). Omitting the window props or the group props[^1] means the caller
 * explicitly does not care what the current window props and group props are, and that they may be set
 * by other actions (like calling `launchWorkspace2` on a different workspace with those props passed in)
 * at a later time.
 *
 * If there is already an opened workspace group, and it's not the group the workspace belongs to
 * or has incompatible[^2] group props, then we prompt the user to close the group (and its windows and their workspaces).
 * On user confirm, the existing opened group is closed and the new workspace, along with its window and its group,
 * is opened.
 *
 * If the window is already opened, but with incompatible window props, we prompt the user to close
 * the window (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.
 *
 * If the workspace is already opened, but with incompatible workspace props, we also prompt the user to close
 * the **window** (and all its opened workspaces), and reopen the window with (only) the newly requested workspace.
 * This is true regardless of whether the already opened workspace has any child workspaces.
 *
 * Note that calling this function *never* results in creating a child workspace in the affected window.
 * To do so, we need to call `launchChildWorkspace` instead.
 *
 * [^1] Omitting window or group props is useful for workspaces that don't have ties to the window or group "context" (props).
 * For example, in the patient chart, the visit notes / clinical forms / order basket action menu button all share
 * a "group context" of the current visit. However, the "patient list" action menu button does not need to share that group
 * context, so opening that workspace should not need to cause other workspaces / windows / groups to potentially close.
 * The "patient search" workspace in the queues and ward apps is another example.
 *
 * [^2] 2 sets of props are compatible if either one is nullish, or if they are shallow equal.
 * @experimental
 */
export async function launchWorkspace2<
  WorkspaceProps extends object,
  WindowProps extends object,
  GroupProp extends object,
>(
  workspaceName: string,
  workspaceProps: WorkspaceProps | null = null,
  windowProps: WindowProps | null = null,
  groupProps: GroupProp | null = null,
): Promise<boolean> {
  const storeState = workspace2Store.getState();

  if (!storeState.registeredWorkspacesByName[workspaceName]) {
    throw new Error(`Unable to launch workspace ${workspaceName}. Workspace is not registered`);
  }
  const windowDef = getWindowByWorkspaceName(workspaceName);
  if (!windowDef) {
    throw new Error(`Unable to launch workspace ${workspaceName}. Workspace is not registered to a workspace window`);
  }

  const { openedGroup } = storeState;
  const { name: windowName } = windowDef;
  const groupDef = getGroupByWindowName(windowName);
  if (!groupDef) {
    throw new Error(
      `Unable to launch workspace ${workspaceName}. Workspace window ${windowDef.name} is not registered to a workspace group`,
    );
  }

  const openedWindowIndex = getOpenedWindowIndexByWorkspace(workspaceName);
  const isWindowAlreadyOpened = openedWindowIndex >= 0;

  // if current opened group is not the same as the requested group, or if the group props are different, then prompt for unsaved changes
  if (openedGroup && (openedGroup.groupName !== groupDef.name || !arePropsCompatible(openedGroup.props, groupProps))) {
    const okToCloseWorkspaces = await promptForClosingWorkspaces({ reason: 'CLOSE_WORKSPACE_GROUP', explicit: true });
    if (okToCloseWorkspaces) {
      workspace2Store.setState({
        ...storeState,
        openedGroup: {
          groupName: groupDef.name,
          props: groupProps,
        },
        openedWindows: [
          // discard all opened windows, open a new one with the requested workspace
          // most recently opened action appended to the end
          {
            windowName: windowName,
            openedWorkspaces: [newOpenedWorkspace(workspaceName, workspaceProps)], // root workspace at index 0
            props: windowProps,
            maximized: false,
          },
        ],
        isMostRecentlyOpenedWindowHidden: false,
      });
      return true;
    } else {
      return false;
    }
  } else if (isWindowAlreadyOpened) {
    const openedWindow = storeState.openedWindows[openedWindowIndex];
    const groupProps = storeState.openedGroup?.props ?? {};
    const isMostRecentlyOpenedWindowHidden = storeState.isMostRecentlyOpenedWindowHidden;
    const { openedWorkspaces } = openedWindow;

    if (arePropsCompatible(openedWindow.props, windowProps)) {
      // this case is tricky, this results in restoring the window if:
      // 1. the workspace is opened (but not necessarily as a leaf workspace)
      // 2. the props of the opened workspace is same as workspace props (from the function input)
      //
      // Otherwise, we close all workspaces in this window, and open this newly requested one
      const openedWorkspace = openedWorkspaces.find((w) => w.workspaceName === workspaceName);
      if (openedWorkspace && arePropsCompatible(openedWorkspace.props, workspaceProps)) {
        // restore the window if it is hidden or not the most recently opened one
        if (isMostRecentlyOpenedWindowHidden || openedWindowIndex !== storeState.openedWindows.length - 1) {
          workspace2Store.setState(workspace2StoreActions.restoreWindow(storeState, windowName));
        }
        return true;
      } else {
        const okToCloseWorkspaces = await promptForClosingWorkspaces({
          reason: 'CLOSE_WORKSPACE',
          explicit: false,
          windowName,
          workspaceName,
        });
        if (okToCloseWorkspaces) {
          workspace2Store.setState({
            ...storeState,
            openedGroup: {
              groupName: groupDef.name,
              props: storeState?.openedGroup?.props ?? groupProps,
            },
            openedWindows: [
              ...storeState.openedWindows.filter((_, i) => i !== openedWindowIndex),
              // most recently opened workspace at the end of the array
              {
                windowName: windowName,
                openedWorkspaces: [newOpenedWorkspace(workspaceName, workspaceProps)],
                props: openedWindow?.props ?? windowProps,
                maximized: false,
              },
            ],
            isMostRecentlyOpenedWindowHidden: false,
          });
          return true;
        } else {
          return false;
        }
      }
    } else {
      const okToCloseWorkspaces = await promptForClosingWorkspaces({
        reason: 'CLOSE_WINDOW',
        explicit: false,
        windowName,
      });
      if (okToCloseWorkspaces) {
        // discard the openedWindows element at openedWindowIndex
        // and create a new one with the requested workspace opened
        workspace2Store.setState({
          ...storeState,
          openedGroup: {
            groupName: groupDef.name,
            props: groupProps ?? storeState?.openedGroup?.props,
          },
          openedWindows: [
            ...storeState.openedWindows.filter((_, i) => i !== openedWindowIndex),
            // most recently opened workspace at the end of the array
            {
              windowName: windowName,
              openedWorkspaces: [newOpenedWorkspace(workspaceName, workspaceProps)],
              props: windowProps,
              maximized: false,
            },
          ],
          isMostRecentlyOpenedWindowHidden: false,
        });
        return true;
      } else {
        return false;
      }
    }
  } else if (groupDef.persistence == 'closable') {
    const okToCloseWorkspaces = await promptForClosingWorkspaces({
      reason: 'CLOSE_OTHER_WINDOWS',
      explicit: false,
      windowNameToSpare: windowDef.name,
    });
    if (okToCloseWorkspaces) {
      workspace2Store.setState({
        ...storeState,
        openedGroup: {
          groupName: groupDef.name,
          props: groupProps ?? storeState?.openedGroup?.props ?? null,
        },
        openedWindows: [
          {
            windowName: windowName,
            openedWorkspaces: [newOpenedWorkspace(workspaceName, workspaceProps)], // root workspace at index 0
            props: windowProps,
            maximized: false,
          },
        ],
        isMostRecentlyOpenedWindowHidden: false,
      });
      return true;
    } else {
      return false;
    }
  } else {
    workspace2Store.setState({
      ...storeState,
      openedGroup: {
        groupName: groupDef.name,
        props: groupProps ?? storeState?.openedGroup?.props ?? null,
      },
      openedWindows: [
        ...storeState.openedWindows,
        // most recently opened workspace at the end of the array
        {
          windowName: windowName,
          openedWorkspaces: [newOpenedWorkspace(workspaceName, workspaceProps)], // root workspace at index 0
          props: windowProps,
          maximized: false,
        },
      ],
      isMostRecentlyOpenedWindowHidden: false,
    });
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
  if (a == null || b == null) {
    return true;
  }

  return shallowEqual(a, b);
}

type PromptReason =
  | { reason: 'CLOSE_WORKSPACE_GROUP'; explicit: boolean }
  | { reason: 'CLOSE_WINDOW'; explicit: boolean; windowName: string }
  | { reason: 'CLOSE_WORKSPACE'; explicit: boolean; windowName: string; workspaceName: string }
  | { reason: 'CLOSE_OTHER_WINDOWS'; explicit: false; windowNameToSpare: string };

/**
 * A user can perform actions that explicitly result in closing workspaces
 * (such that clicking the 'X' button for the workspace or workspace group), or
 * implicitly (by opening a workspace with different props than the one that is already opened).
 * Calls to closeWorkspace2() or closeWorkspaceGroup2() are considered explicit, while calls
 * to launchWorkspace2() or launchWorkspaceGroup2() are considered implicit.
 *
 * This function prompts the user for confirmation to close workspaces with a modal dialog.
 * When the closing is explicit, it prompts for confirmation for affected workspaces with unsaved changes.
 * When the closing is implicit, it prompts for confirmation for all affected workspaces, regardless of
 * whether they have unsaved changes.
 * @experimental
 * @param promptReason
 * @returns a Promise that resolves to true if the user confirmed closing the workspaces; false otherwise.
 */
export function promptForClosingWorkspaces(promptReason: PromptReason): Promise<boolean> {
  // if onlyUpToThisWorkspace is provided, we will only loop till we hit that workspace
  function getAffectedWorkspacesInWindow(openedWindow: OpenedWindow, onlyUpToThisWorkspace?: string) {
    const ret: Array<OpenedWorkspace> = [];
    for (let i = openedWindow.openedWorkspaces.length - 1; i >= 0; i--) {
      const openedWorkspace = openedWindow.openedWorkspaces[i];

      if (openedWorkspace.hasUnsavedChanges) {
        ret.push(openedWorkspace);
      }
      if (onlyUpToThisWorkspace && openedWorkspace.workspaceName === onlyUpToThisWorkspace) {
        break;
      }
    }
    return ret;
  }

  const { openedWindows, workspaceTitleByWorkspaceName } = workspace2Store.getState();
  let affectedWorkspaces: OpenedWorkspace[] = [];
  switch (promptReason.reason) {
    case 'CLOSE_WORKSPACE_GROUP': {
      affectedWorkspaces = openedWindows.flatMap((window) => getAffectedWorkspacesInWindow(window));
      break;
    }
    case 'CLOSE_WINDOW': {
      const openedWindow = openedWindows.find((window) => window.windowName === promptReason.windowName);
      if (!openedWindow) {
        throw new Error(`Window ${promptReason.windowName} not found in opened windows.`);
      }
      affectedWorkspaces = getAffectedWorkspacesInWindow(openedWindow);
      break;
    }
    case 'CLOSE_WORKSPACE': {
      const openedWindow = openedWindows.find((window) => window.windowName === promptReason.windowName);
      if (!openedWindow) {
        throw new Error(`Window ${promptReason.windowName} not found in opened windows.`);
      }
      affectedWorkspaces = getAffectedWorkspacesInWindow(openedWindow, promptReason.workspaceName);
      break;
    }
    case 'CLOSE_OTHER_WINDOWS': {
      const windowsToClose = openedWindows.filter((window) => window.windowName !== promptReason.windowNameToSpare);
      affectedWorkspaces = windowsToClose.flatMap((w) => getAffectedWorkspacesInWindow(w));
      break;
    }
  }

  if (affectedWorkspaces.length === 0) {
    return Promise.resolve(true); // no unsaved changes, no need to prompt
  }

  return new Promise((resolve) => {
    const dispose = showModal('workspace2-close-prompt', {
      onConfirm: () => {
        dispose();
        resolve(true);
      },
      onCancel: () => {
        dispose();
        resolve(false);
      },
      affectedWorkspaceTitles: affectedWorkspaces.map(
        (workspace) => workspaceTitleByWorkspaceName[workspace.workspaceName],
      ),
    });
  });
}

const workspace2StoreActions = {
  setWindowMaximized(state: WorkspaceStoreState2, windowName: string, maximized: boolean) {
    const openedWindowIndex = state.openedWindows.findIndex((a) => a.windowName === windowName);
    const openedWindows = [...state.openedWindows];
    const currentWindow = { ...openedWindows[openedWindowIndex], maximized };

    openedWindows[openedWindowIndex] = currentWindow;

    return {
      ...state,
      openedWindows,
    };
  },
  // hides the most recently opened window (all other opened windows are implicitly hidden)
  hideWindow(state: WorkspaceStoreState2) {
    return {
      ...state,
      isMostRecentlyOpenedWindowHidden: true,
    };
  },
  restoreWindow(state: WorkspaceStoreState2, windowName: string) {
    const openedWindowIndex = state.openedWindows.findIndex((a) => a.windowName === windowName);
    const currentWindow = state.openedWindows[openedWindowIndex];
    const openedWindows = [...state.openedWindows.filter((_, i) => i !== openedWindowIndex), currentWindow];
    return {
      ...state,
      openedWindows,
      isMostRecentlyOpenedWindowHidden: false,
    };
  },
  closeWorkspace(state, workspaceName: string) {
    const openedWindowIndex = getOpenedWindowIndexByWorkspace(workspaceName);
    if (openedWindowIndex < 0) {
      return state; // no-op if the window does not exist
    }

    const window = { ...state.openedWindows[openedWindowIndex] };
    const workspaceIndex = window.openedWorkspaces.findIndex((w) => w.workspaceName === workspaceName);
    const openedWindows = [...state.openedWindows];
    // close all children of the input workspace as well
    window.openedWorkspaces = window.openedWorkspaces.slice(0, workspaceIndex);

    let hidden = state.isMostRecentlyOpenedWindowHidden;
    if (window.openedWorkspaces.length === 0) {
      const wasMostRecentWindow = openedWindowIndex === state.openedWindows.length - 1;
      // if no workspaces left, remove the window
      openedWindows.splice(openedWindowIndex, 1);
      // If we removed the most recent window and there are still windows left,
      // the new most recent window should be shown
      if (wasMostRecentWindow && openedWindows.length > 0) {
        hidden = false;
      }
    } else {
      // if there are still workspaces left, just update the window
      openedWindows[openedWindowIndex] = window;
    }

    return {
      ...state,
      openedWindows,
      isMostRecentlyOpenedWindowHidden: hidden,
    };
  },
  openChildWorkspace(
    state,
    parentWorkspaceName: string,
    childWorkspaceName: string,
    childWorkspaceProps: Record<string, any>,
  ) {
    const childWorkspaceDef = state.registeredWorkspacesByName[childWorkspaceName];
    if (!childWorkspaceDef) {
      throw new Error(`No workspace named "${childWorkspaceName}" registered`);
    }
    const parentWorkspaceDef = state.registeredWorkspacesByName[parentWorkspaceName];
    if (!parentWorkspaceDef) {
      throw new Error(`No workspace named "${parentWorkspaceName}" registered`);
    }
    if (parentWorkspaceDef.window !== childWorkspaceDef.window) {
      throw new Error(
        `Child workspace ${childWorkspaceName} does not belong to the same workspace window as parent workspace ${parentWorkspaceName}`,
      );
    }

    // as the request workspace should be a child workspace, the corresponding window
    // to contain the workspace should already be opened
    const openedWindowIndex = state.openedWindows.findIndex((window) => window.windowName === childWorkspaceDef.window);
    if (openedWindowIndex == -1) {
      throw new Error(
        `Cannot open child workspace ${childWorkspaceName} as window ${childWorkspaceDef.window} is not opened`,
      );
    }
    const openedWindow = state.openedWindows[openedWindowIndex];
    const { openedWorkspaces } = openedWindow;
    if (openedWorkspaces[openedWorkspaces.length - 1].workspaceName !== parentWorkspaceName) {
      throw new Error(
        `Cannot open child workspace ${childWorkspaceName} from parent workspace ${parentWorkspaceName} as the parent is not the most recently opened workspace within the workspace window`,
      );
    }

    return {
      openedWindows: state.openedWindows.map((w, i) => {
        if (i == openedWindowIndex) {
          return {
            ...w,
            openedWorkspaces: [...w.openedWorkspaces, newOpenedWorkspace(childWorkspaceName, childWorkspaceProps)],
          };
        } else {
          return w;
        }
      }),
    };
  },
  setHasUnsavedChanges(state: WorkspaceStoreState2, workspaceName: string, hasUnsavedChanges: boolean) {
    const openedWindowIndex = getOpenedWindowIndexByWorkspace(workspaceName);
    if (openedWindowIndex < 0) {
      return state; // no-op if the window does not exist
    }

    const openedWindow = { ...state.openedWindows[openedWindowIndex] };
    const workspaceIndex = openedWindow.openedWorkspaces.findIndex((w) => w.workspaceName === workspaceName);

    if (workspaceIndex < 0) {
      return state; // no-op if the workspace is not found
    }

    openedWindow.openedWorkspaces[workspaceIndex] = {
      ...openedWindow.openedWorkspaces[workspaceIndex],
      hasUnsavedChanges,
    };

    const openedWindows = [...state.openedWindows];
    openedWindows[openedWindowIndex] = openedWindow;

    return {
      ...state,
      openedWindows,
    };
  },
  setWorkspaceTitle(state: WorkspaceStoreState2, workspaceName: string, title: string | null) {
    const newWorkspaceTitleByWorkspaceName = { ...state.workspaceTitleByWorkspaceName };

    if (title === null) {
      delete newWorkspaceTitleByWorkspaceName[workspaceName];
    } else {
      newWorkspaceTitleByWorkspaceName[workspaceName] = title;
    }

    return {
      ...state,
      workspaceTitleByWorkspaceName: newWorkspaceTitleByWorkspaceName,
    };
  },
} satisfies Actions<WorkspaceStoreState2>;

export function useWorkspace2Store() {
  return useStoreWithActions(workspace2Store, workspace2StoreActions);
}

/**
 * Returns the react Context containing props passed into a workspace.
 * This hook MUST be called inside a child of <Workspace2>
 */
export const useWorkspace2Context = () =>
  useContext<Workspace2DefinitionProps>(SingleSpaContext as unknown as Context<Workspace2DefinitionProps>);

/**
 * @returns a list of registered workspaces.
 */
export const getRegisteredWorkspace2Names = () => {
  return Object.keys(workspace2Store.getState().registeredWorkspacesByName);
};

function newOpenedWorkspace(workspaceName: string, workspaceProps: Record<string, any> | null): OpenedWorkspace {
  return {
    workspaceName,
    props: workspaceProps ?? {},
    hasUnsavedChanges: false,
    uuid: uuidV4(),
  };
}
