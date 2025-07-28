import { type LifeCycles } from 'single-spa';
import { createGlobalStore } from '@openmrs/esm-state';
import { getExtensionRegistration } from '.';

/** @internal */
export interface ModalRegistration {
  name: string;
  load(): Promise<LifeCycles>;
  moduleName: string;
}

interface ModalRegistry {
  /** Modals indexed by name */
  modals: Record<string, ModalRegistration>;
}

const modalRegistryStore = createGlobalStore<ModalRegistry>('modalRegistry', {
  modals: {},
});

/** @internal */
export function registerModal(modalRegistration: ModalRegistration) {
  modalRegistryStore.setState((state) => {
    state.modals[modalRegistration.name] = modalRegistration;
    return state;
  });
}

/** @internal */
export function getModalRegistration(modalName: string): ModalRegistration | undefined {
  let modalRegistration = modalRegistryStore.getState().modals[modalName];
  if (!modalRegistration) {
    const extensionRegistration = getExtensionRegistration(modalName);
    if (extensionRegistration) {
      modalRegistration = {
        name: modalName,
        load: extensionRegistration.load,
        moduleName: extensionRegistration.moduleName,
      };
      console.warn(
        `Modal ${modalName} was registered as an extension. This is deprecated and will be removed in the future. Please register it in the "modals" section of routes.json instead of the "extensions" section.`,
      );
      // Register it so the warning only appears once
      registerModal(modalRegistration);
    }
  }
  return modalRegistration;
}
