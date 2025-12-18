/** @module @category Workspace */
import { useMemo, type ReactNode } from 'react';
import type { StoreApi } from 'zustand/vanilla';
import {
  getWorkspaceGroupRegistration,
  getWorkspaceRegistration,
  type WorkspaceRegistration,
} from '@openmrs/esm-extensions';
import { type WorkspaceWindowState } from '@openmrs/esm-globals';
import { navigate } from '@openmrs/esm-navigation';
import { getGlobalStore, createGlobalStore } from '@openmrs/esm-state';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { useStore } from '@openmrs/esm-react-utils';

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
  /**
   * Controls whether the workspace group should be closed and store to be
   * cleared when this workspace is closed.
   * Defaults to true except when opening a new workspace of the same group.
   *
   * @default true
   */
  closeWorkspaceGroup?: boolean;
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

export interface Prompt {
  title: string;
  body: string;
  /** Defaults to "Confirm" */
  confirmText?: string;
  onConfirm(): void;
  /** Defaults to "Cancel" */
  cancelText?: string;
}

export interface WorkspaceStoreState {
  context: string | null;
  openWorkspaces: Array<OpenWorkspace>;
  prompt: Prompt | null;
  workspaceWindowState: WorkspaceWindowState;
  workspaceGroup?: {
    name: string;
    members: Array<string>;
    cleanup?(): void;
  };
}

export interface OpenWorkspace extends WorkspaceRegistration, DefaultWorkspaceProps {
  additionalProps: object;
  currentWorkspaceGroup?: string;
}

/**
 *
 * @param name Name of the workspace
 * @param ignoreChanges If set to true, the "unsaved changes" modal will never be shown, even if the `promptBeforeClosing` function returns true. The user will not be prompted before closing.
 * @returns true if the workspace can be closed.
 */
export function canCloseWorkspaceWithoutPrompting(name: string, ignoreChanges: boolean = false) {
  if (ignoreChanges) {
    return true;
  }
  const promptBeforeFn = getPromptBeforeClosingFcn(name);
  return !promptBeforeFn || !promptBeforeFn();
}

/**
 * Closes a workspace group and performs cleanup operations.
 *
 * @param groupName - The name of the workspace group to close
 * @param onWorkspaceCloseup - Optional callback function to execute after closing the workspace group
 * @returns void, or exits early if the current workspace group name doesn't match the provided group name
 *
 * @remarks
 * This function performs the following operations:
 * - Validates if the provided group name matches the current workspace group
 * - Closes all workspaces associated with the group
 * - Clears the workspace group store state
 * - Executes cleanup function if defined in the workspace group
 * - Updates the main workspace store to remove the workspace group
 * - Calls the optional closeup callback if provided
 */
function closeWorkspaceGroup(groupName: string, onWorkspaceCloseup?: () => void) {
  const store = getWorkspaceStore();
  const currentWorkspaceGroup = store.getState()?.workspaceGroup;
  const currentGroupName = currentWorkspaceGroup?.name;
  if (!currentGroupName || groupName !== currentGroupName) {
    return;
  }
  const filter: (workspace: OpenWorkspace) => boolean = currentGroupName
    ? (workspace) => workspace.currentWorkspaceGroup === currentGroupName
    : () => true;

  closeAllWorkspaces(() => {
    // Clearing the workspace group and respective store if the new workspace is not part of the current group, which is handled in the `launchWorkspace` function.
    const workspaceGroupStore = getWorkspaceGroupStore(groupName);
    if (workspaceGroupStore) {
      workspaceGroupStore.setState({}, true);
      const unsubscribe = workspaceGroupStore.subscribe(() => {});
      unsubscribe();
    }

    if (typeof currentWorkspaceGroup?.cleanup === 'function') {
      currentWorkspaceGroup.cleanup();
    }

    store.setState((prev) => ({
      ...prev,
      workspaceGroup: undefined,
    }));

    if (typeof onWorkspaceCloseup === 'function') {
      onWorkspaceCloseup();
    }
  }, filter);
}

interface LaunchWorkspaceGroupArg {
  state: Record<string | symbol | number, any>;
  onWorkspaceGroupLaunch?(): void;
  workspaceGroupCleanup?(): void;
  workspaceToLaunch?: {
    name: string;
    additionalProps?: Record<string | symbol | number, any>;
  };
}

/**
 * Launches a workspace group with the specified name and configuration.
 * If there are any open workspaces, it will first close them before launching the new workspace group.
 *
 * @param groupName - The name of the workspace group to launch
 * @param args - Configuration object for launching the workspace group
 * @param args.state - The initial state for the workspace group
 * @param args.onWorkspaceGroupLaunch - Optional callback function to be executed after the workspace group is launched
 * @param args.workspaceGroupCleanup - Optional cleanup function to be executed when the workspace group is closed
 *
 * @example
 * launchWorkspaceGroup("myGroup", {
 *   state: initialState,
 *   onWorkspaceGroupLaunch: () => console.log("Workspace group launched"),
 *   workspaceGroupCleanup: () => console.log("Cleaning up workspace group")
 * });
 */
export function launchWorkspaceGroup(groupName: string, args: LaunchWorkspaceGroupArg) {
  const workspaceGroupRegistration = getWorkspaceGroupRegistration(groupName);
  const { state, onWorkspaceGroupLaunch, workspaceGroupCleanup, workspaceToLaunch } = args;
  const store = getWorkspaceStore();
  if (store.getState().openWorkspaces.length) {
    const workspaceGroup = store.getState().workspaceGroup;
    if (workspaceGroup) {
      closeWorkspaceGroup(workspaceGroup?.name, () => {
        launchWorkspaceGroup(groupName, args);
      });
    } else {
      closeAllWorkspaces(() => {
        launchWorkspaceGroup(groupName, args);
      });
    }
  } else {
    store.setState((prev) => ({
      ...prev,
      workspaceGroup: {
        name: groupName,
        members: workspaceGroupRegistration.members,
        cleanup: workspaceGroupCleanup,
      },
    }));
    getWorkspaceGroupStore(groupName, state);
    onWorkspaceGroupLaunch?.();
    if (workspaceToLaunch) {
      launchWorkspace(workspaceToLaunch.name, workspaceToLaunch.additionalProps ?? {});
    }
  }
}

function promptBeforeLaunchingWorkspace(
  workspace: OpenWorkspace,
  newWorkspaceDetails: { name: string; additionalProps?: object },
) {
  const { name, additionalProps } = newWorkspaceDetails;
  const newWorkspaceRegistration = getWorkspaceRegistration(name);

  const proceed = () => {
    closeWorkspace(workspace.name, {
      ignoreChanges: true,
      // Calling the launchWorkspace again, since one of the `if` case
      // might resolve, but we need to check all the cases before launching the form.
      onWorkspaceClose: () => launchWorkspace(name, additionalProps),
      // If the new workspace is of the same sidebar group, then we don't need to clear the workspace group store.
      closeWorkspaceGroup: false,
    });
  };

  if (!canCloseWorkspaceWithoutPrompting(workspace.name)) {
    showWorkspacePrompts('closing-workspace-launching-new-workspace', proceed, workspace.title ?? workspace.name);
  } else {
    proceed();
  }
}

/**
 * This launches a workspace by its name. The workspace must have been registered.
 * Workspaces should be registered in the `routes.json` file.
 *
 * For the workspace to appear, there must be either a `<WorkspaceOverlay />` or
 * a `<WorkspaceWindow />` component rendered.
 *
 * The behavior of this function is as follows:
 *
 * - If no workspaces are open, or if no other workspaces with the same type are open,
 *   it will be opened and focused.
 * - If a workspace with the same name is already open, it will be displayed/focused,
 *   if it was not already.
 * - If a workspace is launched and a workspace which cannot be hidden is already open,
 *  a confirmation modal will pop up warning about closing the currently open workspace.
 * - If another workspace with the same type is open, the workspace will be brought to
 *   the front and then a confirmation modal will pop up warning about closing the opened
 *   workspace
 *
 * Note that this function just manipulates the workspace store. The UI logic is handled
 * by the components that display workspaces.
 *
 * Additional props can be passed to the workspace component being launched. Passing a
 * prop named `workspaceTitle` will override the title of the workspace.
 *
 * @param name The name of the workspace to launch
 * @param additionalProps Props to pass to the workspace component being launched. Passing
 *          a prop named `workspaceTitle` will override the title of the workspace.
 */
export function launchWorkspace<
  T extends DefaultWorkspaceProps | object = DefaultWorkspaceProps & { [key: string]: any },
>(name: string, additionalProps?: Omit<T, keyof DefaultWorkspaceProps> & { workspaceTitle?: string }) {
  const store = getWorkspaceStore();
  const workspace = getWorkspaceRegistration(name);
  const currentWorkspaceGroup = store.getState().workspaceGroup;

  if (currentWorkspaceGroup && !currentWorkspaceGroup.members?.includes(name)) {
    closeWorkspaceGroup(currentWorkspaceGroup.name, () => {
      launchWorkspace(name, additionalProps);
    });
    return;
  }
  const currentGroupName = store.getState().workspaceGroup?.name;
  const newWorkspace: OpenWorkspace = {
    ...workspace,
    title: getWorkspaceTitle(workspace, additionalProps),
    closeWorkspace: (options: CloseWorkspaceOptions = {}) => closeWorkspace(name, options),
    closeWorkspaceWithSavedChanges: (options: CloseWorkspaceOptions) =>
      closeWorkspace(name, { ignoreChanges: true, ...options }),
    promptBeforeClosing: (testFcn) => promptBeforeClosing(name, testFcn),
    setTitle: (title: string, titleNode: ReactNode) => {
      newWorkspace.title = title;
      newWorkspace.titleNode = titleNode;
      store.setState((state) => {
        const openWorkspaces = state.openWorkspaces.map((w) => (w.name === name ? newWorkspace : w));
        return {
          ...state,
          openWorkspaces,
        };
      });
    },
    currentWorkspaceGroup: currentGroupName,
    additionalProps: additionalProps ?? {},
  };

  if (currentGroupName) {
    getWorkspaceGroupStore(currentGroupName, additionalProps);
  }
  function updateStoreWithNewWorkspace(workspaceToBeAdded: OpenWorkspace, restOfTheWorkspaces?: Array<OpenWorkspace>) {
    store.setState((state) => {
      const openWorkspaces = [workspaceToBeAdded, ...(restOfTheWorkspaces ?? state.openWorkspaces)];
      let workspaceWindowState = getUpdatedWorkspaceWindowState(workspaceToBeAdded);

      return {
        ...state,
        openWorkspaces,
        workspaceWindowState,
      };
    });
  }

  const openWorkspaces = store.getState().openWorkspaces;
  const workspaceIndexInOpenWorkspaces = openWorkspaces.findIndex((w) => w.name === name);
  const isWorkspaceAlreadyOpen = workspaceIndexInOpenWorkspaces >= 0;
  const openedWorkspaceWithSameType = openWorkspaces.find((w) => w.type == newWorkspace.type);

  if (openWorkspaces.length === 0) {
    updateStoreWithNewWorkspace(newWorkspace);
  } else if (!openWorkspaces[0].canHide && workspaceIndexInOpenWorkspaces !== 0) {
    promptBeforeLaunchingWorkspace(openWorkspaces[0], {
      name,
      additionalProps,
    });
  } else if (isWorkspaceAlreadyOpen) {
    const openWorkspace = openWorkspaces[workspaceIndexInOpenWorkspaces];
    // Only update the title if it hasn't been set by `setTitle`
    if (openWorkspace.title === getWorkspaceTitle(openWorkspace, openWorkspace.additionalProps)) {
      openWorkspace.title = getWorkspaceTitle(newWorkspace, newWorkspace.additionalProps);
    }
    openWorkspace.additionalProps = newWorkspace.additionalProps;
    const restOfTheWorkspaces = openWorkspaces.filter((w) => w.name != name);
    updateStoreWithNewWorkspace(openWorkspaces[workspaceIndexInOpenWorkspaces], restOfTheWorkspaces);
  } else if (openedWorkspaceWithSameType) {
    const restOfTheWorkspaces = store.getState().openWorkspaces.filter((w) => w.type != newWorkspace.type);
    updateStoreWithNewWorkspace(openedWorkspaceWithSameType, restOfTheWorkspaces);
    promptBeforeLaunchingWorkspace(openedWorkspaceWithSameType, {
      name,
      additionalProps,
    });
  } else {
    updateStoreWithNewWorkspace(newWorkspace);
  }
}

/**
 * Use this function to navigate to a new page and launch a workspace on that page.
 *
 * @param options.targetUrl: The URL to navigate to. Will be passed to [[navigate]].
 * @param options.contextKey: The context key used by the target page.
 * @param options.workspaceName: The name of the workspace to launch.
 * @param options.additionalProps: Additional props to pass to the workspace component being launched.
 */
export function navigateAndLaunchWorkspace({
  targetUrl,
  contextKey,
  workspaceName,
  additionalProps,
}: {
  targetUrl: string;
  contextKey: string;
  workspaceName: string;
  additionalProps?: object;
}) {
  changeWorkspaceContext(contextKey);
  launchWorkspace(workspaceName, additionalProps);
  navigate({ to: targetUrl });
}

const promptBeforeClosingFcns = {};

export function promptBeforeClosing(workspaceName: string, testFcn: () => boolean) {
  promptBeforeClosingFcns[workspaceName] = testFcn;
}

export function getPromptBeforeClosingFcn(workspaceName: string) {
  return promptBeforeClosingFcns[workspaceName];
}

export function cancelPrompt() {
  const store = getWorkspaceStore();
  const state = store.getState();
  store.setState({ ...state, prompt: null });
}

const defaultOptions: CloseWorkspaceOptions = {
  ignoreChanges: false,
  onWorkspaceClose: () => {},
  closeWorkspaceGroup: true,
};

/**
 * Function to close an opened workspace
 * @param name Workspace registration name
 * @param options Options to close workspace
 */
export function closeWorkspace(name: string, options: CloseWorkspaceOptions = {}): boolean {
  options = { ...defaultOptions, ...options };
  const store = getWorkspaceStore();

  const updateStoreWithClosedWorkspace = () => {
    const state = store.getState();
    const workspaceToBeClosed = state.openWorkspaces.find((w) => w.name === name);
    const newOpenWorkspaces = state.openWorkspaces.filter((w) => w.name != name);

    const workspaceGroupName = store.getState().workspaceGroup?.name;

    if (workspaceGroupName && options.closeWorkspaceGroup) {
      closeWorkspaceGroup(workspaceGroupName);
    }

    // ensure closed workspace will not prompt
    promptBeforeClosing(name, () => false);
    store.setState((prev) => ({
      ...prev,
      prompt: null,
      openWorkspaces: newOpenWorkspaces,
      workspaceWindowState: getUpdatedWorkspaceWindowState(newOpenWorkspaces?.[0]),
    }));

    options?.onWorkspaceClose?.();
  };

  if (!canCloseWorkspaceWithoutPrompting(name, options?.ignoreChanges)) {
    const currentName = getWorkspaceRegistration(name).title ?? name;
    showWorkspacePrompts('closing-workspace', updateStoreWithClosedWorkspace, currentName);
    return false;
  } else {
    updateStoreWithClosedWorkspace();
    return true;
  }
}

/**
 * The set of workspaces is specific to a particular page. This function
 * should be used when transitioning to a new page. If the current
 * workspace data is for a different page, the workspace state is cleared.
 *
 * This is called by the workspace components when they mount.
 * @internal
 *
 * @param contextKey An arbitrary key to identify the current page
 */
export function changeWorkspaceContext(contextKey: string | null) {
  const store = getWorkspaceStore();
  const state = store.getState();
  if (state.context != contextKey) {
    store.setState({ context: contextKey, openWorkspaces: [], prompt: null });
  }
}

const initialState: WorkspaceStoreState = {
  context: '',
  openWorkspaces: [],
  prompt: null,
  workspaceWindowState: 'normal',
  workspaceGroup: undefined,
};

export const workspaceStore = createGlobalStore('workspace', initialState);

export function getWorkspaceStore() {
  return workspaceStore;
}

export function updateWorkspaceWindowState(value: WorkspaceWindowState) {
  const store = getWorkspaceStore();
  const state = store.getState();
  store.setState({ ...state, workspaceWindowState: value });
}

function getUpdatedWorkspaceWindowState(workspaceAtTop: OpenWorkspace) {
  return workspaceAtTop?.preferredWindowSize ?? 'normal';
}
export function closeAllWorkspaces(
  onClosingWorkspaces: () => void = () => {},
  filter: (workspace: OpenWorkspace) => boolean = () => true,
) {
  const store = getWorkspaceStore();

  const canCloseAllWorkspaces = store
    .getState()
    .openWorkspaces.filter(filter)
    .every(({ name }) => {
      return canCloseWorkspaceWithoutPrompting(name);
    });

  const updateWorkspaceStore = () => {
    resetWorkspaceStore();
    onClosingWorkspaces?.();
  };

  if (!canCloseAllWorkspaces) {
    showWorkspacePrompts('closing-all-workspaces', updateWorkspaceStore);
  } else {
    updateWorkspaceStore();
  }
}

export interface WorkspacesInfo {
  active: boolean;
  prompt: Prompt | null;
  workspaceWindowState: WorkspaceWindowState;
  workspaces: Array<OpenWorkspace>;
  workspaceGroup?: WorkspaceStoreState['workspaceGroup'];
}

export function useWorkspaces(): WorkspacesInfo {
  const { workspaceWindowState, openWorkspaces, prompt, workspaceGroup } = useStore(workspaceStore);
  const memoisedResults: WorkspacesInfo = useMemo(() => {
    return {
      active: openWorkspaces.length > 0,
      prompt,
      workspaceWindowState,
      workspaces: openWorkspaces,
      workspaceGroup,
    };
  }, [openWorkspaces, workspaceWindowState, prompt, workspaceGroup]);
  return memoisedResults;
}

type PromptType = 'closing-workspace' | 'closing-all-workspaces' | 'closing-workspace-launching-new-workspace';

/**
 * Sets the current prompt according to the prompt type.
 * @param promptType Determines the text and behavior of the prompt
 * @param onConfirmation Function to be called after the user confirms to close the workspace
 * @param workspaceTitle Workspace title to be shown in the prompt
 * @returns
 */
export function showWorkspacePrompts(
  promptType: PromptType,
  onConfirmation: () => void = () => {},
  workspaceTitle: string = '',
) {
  const store = getWorkspaceStore();

  let prompt: Prompt;
  switch (promptType) {
    case 'closing-workspace': {
      prompt = {
        title: getCoreTranslation('unsavedChangesTitleText', 'Unsaved changes'),
        body: getCoreTranslation(
          'unsavedChangesInOpenedWorkspace',
          `You may have unsaved changes in the opened workspace. Do you want to discard these changes?`,
        ),
        onConfirm: () => {
          onConfirmation?.();
        },
        confirmText: getCoreTranslation('discard', 'Discard'),
      };
      break;
    }

    case 'closing-all-workspaces': {
      const workspacesNotClosed = store
        .getState()
        .openWorkspaces.filter(({ name }) => !canCloseWorkspaceWithoutPrompting(name))
        .map(({ title }, indx) => `${indx + 1}. ${title}`);

      prompt = {
        title: getCoreTranslation('closingAllWorkspacesPromptTitle', 'You have unsaved changes'),
        body: getCoreTranslation(
          'closingAllWorkspacesPromptBody',
          'There may be unsaved changes in the following workspaces. Do you want to discard changes in the following workspaces? {{workspaceNames}}',
          {
            workspaceNames: workspacesNotClosed.join(','),
          },
        ),
        onConfirm: () => {
          onConfirmation?.();
        },
        confirmText: getCoreTranslation('closeAllOpenedWorkspaces', 'Discard changes in {{count}} workspaces', {
          count: workspacesNotClosed.length,
        }),
      };
      break;
    }
    case 'closing-workspace-launching-new-workspace': {
      prompt = {
        title: getCoreTranslation('unsavedChangesTitleText', 'Unsaved changes'),
        body: getCoreTranslation(
          'unsavedChangesInWorkspace',
          'There may be unsaved changes in "{{workspaceName}}". Please save them before opening another workspace.',
          { workspaceName: workspaceTitle },
        ),
        onConfirm: () => {
          store.setState((state) => ({
            ...state,
            prompt: null,
          }));
          onConfirmation?.();
        },
        confirmText: getCoreTranslation('openAnyway', 'Open anyway'),
      };
      break;
    }
    default: {
      console.error(
        `Workspace system trying to open unknown prompt type "${promptType}" in function "showWorkspacePrompts"`,
      );
      onConfirmation?.();
      return;
    }
  }
  store.setState((state) => ({ ...state, prompt }));
}

function getWorkspaceTitle(workspace: WorkspaceRegistration, additionalProps?: object) {
  return additionalProps?.['workspaceTitle'] ?? workspace.title;
}

export function resetWorkspaceStore() {
  getWorkspaceStore().setState(initialState);
}

/**
 * The workspace group store is a store that is specific to the workspace group.
 * If the workspace has its own sidebar, the store will be created.
 * This store can be used to store data that is specific to the workspace group.
 * The store will be same for all the workspaces with same group name.
 *
 * For workspaces launched without a group, the store will be undefined.
 *
 * The store will be cleared when all the workspaces with the store's group name are closed.
 */
export function getWorkspaceGroupStore(
  workspaceGroupName: string | undefined,
  additionalProps: object = {},
): StoreApi<object> | undefined {
  if (!workspaceGroupName || workspaceGroupName === 'default') {
    return undefined;
  }
  const store = getGlobalStore<object>(workspaceGroupName, {});
  if (additionalProps) {
    store.setState((prev) => ({
      ...prev,
      ...additionalProps,
    }));
  }
  return store;
}
