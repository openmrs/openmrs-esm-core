/** @module @category Workspace */
import { useMemo } from 'react';
import { type LifeCycles } from 'single-spa';
import _i18n from 'i18next';
import { type ExtensionRegistration, getExtensionRegistration } from '@openmrs/esm-extensions';
import { type WorkspaceWindowState } from '@openmrs/esm-globals';
import { useStore } from '@openmrs/esm-react-utils';
import { navigate } from '@openmrs/esm-navigation';
import { getGlobalStore, createGlobalStore } from '@openmrs/esm-state';
import { getCoreTranslation, translateFrom } from '@openmrs/esm-translations';
import { type CloseWorkspaceOptions } from './types';

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
}

/** See [[WorkspaceDefinition]] for more information about these properties */
export interface WorkspaceRegistration {
  name: string;
  title: string;
  type: string;
  canHide: boolean;
  canMaximize: boolean;
  width: 'narrow' | 'wider';
  preferredWindowSize: WorkspaceWindowState;
  load: () => Promise<{ default?: LifeCycles } & LifeCycles>;
  moduleName: string;
}

export interface OpenWorkspace extends WorkspaceRegistration {
  additionalProps: object;
  closeWorkspace(closeWorkspaceOptions?: CloseWorkspaceOptions): boolean;
  closeWorkspaceWithSavedChanges(closeWorkspaceOptions?: CloseWorkspaceOptions): boolean;
  promptBeforeClosing(testFcn: () => boolean): void;
}

interface WorkspaceRegistrationStore {
  workspaces: Record<string, WorkspaceRegistration>;
}

const workspaceRegistrationStore = createGlobalStore<WorkspaceRegistrationStore>('workspaceRegistrations', {
  workspaces: {},
});

/** See [[WorkspaceDefinition]] for more information about these properties */
export interface RegisterWorkspaceOptions {
  name: string;
  title: string;
  type?: string;
  canHide?: boolean;
  canMaximize?: boolean;
  width?: 'narrow' | 'wider';
  preferredWindowSize?: WorkspaceWindowState;
  load: () => Promise<{ default?: LifeCycles } & LifeCycles>;
  moduleName: string;
}

/**
 * Tells the workspace system about a workspace. This is used by the app shell
 * to register workspaces defined in the `routes.json` file.
 * @internal
 */
export function registerWorkspace(workspace: RegisterWorkspaceOptions) {
  workspaceRegistrationStore.setState((state) => ({
    workspaces: {
      ...state.workspaces,
      [workspace.name]: {
        ...workspace,
        preferredWindowSize: workspace.preferredWindowSize ?? 'normal',
        type: workspace.type ?? 'form',
        canHide: workspace.canHide ?? false,
        canMaximize: workspace.canMaximize ?? false,
        width: workspace.width ?? 'narrow',
      },
    },
  }));
}

const workspaceExtensionWarningsIssued = new Set();
/**
 * This exists for compatibility with the old way of registering
 * workspaces (as extensions).
 *
 * @param name of the workspace
 */
function getWorkspaceRegistration(name: string): WorkspaceRegistration {
  const registeredWorkspaces = workspaceRegistrationStore.getState().workspaces;
  if (registeredWorkspaces[name]) {
    return registeredWorkspaces[name];
  } else {
    const workspaceExtension = getExtensionRegistration(name);
    if (workspaceExtension) {
      if (!workspaceExtensionWarningsIssued.has(name)) {
        console.warn(
          `The workspace '${name}' is registered as an extension. This is deprecated. Please register it in the "workspaces" section of the routes.json file.`,
        );
        workspaceExtensionWarningsIssued.add(name);
      }
      return {
        name: workspaceExtension.name,
        title: getTitleFromExtension(workspaceExtension),
        moduleName: workspaceExtension.moduleName,
        preferredWindowSize: workspaceExtension.meta?.screenSize ?? 'normal',
        load: workspaceExtension.load,
        type: workspaceExtension.meta?.type ?? 'form',
        canHide: workspaceExtension.meta?.canHide ?? false,
        canMaximize: workspaceExtension.meta?.canMaximize ?? false,
        width: workspaceExtension.meta?.width ?? 'narrow',
      };
    } else {
      throw new Error(`No workspace named '${name}' has been registered.`);
    }
  }
}

function getTitleFromExtension(ext: ExtensionRegistration) {
  const title = ext?.meta?.title;
  if (typeof title === 'string') {
    return title;
  } else if (title && typeof title === 'object') {
    return translateFrom(ext.moduleName, title.key, title.default);
  }
  return ext.name;
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

function promptBeforeLaunchingWorkspace(
  workspace: OpenWorkspace,
  newWorkspaceDetails: { name: string; additionalProps?: object },
) {
  const { name, additionalProps } = newWorkspaceDetails;

  const proceed = () => {
    workspace.closeWorkspace({
      ignoreChanges: true,
      // Calling the launchWorkspace again, since one of the `if` case
      // might resolve, but we need to check all the cases before launching the form.
      onWorkspaceClose: () => launchWorkspace(name, additionalProps),
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
 * @param name The name of the workspace to launch
 * @param additionalProps Props to pass to the workspace component being launched
 */
export function launchWorkspace(name: string, additionalProps?: object) {
  const store = getWorkspaceStore();
  const workspace = getWorkspaceRegistration(name);
  const newWorkspace = {
    ...workspace,
    closeWorkspace: (options: CloseWorkspaceOptions = {}) => closeWorkspace(name, options),
    closeWorkspaceWithSavedChanges: (options: CloseWorkspaceOptions) =>
      closeWorkspace(name, { ignoreChanges: true, ...options }),
    promptBeforeClosing: (testFcn) => promptBeforeClosing(name, testFcn),
    additionalProps: additionalProps ?? {},
  };

  function updateStoreWithNewWorkspace(workspaceToBeAdded: OpenWorkspace, restOfTheWorkspaces?: Array<OpenWorkspace>) {
    store.setState((state) => {
      const openWorkspaces = [workspaceToBeAdded, ...(restOfTheWorkspaces ?? state.openWorkspaces)];
      let workspaceWindowState = getUpdatedWorkspaceWindowState(openWorkspaces[0]);

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
    openWorkspaces[workspaceIndexInOpenWorkspaces].additionalProps = newWorkspace.additionalProps;
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

/**
 * Function to close an opened workspace
 * @param name Workspace registration name
 * @param options Options to close workspace
 */
export function closeWorkspace(
  name: string,
  options: CloseWorkspaceOptions = {
    ignoreChanges: false,
    onWorkspaceClose: () => {},
  },
): boolean {
  const store = getWorkspaceStore();

  const updateStoreWithClosedWorkspace = () => {
    const state = store.getState();
    const newOpenWorkspaces = state.openWorkspaces.filter((w) => w.name != name);

    // ensure closed workspace will not prompt
    promptBeforeClosing(name, () => false);
    store.setState({
      ...state,
      prompt: null,
      openWorkspaces: newOpenWorkspaces,
      workspaceWindowState: getUpdatedWorkspaceWindowState(newOpenWorkspaces?.[0]),
    });

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
};

export const workspaceStore = createGlobalStore('workspace', initialState);

export function getWorkspaceStore() {
  return getGlobalStore<WorkspaceStoreState>('workspace', initialState);
}

export function updateWorkspaceWindowState(value: WorkspaceWindowState) {
  const store = getWorkspaceStore();
  const state = store.getState();
  store.setState({ ...state, workspaceWindowState: value });
}

function getUpdatedWorkspaceWindowState(workspaceAtTop: OpenWorkspace) {
  return workspaceAtTop?.preferredWindowSize ?? 'normal';
}
export function closeAllWorkspaces(onClosingWorkspaces: () => void = () => {}) {
  const store = getWorkspaceStore();

  const canCloseAllWorkspaces = store.getState().openWorkspaces.every(({ name }) => {
    const canCloseWorkspace = canCloseWorkspaceWithoutPrompting(name);
    return canCloseWorkspace;
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
}

export function useWorkspaces(): WorkspacesInfo {
  const { workspaceWindowState, openWorkspaces, prompt } = useStore(workspaceStore);

  const memoisedResults = useMemo(
    () => ({
      active: openWorkspaces.length > 0,
      prompt,
      workspaceWindowState,
      workspaces: openWorkspaces,
    }),
    [openWorkspaces, workspaceWindowState, prompt],
  );

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
        title: getCoreTranslation('unsavedChangesTitleText', 'Unsaved Changes'),
        body: getCoreTranslation(
          'unsavedChangesInOpenedWorkspace',
          `You have unsaved changes in the opened workspace. Do you want to discard these changes?`,
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
          'There are unsaved changes in the following workspaces. Do you want to discard changes in the following workspaces? {{workspaceNames}}',
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
        title: getCoreTranslation('unsavedChangesTitleText', 'Unsaved Changes'),
        body: getCoreTranslation(
          'unsavedChangesInWorkspace',
          'There are unsaved changes in {{workspaceName}}. Please save them before opening another workspace.',
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

export function resetWorkspaceStore() {
  getWorkspaceStore().setState(initialState);
}
