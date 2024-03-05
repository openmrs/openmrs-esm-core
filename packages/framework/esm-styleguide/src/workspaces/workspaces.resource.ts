import { useStore } from '@openmrs/esm-react-utils';
import { createGlobalStore } from '@openmrs/esm-state';

export interface WorkspaceInstance {
  workspaceTitle: string;
  container?: HTMLElement;
  load: () => any;
  name: string;
  props: Record<string, any>;
  cleanup?: () => void;
  onClose?(): void;
}

export interface OverlayState {
  workspaceContainer: HTMLElement | null;
  workspaceStack: Array<WorkspaceInstance>;
}

export interface WorkspaceRegistration {
  name: string;
  title: string;
  /** Use `getLifecycle` or `getAsyncLifecycle` to get the value of `load` */
  load(): Promise<any>;
}

export const workspaceRegistrations: Record<string, WorkspaceRegistration> = {};

export const workspaceStoreName = 'globalWorkspaceState';

export const workspaceStore = createGlobalStore<OverlayState>(workspaceStoreName, {
  workspaceContainer: null,
  workspaceStack: [],
});

export function getWorkspaceRegistration(name: string) {
  if (workspaceRegistrations[name]) {
    return workspaceRegistrations[name];
  }

  throw new Error(`No workspace registered with name: ${name}`);
}

export function useWorkspaceStore() {
  return useStore(workspaceStore);
}

export function closeInstance(workspaceName: string, onClose?: () => void) {
  const state = workspaceStore.getState();
  const workspaceStack = state.workspaceStack.filter((x) => x.name !== workspaceName);
  workspaceStore.setState({
    ...state,
    workspaceStack,
  });
  if (typeof onClose === 'function') {
    onClose?.();
  }
}

export function openInstance(instance: WorkspaceInstance) {
  const state = workspaceStore.getState();
  const workspaceStack = [instance, ...state.workspaceStack];

  workspaceStore.setState({
    ...state,
    workspaceStack,
  });
}
