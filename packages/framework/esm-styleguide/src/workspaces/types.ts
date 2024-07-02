import { type WorkspaceWindowState } from '@openmrs/esm-globals';
import { type ReactNode } from 'react';

export interface CloseWorkspaceOptions {
  /**
   * Whether to close the workspace ignoring all the changes present in the workspace.
   *
   * If ignoreChanges is true, the user will not be prompted to save changes before closing
   * even if the `testFcn` passed to `promptBeforeClosing` returns `true`.
   */
  ignoreChanges?: boolean;
  /**
   * If you want to take an action after the workspace is closed, you can pass your function as
   * `onWorkspaceClose`. This function will be called only after the workspace is closed, given
   * that the user might be shown a prompt.
   * @returns void
   */
  onWorkspaceClose?: () => void;
}

/** The default parameters received by all workspaces */
export interface DefaultWorkspaceProps {
  /**
   * Call this function to close the workspace. This function will prompt the user
   * if there are any unsaved changes to workspace.
   *
   * You can pass `onWorkspaceClose` function to be called when the workspace is finally
   * closed, given the user forcefully closes the workspace.
   */
  closeWorkspace(closeWorkspaceOptions?: CloseWorkspaceOptions): void;
  /**
   * Call this with a no-args function that returns true if the user should be prompted before
   * this workspace is closed; e.g. if there is unsaved data.
   */
  promptBeforeClosing(testFcn: () => boolean): void;
  /**
   * Call this function to close the workspace after the form is saved. This function
   * will directly close the workspace without any prompt
   */
  closeWorkspaceWithSavedChanges(closeWorkspaceOptions?: CloseWorkspaceOptions): void;
  /**
   * Use this to set the workspace title if it needs to be set dynamically.
   *
   * Workspace titles generally are set in the workspace declaration in the routes.json file. They can also
   * be set by the workspace launcher by passing `workspaceTitle` in the `additionalProps`
   * parameter of the `launchWorkspace` function. This function is useful when the workspace
   * title needs to be set dynamically.
   *
   * @param title The title to set. If using titleNode, set this to a human-readable string
   *        which will identify the workspace in notifications and other places.
   * @param titleNode A React object to put in the workspace header in place of the title. This
   *        is useful for displaying custom elements in the header. Note that custom header
   *        elements can also be attached to the workspace header extension slots.
   */
  setTitle(title: string, titleNode?: ReactNode): void;
}

export interface WorkspaceWindowSize {
  size: WorkspaceWindowState;
}

export interface WorkspaceWindowSizeProviderProps {
  children?: React.ReactNode;
}

export interface WorkspaceWindowSizeContext {
  windowSize: WorkspaceWindowSize;
  updateWindowSize?(value: WorkspaceWindowState): any;
  active: boolean;
}
