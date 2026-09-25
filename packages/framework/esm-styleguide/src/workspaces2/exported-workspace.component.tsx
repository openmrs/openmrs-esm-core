import React, { useEffect, useMemo, useRef } from 'react';
import { workspace2Store, type WorkspaceStoreState2 } from '@openmrs/esm-extensions';
import { type WorkspaceWindowState } from '@openmrs/esm-globals';
import { useStore } from '@openmrs/esm-react-utils';
import { createLocalStore, type StoreApi } from '@openmrs/esm-state';
import { shallowEqual } from '@openmrs/esm-utils';
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
  /**
   * The name of the workspace to open. Changing it (like changing `workspaceProps`, `windowProps` or
   * `groupProps`) discards the current workspaces, without prompting for unsaved changes, and opens
   * `name` afresh. To force a fresh instance without changing any of these, change the React `key`.
   */
  name: string;

  /**
   * The props passed into the workspace. Changing these (compared shallowly), or `windowProps` /
   * `groupProps`, discards the current workspaces and opens `name` afresh with the new props.
   */
  workspaceProps: Record<string, any>;
  windowProps?: Record<string, any>;
  groupProps?: Record<string, any>;

  /** Callback fired when the emulated window's state changes. */
  onWindowChanged?(info: ExportedWorkspaceWindowInfo): void;
}

// module-level so the store subscription's snapshot getter stays stable across renders
const selectRegisteredWorkspacesByName = (state: WorkspaceStoreState2) => state.registeredWorkspacesByName;

type SeedInputs = Pick<ExportedWorkspaceProps, 'name' | 'workspaceProps' | 'windowProps' | 'groupProps'>;

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
  workspaceProps,
  windowProps,
  groupProps,
  onWindowChanged,
}) => {
  // Reactive so the seed effect below retries when `name` registers after this component mounts.
  const registeredWorkspacesByName = useStore(workspace2Store, selectRegisteredWorkspacesByName);

  const seedInputs: SeedInputs = { name, workspaceProps, windowProps, groupProps };
  const storeRef = useRef<StoreApi<ExportedWorkspaceState>>();
  // The inputs this instance has already seeded, so we re-seed when the caller changes any of them,
  // but do NOT clobber the user's own navigation/close of the current one.
  const seededInputsRef = useRef<SeedInputs | null>(null);
  if (!storeRef.current) {
    const openedWindow = createExportedWorkspaceWindow(name, workspaceProps, windowProps);
    storeRef.current = createLocalStore<ExportedWorkspaceState>({ openedWindow, groupProps: groupProps ?? null });
    if (openedWindow) {
      seededInputsRef.current = seedInputs;
    }
  }
  const store = storeRef.current;

  useEffect(() => {
    const seeded = seededInputsRef.current;
    // Props are compared shallowly so that callers passing inline object literals do not re-seed on
    // every render.
    if (
      seeded &&
      seeded.name === name &&
      shallowEqual(seeded.workspaceProps, workspaceProps) &&
      shallowEqual(seeded.windowProps, windowProps) &&
      shallowEqual(seeded.groupProps, groupProps)
    ) {
      // Already seeded these inputs; leave the user's navigation/close alone.
      return;
    }
    // When `name` is not registered yet, this shows nothing and leaves the inputs unmarked, so we seed
    // once it registers. Changes to props resets the state (like navigation) and bypassed the unsaved-changes prompt
    const openedWindow = createExportedWorkspaceWindow(name, workspaceProps, windowProps);
    store.setState({ openedWindow, groupProps: groupProps ?? null }, true);
    // Clear the inputs when nothing was seeded, so switching back to previously seeded inputs re-seeds.
    seededInputsRef.current = openedWindow ? seedInputs : null;
  }, [name, workspaceProps, windowProps, groupProps, registeredWorkspacesByName, store]);

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
