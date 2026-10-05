import React, { useEffect, type ReactNode } from 'react';
import { useWorkspace2Context } from './workspace2';

interface Workspace2Props {
  title: string;
  children: ReactNode;
  hasUnsavedChanges?: boolean;
}

export interface Workspace2DefinitionProps<
  WorkspaceProps extends object = object,
  WindowProps extends object = object,
  GroupProps extends object = object,
> {
  /**
   * This function launches a child workspace. Unlike `launchWorkspace()`, this function is meant
   * to be called from the a workspace, and it does not allow passing (or changing)
   * the window props or group props
   * @param workspaceName
   * @param workspaceProps
   */
  launchChildWorkspace<Props extends object>(workspaceName: string, workspaceProps?: Props): Promise<void>;

  /**
   * closes the current workspace, along with its children.
   * @param options Optional configuration for closing the workspace.
   * @param options.closeWindow If true, the workspace's window, along with all workspaces within it, will be closed as well.
   * @param options.discardUnsavedChanges If true, the "unsaved changes" modal will be suppressed, and the value of `hasUnsavedChanges` will be ignored. Use this when closing the workspace immediately after changes are saved.
   * @returns a Promise that resolves to true if the workspace is closed, false otherwise.
   */
  closeWorkspace(options?: { closeWindow?: boolean; discardUnsavedChanges?: boolean }): Promise<boolean>;

  workspaceProps: WorkspaceProps | null;
  windowProps: WindowProps | null;
  groupProps: GroupProps | null;
  /**
   * The workspace's `meta` from its registration (the `meta` field of its `workspaces2` entry in
   * `routes.json`).
   */
  workspaceMeta?: Readonly<Record<string, unknown>>;
  workspaceName: string;
  windowName: string;
  isRootWorkspace: boolean;
  showActionMenu: boolean;

  /**
   * Records the title of this workspace, for display in the workspace window header.
   * @internal Called by `<Workspace2>`; use its `title` prop instead.
   */
  setWorkspaceTitle(title: string): void;

  /**
   * Records whether this workspace has unsaved changes.
   * @internal Called by `<Workspace2>`; use its `hasUnsavedChanges` prop instead.
   */
  setHasUnsavedChanges(hasUnsavedChanges: boolean): void;
}

export type Workspace2Definition<
  WorkspaceProps extends object,
  WindowProps extends object,
  GroupProps extends object,
> = React.FC<Workspace2DefinitionProps<WorkspaceProps, WindowProps, GroupProps>>;

/**
 * The Workspace2 component is used as a top-level container to render
 * its children as content within a workspace. When creating a workspace
 * component, `<Workspace2>` should be the top-level component returned,
 * wrapping all of the workspace content.
 */
export const Workspace2: React.FC<Workspace2Props> = ({ title, children, hasUnsavedChanges = false }) => {
  // These are bound to this workspace instance, in whichever store holds it (the global store, or an
  // `<ExportedWorkspace>`'s local store). They skip writes that change nothing.
  const { setHasUnsavedChanges, setWorkspaceTitle } = useWorkspace2Context();

  useEffect(() => {
    setHasUnsavedChanges(hasUnsavedChanges ?? false);
  }, [hasUnsavedChanges, setHasUnsavedChanges]);

  useEffect(() => {
    setWorkspaceTitle(title);
  }, [title, setWorkspaceTitle]);

  // The chrome surrounding the workspace (containers, header, action buttons) is rendered by
  // `<ActiveWorkspace>`, outside the single-spa parcel. `title` and `hasUnsavedChanges` are
  // reported up to it through the store (above), so this component stays as thin as possible.
  return <>{children}</>;
};
