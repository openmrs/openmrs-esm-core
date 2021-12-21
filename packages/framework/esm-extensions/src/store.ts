import isEqual from "lodash-es/isEqual";
import {
  configExtensionStore,
  ConfigExtensionStoreElement,
  ExtensionSlotConfigObject,
} from "@openmrs/esm-config";
import { createGlobalStore, getGlobalStore } from "@openmrs/esm-state";

export interface ExtensionMeta {
  [_: string]: any;
}

export interface ExtensionRegistration {
  name: string;
  load(): Promise<any>;
  moduleName: string;
  meta: ExtensionMeta;
  order?: number;
  online?: boolean | object;
  offline?: boolean | object;
}

export interface ExtensionInfo extends ExtensionRegistration {
  /**
   * The instances where the extension has been rendered using `renderExtension`,
   * indexed by slotModuleName and slotName.
   */
  instances: Record<string, Record<string, ExtensionInstance>>;
}

export interface ExtensionInstance {
  id: string;
}

export interface ExtensionInternalStore {
  /** Slots indexed by name */
  slots: Record<string, ExtensionSlotInfo>;
  /** Extensions indexed by name */
  extensions: Record<string, ExtensionInfo>;
}

export interface ExtensionSlotInfo {
  /**
   * The module in which the extension slot exists. Undefined if the slot
   * hasn't been registered yet (but it has been attached or assigned to
   * an extension.
   */
  moduleName?: string;
  /** The name under which the extension slot has been registered. */
  name: string;
  /**
   * The set of extension IDs which have been attached to this slot using `attach`.
   * However, not all of these extension IDs should be rendered.
   * `assignedIds` is the set defining those.
   */
  attachedIds: Array<string>;
  /** The configuration provided for this extension slot. `null` if not yet loaded. */
  config: ExtensionSlotConfigObject | null;
}

export interface ExtensionStore {
  resultSlots: Record<string, ExtensionSlotState>;
}

export interface ExtensionSlotState {
  moduleName: string;
  assignedExtensions: Array<AssignedExtension>;
}

export interface AssignedExtension {
  id: string;
  name: string;
  meta: ExtensionMeta;
  online?: boolean | object;
  offline?: boolean | object;
}

export interface ConnectedExtension {
  id: string;
  name: string;
  meta: ExtensionMeta;
}

const extensionInternalStore = createGlobalStore<ExtensionInternalStore>(
  "extensionsInternal",
  {
    slots: {},
    extensions: {},
  }
);

/** @internal */
export const getExtensionInternalStore = () =>
  getGlobalStore<ExtensionInternalStore>("extensionsInternal", {
    slots: {},
    extensions: {},
  });

export type MaybeAsync<T> = T | Promise<T>;

let storeUpdates: Promise<void> = Promise.resolve();

/** @internal */
export function updateInternalExtensionStore(
  updater: (state: ExtensionInternalStore) => MaybeAsync<ExtensionInternalStore>
) {
  storeUpdates = storeUpdates.then(async () => {
    const state = extensionInternalStore.getState();
    const newState = await updater(state);

    if (newState !== state) {
      extensionInternalStore.setState(newState);
    }
  });
}

export const getExtensionStore = () =>
  getGlobalStore<ExtensionStore>("extensions", {
    resultSlots: {},
  });

/**
 * esm-config maintains its own store of the extension information it needs
 * to generate extension configs. We keep it updated based on what's in
 * `extensionStore`.
 */

updateConfigExtensionStore(extensionInternalStore.getState());
extensionInternalStore.subscribe(updateConfigExtensionStore);

function updateConfigExtensionStore(extensionState: ExtensionInternalStore) {
  const configExtensionRecords: Array<ConfigExtensionStoreElement> = [];

  for (let extensionInfo of Object.values(extensionState.extensions)) {
    for (let [slotModuleName, extensionBySlot] of Object.entries(
      extensionInfo.instances
    )) {
      for (let [actualSlotName, extensionInstance] of Object.entries(
        extensionBySlot
      )) {
        configExtensionRecords.push({
          slotModuleName,
          extensionModuleName: extensionInfo.moduleName,
          slotName: actualSlotName,
          extensionId: extensionInstance.id,
        });
      }
    }
  }
  if (
    !isEqual(
      configExtensionStore.getState().mountedExtensions,
      configExtensionRecords
    )
  ) {
    configExtensionStore.setState({
      mountedExtensions: configExtensionRecords,
    });
  }
}
