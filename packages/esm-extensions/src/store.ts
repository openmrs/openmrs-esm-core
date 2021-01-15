import { createGlobalStore } from "@openmrs/esm-api";

export interface ExtensionDefinition {
  name: string;
  load(): Promise<any>;
}

export interface ExtensionRegistration extends ExtensionDefinition {
  moduleName: string;
}

export interface ExtensionInfo extends ExtensionRegistration {
  /**
   * The instances where the extension has been rendered using `renderExtension`,
   * indexed by slotModuleName and actualExtensionSlotName
   */
  instances: Record<string, Record<string, ExtensionInstance>>;
}

export interface ExtensionInstance {
  domElement: HTMLElement;
}

export interface ExtensionStore {
  slots: Record<string, ExtensionSlotInfo>;
  extensions: Record<string, ExtensionInfo>;
}

export interface ExtensionSlotInstance {
  /**
   * The set of extensions IDs which should be rendered into this slot at the current point in time.
   */
  assignedIds: Array<string>;
  /**
   * A set of additional extension IDs which have been added to to this slot despite not being
   * explicitly `attach`ed to it.
   * An example may be an extension which is added to the slot via the configuration.
   */
  addedIds: Array<string>;
  /**
   * A set of extension IDs which have been removed/hidden from this slot, even though they have
   * previously been `attach`ed/added to it.
   * An example may be an extension which is removed from the slot via the configuration.
   */
  removedIds: Array<string>;
  /**
   * A set allowing explicit ordering of the `assignedIds`.
   */
  idOrder: Array<string>;
  /**
   * The number of active registrations on the instance.
   */
  registered: number;
  /**
   * The dom element at which the slot is mounted
   */
  domElement: HTMLElement | null;
}

export interface ExtensionSlotInfo {
  /**
   * The name under which the extension slot has been registered.
   */
  name: string;
  /**
   * The mapping of modules / extension slot instances where the extension slot has been used.
   */
  instances: Record<string, ExtensionSlotInstance>;
  /**
   * The set of extension IDs which have been attached to this slot.
   * This is essentially a complete history of `attach` calls to this specific slot.
   * However, not all of these extension IDs should be rendered.
   * `assignedIds` is the set defining those.
   */
  attachedIds: Array<string>;
  /**
   * Returns whether the given extension slot name corresponds to this ExtensionSlotInfo.
   * @param actualExtensionSlotName The actual extension slot name into which the extensions might be rendered.
   * For URL like extension slots, this should be the name where parameters have been replaced with actual values
   * (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).
   */
  matches(actualExtensionSlotName: string): boolean;
}

export interface PageDefinition {
  route: string;
  load(): Promise<any>;
}

export const extensionStore = createGlobalStore<ExtensionStore>("extensions", {
  slots: {},
  extensions: {},
});

export type MaybeAsync<T> = T | Promise<T>;

let storeUpdates: Promise<void> = Promise.resolve();

export function updateExtensionStore<U extends keyof ExtensionStore>(
  updater: (state: ExtensionStore) => MaybeAsync<Pick<ExtensionStore, U>>
) {
  storeUpdates = storeUpdates.then(async () => {
    const state = extensionStore.getState();
    const newState = await updater(state);

    if (newState !== state) {
      extensionStore.setState(newState);
    }
  });
}
