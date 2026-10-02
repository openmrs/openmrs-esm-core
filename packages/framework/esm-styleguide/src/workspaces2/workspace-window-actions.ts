import { type OpenedWindow, workspace2Store } from '@openmrs/esm-extensions';
import { type StoreApi } from '@openmrs/esm-state';
import {
  closeWorkspaceInWindow,
  openChildWorkspaceInWindow,
  promptForClosingWorkspacesInWindow,
  updateOpenedWorkspaceInWindow,
  workspace2StoreActions,
} from './workspace2';

/**
 * The operations the workspace render components (`ActiveWorkspaceWindow` / `ActiveWorkspace`) perform
 * on the one workspace window they render. There is an implementation for a window in the global
 * workspace window system, and one for the window held in an `<ExportedWorkspace>`'s local store.
 * Each implementation reads the current window from its own store at call time.
 */
export interface WorkspaceWindowActions {
  /** Closes the named workspace, along with its children. */
  closeWorkspace(workspaceName: string): void;
  openChildWorkspace(parentWorkspaceName: string, childWorkspaceName: string, props: Record<string, any>): void;
  setWorkspaceTitle(uuid: string, title: string): void;
  setHasUnsavedChanges(uuid: string, hasUnsavedChanges: boolean): void;
  /**
   * Prompts for confirmation to close the workspaces with unsaved changes in the window: the whole
   * window, or, if `upToWorkspaceName` is given, just that workspace and its children.
   * @returns a Promise that resolves to true if the user confirmed, or there was nothing to confirm.
   */
  promptForClosingWorkspaces(upToWorkspaceName?: string): Promise<boolean>;
}

/** The state of an `<ExportedWorkspace>`'s local store. */
export interface ExportedWorkspaceState {
  /** `null` before the workspace registers, and after its root workspace is closed. */
  openedWindow: OpenedWindow | null;
  groupProps: Record<string, any> | null;
}

/**
 * @param windowName The name of a window in the global workspace window system.
 */
export function createGlobalWindowActions(windowName: string): WorkspaceWindowActions {
  return {
    closeWorkspace(workspaceName) {
      workspace2Store.setState((state) => workspace2StoreActions.closeWorkspace(state, workspaceName));
    },
    openChildWorkspace(parentWorkspaceName, childWorkspaceName, props) {
      workspace2Store.setState((state) =>
        workspace2StoreActions.openChildWorkspace(state, parentWorkspaceName, childWorkspaceName, props),
      );
    },
    setWorkspaceTitle(uuid, title) {
      workspace2Store.setState((state) => workspace2StoreActions.setWorkspaceTitle(state, uuid, title));
    },
    setHasUnsavedChanges(uuid, hasUnsavedChanges) {
      workspace2Store.setState((state) => workspace2StoreActions.setHasUnsavedChanges(state, uuid, hasUnsavedChanges));
    },
    promptForClosingWorkspaces(upToWorkspaceName) {
      const openedWindow = workspace2Store.getState().openedWindows.find((w) => w.windowName === windowName);
      if (!openedWindow) {
        return Promise.resolve(true);
      }
      return promptForClosingWorkspacesInWindow(openedWindow, upToWorkspaceName);
    },
  };
}

/**
 * @param store The local store of an `<ExportedWorkspace>`.
 */
export function createLocalWindowActions(store: StoreApi<ExportedWorkspaceState>): WorkspaceWindowActions {
  function updateWindow(update: (openedWindow: OpenedWindow) => OpenedWindow | null) {
    store.setState((state) => {
      if (!state.openedWindow) {
        return state;
      }
      const openedWindow = update(state.openedWindow);
      // returning the same state lets zustand skip notifying subscribers
      return openedWindow === state.openedWindow ? state : { ...state, openedWindow };
    });
  }

  return {
    closeWorkspace(workspaceName) {
      updateWindow((openedWindow) => closeWorkspaceInWindow(openedWindow, workspaceName));
    },
    openChildWorkspace(parentWorkspaceName, childWorkspaceName, props) {
      updateWindow((openedWindow) =>
        openChildWorkspaceInWindow(openedWindow, parentWorkspaceName, childWorkspaceName, props),
      );
    },
    setWorkspaceTitle(uuid, title) {
      updateWindow((openedWindow) => updateOpenedWorkspaceInWindow(openedWindow, uuid, { title }));
    },
    setHasUnsavedChanges(uuid, hasUnsavedChanges) {
      updateWindow((openedWindow) => updateOpenedWorkspaceInWindow(openedWindow, uuid, { hasUnsavedChanges }));
    },
    promptForClosingWorkspaces(upToWorkspaceName) {
      const { openedWindow } = store.getState();
      if (!openedWindow) {
        return Promise.resolve(true);
      }
      return promptForClosingWorkspacesInWindow(openedWindow, upToWorkspaceName);
    },
  };
}
