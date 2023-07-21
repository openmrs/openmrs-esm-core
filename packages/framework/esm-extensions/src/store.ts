/** @module @category Extension */
import isEqual from "lodash-es/isEqual";
import {
  configExtensionStore,
  ConfigExtensionStoreElement,
  ConfigObject,
  ExtensionSlotConfigObject,
} from "@openmrs/esm-config";
import { createGlobalStore, getGlobalStore } from "@openmrs/esm-state";
import type { LifeCycles } from "single-spa";

export interface ExtensionMeta {
  [_: string]: any;
}

export interface ExtensionRegistration {
  name: string;
  load(): Promise<{ default?: LifeCycles } & LifeCycles>;
  moduleName: string;
  meta: ExtensionMeta;
  order?: number;
  online?: boolean;
  offline?: boolean;
  privileges?: string | Array<string>;
  featureFlag?: string;
}

export interface ExtensionInfo extends ExtensionRegistration {
  /**
   * The instances where the extension has been rendered using `renderExtension`.
   */
  instances: Array<ExtensionInstance>;
}

export interface ExtensionInstance {
  id: string;
  slotName: string;
  slotModuleName: string;
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
  /** The configuration provided for this slot. `null` if not yet loaded. */
  config: ExtensionSlotConfigObject | null;
}

export interface ExtensionStore {
  slots: Record<string, ExtensionSlotState>;
}

export interface ExtensionSlotState {
  moduleName?: string;
  assignedExtensions: Array<AssignedExtension>;
}

export interface AssignedExtension {
  id: string;
  name: string;
  moduleName: string;
  meta: ExtensionMeta;
  /** The extension's config. Note that this will be `null` until the slot is mounted. */
  config: ConfigObject | null;
  online?: boolean | object;
  offline?: boolean | object;
  featureFlag?: string;
}

export interface ConnectedExtension {
  id: string;
  name: string;
  moduleName: string;
  meta: ExtensionMeta;
  /** The extension's config. Note that this will be `null` until the slot is mounted. */
  config: ConfigObject | null;
}

const extensionInternalStore = createGlobalStore<ExtensionInternalStore>(
  "extensionsInternal",
  {
    slots: {},
    extensions: {},
  }
);

/**
 * This gets the extension system's internal store. It is subject
 * to change radically and without warning. It should not be used
 * outside esm-core.
 * @internal
 */
export const getExtensionInternalStore = () =>
  getGlobalStore<ExtensionInternalStore>("extensionsInternal", {
    slots: {},
    extensions: {},
  });

/** @internal */
export function updateInternalExtensionStore(
  updater: (state: ExtensionInternalStore) => ExtensionInternalStore
) {
  const state = extensionInternalStore.getState();
  const newState = updater(state);

  if (newState !== state) {
    extensionInternalStore.setState(newState);
  }
}

/**
 * This returns a store that modules can use to get information about the
 * state of the extension system.
 */
export const getExtensionStore = () =>
  getGlobalStore<ExtensionStore>("extensions", {
    slots: {},
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
    for (let instance of extensionInfo.instances) {
      configExtensionRecords.push({
        slotModuleName: instance.slotModuleName,
        extensionModuleName: extensionInfo.moduleName,
        slotName: instance.slotName,
        extensionId: instance.id,
      });
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
