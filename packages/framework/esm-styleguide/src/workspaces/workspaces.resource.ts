import { type ExtensionRegistration, getExtensionRegistration } from '@openmrs/esm-extensions';
import { translateFrom } from '@openmrs/esm-framework';
import { useStore } from '@openmrs/esm-react-utils';
import { createGlobalStore } from '@openmrs/esm-state';
import type { Parcel } from 'single-spa';

export interface WorkspaceInstance {
  workspaceTitle: string;
  container?: HTMLElement;
  load: () => any;
  name: string;
  additionalProps: Record<string, any>;
  cleanup?: () => void;
  closeWorkspace(options?: CloseWorkspaceOptions);
  closeWorkspaceWithSavedChanges(options?: CloseWorkspaceOptions);
  promptBeforeClosing(testFn: () => boolean);
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

export interface WorkspaceState {
  workspaceContainer: HTMLElement | null;
  openWorkspaces: Array<WorkspaceInstance>;
  prompt: Prompt | null;
}

export interface WorkspaceRegistration {
  name: string;
  title: string;
  /** Use `getLifecycle` or `getAsyncLifecycle` to get the value of `load` */
  load(): Promise<any>;
}

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

export const workspaceStoreName = 'globalWorkspaceState';

export const workspaceStore = createGlobalStore<WorkspaceState>(workspaceStoreName, {
  workspaceContainer: null,
  openWorkspaces: [],
  prompt: null,
});

function getTitleFromExtension(ext: ExtensionRegistration) {
  const title = ext?.meta?.title;
  if (typeof title === 'string') {
    return title;
  } else if (title && typeof title === 'object') {
    return translateFrom(ext.moduleName, title.key, title.default);
  }
  return ext.name;
}

export function getWorkspaceRegistration(name: string) {
  const workspaceExtension = getExtensionRegistration(name);
  if (workspaceExtension) {
    return {
      name: workspaceExtension.name,
      title: getTitleFromExtension(workspaceExtension),
      load: workspaceExtension.load,
    };
  } else {
    throw new Error(`No workspace named '${name}' has been registered.`);
  }
}

export function useWorkspaceStore() {
  return useStore(workspaceStore);
}

export function closeWorkspace(workspaceName: string, props: CloseWorkspaceOptions = {}) {
  const state = workspaceStore.getState();
  const openWorkspaces = state.openWorkspaces.filter((x) => x.name !== workspaceName);
  workspaceStore.setState({
    ...state,
    openWorkspaces,
  });
  if (typeof props?.onWorkspaceClose === 'function') {
    props?.onWorkspaceClose?.();
  }
}

const promptBeforeClosingFcns = {};

export function promptBeforeClosing(workspaceName: string, testFcn: () => boolean) {
  promptBeforeClosingFcns[workspaceName] = testFcn;
}

export function getPromptBeforeClosingFcn(workspaceName: string) {
  return promptBeforeClosingFcns[workspaceName];
}

export function cancelPrompt() {
  const store = workspaceStore;
  const state = store.getState();
  store.setState({ ...state, prompt: null });
}
