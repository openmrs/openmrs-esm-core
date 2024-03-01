import { useStore } from '@openmrs/esm-react-utils';
import { createGlobalStore } from '@openmrs/esm-state';

export interface OverlayInstance {
  overlayTitle: string;
  container?: HTMLElement;
  load: () => any;
  name: string;
  props: Record<string, any>;
  cleanup?: () => void;
  onClose?(): void;
}

export interface OverlayState {
  overlayContainer: HTMLElement | null;
  overlayStack: Array<OverlayInstance>;
}

export interface OverlayRegistration {
  name: string;
  title: string;
  /** Use `getLifecycle` or `getAsyncLifecycle` to get the value of `load` */
  load(): Promise<any>;
}

export const overlayRegistrations: Record<string, OverlayRegistration> = {};

export const overlayStore = createGlobalStore<OverlayState>('globalOverlayState', {
  overlayContainer: null,
  overlayStack: [],
});

export function getOverlayRegistration(name: string) {
  return overlayRegistrations[name];
}

export function useOverlayStore() {
  return useStore(overlayStore);
}

export function closeInstance(overlayName: string, onClose?: () => void) {
  const state = overlayStore.getState();
  const overlayStack = state.overlayStack.filter((x) => x.name !== overlayName);
  overlayStore.setState({
    ...state,
    overlayStack,
  });
  if (typeof onClose === 'function') {
    onClose?.();
  }
}

export function openInstance(instance: OverlayInstance) {
  const state = overlayStore.getState();
  const overlayStack = [instance, ...state.overlayStack];

  overlayStore.setState({
    ...state,
    overlayStack,
  });
}
