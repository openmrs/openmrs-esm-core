import React, { useEffect, useMemo, useRef } from 'react';
import { workspace2Store, type WorkspaceStoreState2 } from '@openmrs/esm-extensions';
import { type WorkspaceWindowState } from '@openmrs/esm-globals';
import { useStore } from '@openmrs/esm-react-utils';
import { createLocalStore, type StoreApi } from '@openmrs/esm-state';
import ActiveWorkspaceWindow from './active-workspace-window.component';
import { createExportedWorkspaceWindow } from './workspace2';
import { createLocalWindowActions, type ExportedWorkspaceState } from './workspace-window-actions';
import styles from './exported-workspace.module.scss';

export interface ExportedWorkspaceWindowInfo {
  /** The name of the currently-rendered (leaf) workspace, or `null` when all workspaces are closed. */
  workspaceName: string | null;
  /**
   * The emulated window size. Has no effect on rendering. `<ExportedWorkspace>` renders no
   * maximize / hide buttons, so this is currently always `'normal'`.
   */
  windowSize: WorkspaceWindowState;
  /** The title of the currently-rendered (leaf) workspace, or `''` when all workspaces are closed. */
  title: string;
  /** The `hasUnsavedChanges` of every workspace in the window, OR'd together. */
  hasUnsavedChanges: boolean;
}

export interface ExportedWorkspaceProps {
  /** The name of the workspace to open. */
  name: string;

  /**
   * Identifies the workspace instance being shown. Changing it (like changing `name`) discards the
   * current workspaces, without prompting for unsaved changes, and opens `name` afresh.
   *
   * Note: this is named `instanceKey` rather than `key` because `key` is reserved by React and never
   * reaches the component.
   */
  instanceKey: string;

  /** The props passed into the workspace. */
  workspaceProps: Record<string, any>;
  windowProps?: Record<string, any>;
  groupProps?: Record<string, any>;

  /** Callback fired when the emulated window's state changes. */
  onWindowChanged?(info: ExportedWorkspaceWindowInfo): void;
}

// module-level so the store subscription's snapshot getter stays stable across renders
const selectRegisteredWorkspacesByName = (state: WorkspaceStoreState2) => state.registeredWorkspacesByName;

/**
 * Renders the content of a registered workspace (the `children` of its `<Workspace2>`) within its own
 * DOM subtree, independent of the real global workspace window system. It emulates the workspace
 * window that contains `name`: opening/closing child workspaces (via `launchChildWorkspace()` /
 * `closeWorkspace()` from within the workspace) navigates within this component, in a window held in
 * its own local store. It renders no chrome (no title bar, maximize, hide, close, or icon); callers can
 * render their own around it.
 */
export const ExportedWorkspace: React.FC<ExportedWorkspaceProps> = ({
  name,
  instanceKey,
  workspaceProps,
  windowProps,
  groupProps,
  onWindowChanged,
}) => {
  // Reactive so the seed effect below retries when `name` registers after this component mounts.
  const registeredWorkspacesByName = useStore(workspace2Store, selectRegisteredWorkspacesByName);

  const storeRef = useRef<StoreApi<ExportedWorkspaceState>>();
  // Tracks the (instanceKey, name) pair this instance has already seeded, so we re-seed when the
  // caller changes either, but do NOT clobber the user's own navigation/close of the current one.
  const seededKeyRef = useRef<string | null>(null);
  if (!storeRef.current) {
    const openedWindow = createExportedWorkspaceWindow(name, workspaceProps, windowProps);
    storeRef.current = createLocalStore<ExportedWorkspaceState>({ openedWindow, groupProps: groupProps ?? null });
    if (openedWindow) {
      seededKeyRef.current = `${instanceKey}\u0000${name}`;
    }
  }
  const store = storeRef.current;

  useEffect(() => {
    const key = `${instanceKey}\u0000${name}`;
    if (seededKeyRef.current === key) {
      // Already seeded this (instanceKey, name); leave the user's navigation/close alone.
      return;
    }
    // When `name` is not registered yet, this shows nothing and leaves the key unmarked, so we seed
    // once it registers. Replacing the window deliberately skips the unsaved-changes prompt: per the
    // RFC, changing `name`/`instanceKey` (like unmounting) bypasses it.
    const openedWindow = createExportedWorkspaceWindow(name, workspaceProps, windowProps);
    store.setState({ openedWindow, groupProps: groupProps ?? null }, true);
    // Clear the key when nothing was seeded, so switching back to a previously seeded key re-seeds.
    seededKeyRef.current = openedWindow ? key : null;
    // `workspaceProps`/`windowProps`/`groupProps` are intentionally read but not depended on: prop
    // changes should not reset an active window, only an instanceKey/name change (or first
    // registration) should.
  }, [instanceKey, name, registeredWorkspacesByName, store]);

  const actions = useMemo(() => createLocalWindowActions(store), [store]);
  const { openedWindow, groupProps: openedGroupProps } = useStore(store);

  const leaf = openedWindow?.openedWorkspaces[openedWindow.openedWorkspaces.length - 1];
  const workspaceName = leaf?.workspaceName ?? null;
  const title = leaf?.title ?? '';
  const hasUnsavedChanges = openedWindow?.openedWorkspaces.some((w) => w.hasUnsavedChanges) ?? false;
  const windowSize: WorkspaceWindowState = 'normal';

  // Hold the callback in a ref so an inline-arrow identity does not retrigger the notify effect.
  const onWindowChangedRef = useRef(onWindowChanged);
  useEffect(() => {
    onWindowChangedRef.current = onWindowChanged;
  });
  useEffect(() => {
    onWindowChangedRef.current?.({ workspaceName, windowSize, title, hasUnsavedChanges });
  }, [workspaceName, windowSize, title, hasUnsavedChanges]);

  return (
    <div className={styles.exportedWorkspace}>
      {openedWindow ? (
        <ActiveWorkspaceWindow
          openedWindow={openedWindow}
          groupProps={openedGroupProps}
          actions={actions}
          renderChrome={false}
          showActionMenu={false}
        />
      ) : null}
    </div>
  );
};
