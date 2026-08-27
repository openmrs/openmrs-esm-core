/** @module @category Extension */
import { isEqual } from 'lodash-es';
import type { ConfigExtensionStoreElement, ConfigObject, ExtensionSlotConfig } from '@openmrs/esm-config';
import { configExtensionStore } from '@openmrs/esm-config';
import { createGlobalStore, getGlobalStore } from '@openmrs/esm-state';
import { type LifeCycles } from 'single-spa';

export interface ExtensionMeta {
  [_: string]: any;
}

export interface ExtensionRegistration {
  readonly name: string;
  load(): Promise<LifeCycles>;
  readonly moduleName: string;
  readonly meta: Readonly<ExtensionMeta>;
  readonly order?: number;
  readonly online?: boolean;
  readonly offline?: boolean;
  readonly privileges?: string | Array<string>;
  readonly featureFlag?: string;
  readonly displayExpression?: string;
}

/**
 * @deprecated Use `ExtensionRegistration`, which this aliases. Rendered instances are not
 *   reachable from a registration; they are tracked separately.
 */
export type ExtensionInfo = ExtensionRegistration;

/**
 * A single rendering of an extension into a slot. One registered extension can have any number
 * of these at a time — the same extension may be mounted into several slots, or into several
 * simultaneously-rendered copies of the same slot.
 */
export interface ExtensionInstance {
  /** Uniquely identifies this rendering. Never reused. */
  readonly instanceId: string;
  /** The name of the extension being rendered. */
  readonly extensionName: string;
  /** The module which registered the extension. */
  readonly extensionModuleName: string;
  /** The extension ID, which is the extension name plus an optional `#`-suffix. */
  readonly id: string;
  readonly slotName: string;
  readonly slotModuleName: string;
}

export interface ExtensionInternalStore {
  /** Slots indexed by name */
  slots: Record<string, ExtensionSlotInfo>;
  /** Extension registrations indexed by name */
  extensions: Record<string, ExtensionRegistration>;
}

export interface ExtensionInstancesStore {
  /**
   * Currently-rendered extension instances, indexed by instance ID.
   *
   * The map is mutated in place as extensions mount and unmount — an application routinely renders
   * thousands of instances at once, and copying them all on every mount is quadratic over a page's
   * lifetime. Read it during render, as a store consumer does; a reference held across a change
   * reflects the new contents rather than the state it was read from.
   */
  instances: ReadonlyMap<string, ExtensionInstance>;
}

export type ExtensionSlotCustomState = Record<string | symbol | number, unknown> | undefined | null;

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
  config: Omit<ExtensionSlotConfig, 'configuration'> | null;
  state?: ExtensionSlotCustomState;
}

export interface ExtensionStore {
  slots: Record<string, ExtensionSlotState>;
}

export interface ExtensionSlotState {
  moduleName?: string;
  assignedExtensions: Array<AssignedExtension>;
  state?: ExtensionSlotCustomState;
}

export interface AssignedExtension {
  readonly id: string;
  readonly name: string;
  readonly moduleName: string;
  readonly meta: Readonly<ExtensionMeta>;
  /** The extension's config. Note that this will be `null` until the slot is mounted. */
  readonly config: Readonly<ConfigObject> | null;
  readonly online?: boolean | object;
  readonly offline?: boolean | object;
  readonly featureFlag?: string;
  /**
   * The condition under which this extension should be displayed, if it has one. Unresolved: a
   * slot can be rendered several times at once with different state, so the condition can only be
   * evaluated against the state of a particular rendering. Pass these extensions through
   * `filterExtensionsByDisplayConditions` with that state before displaying them.
   */
  readonly displayConditionExpression?: string;
}

/** @deprecated replaced with AssignedExtension */
export interface ConnectedExtension {
  readonly id: string;
  readonly name: string;
  readonly moduleName: string;
  readonly meta: Readonly<ExtensionMeta>;
  /** The extension's config. Note that this will be `null` until the slot is mounted. */
  readonly config: Readonly<ConfigObject> | null;
}

const extensionInternalStore = createGlobalStore<ExtensionInternalStore>('extensionsInternal', {
  slots: {},
  extensions: {},
});

const extensionInstancesStore = createGlobalStore<ExtensionInstancesStore>('extensionInstances', {
  instances: new Map(),
});

/**
 * This gets the extension system's internal store. It is subject
 * to change radically and without warning. It should not be used
 * outside esm-core.
 * @internal
 */
export const getExtensionInternalStore = () =>
  getGlobalStore<ExtensionInternalStore>('extensionsInternal', {
    slots: {},
    extensions: {},
  });

/**
 * This gets the store of currently-rendered extension instances. Instances are added by
 * `renderExtension` and removed once their parcel is gone — whether it unmounted, failed to load,
 * or failed to mount. It is subject to change radically and without warning. It should not be
 * used outside esm-core.
 * @internal
 */
export const getExtensionInstancesStore = () =>
  getGlobalStore<ExtensionInstancesStore>('extensionInstances', {
    instances: new Map(),
  });

/** @internal */
export function updateInternalExtensionStore(updater: (state: ExtensionInternalStore) => ExtensionInternalStore) {
  // The guard below is what makes a no-op updater free: an updater that returns the state it was
  // given never reaches `setState`, so no subscriber runs.
  const state = extensionInternalStore.getState();
  const newState = updater(state);

  if (newState !== state) {
    extensionInternalStore.setState(newState);
  }
}

/**
 * The instance map this module owns and mutates, and the state object it last published. Comparing
 * the store's current state against that is how a write from anywhere else — a test reset, say — is
 * detected, so the map and the record counts below can be rebuilt from it.
 */
let ownedInstances: Map<string, ExtensionInstance> | null = null;
let publishedInstances: ExtensionInstancesStore | null = null;

function currentInstances() {
  const state = extensionInstancesStore.getState();

  if (!ownedInstances || state !== publishedInstances) {
    // Tolerates a plain object as well as a map: this store is reset by test harnesses, and a
    // throw here would escape from inside a `setState` call.
    ownedInstances = new Map(state.instances instanceof Map ? state.instances : Object.entries(state.instances ?? {}));
    publishedInstances = state;
    rebuildConfigExtensionRecords(ownedInstances);
  }

  return ownedInstances;
}

function publishInstances(instances: Map<string, ExtensionInstance>) {
  publishedInstances = { instances };
  extensionInstancesStore.setState(publishedInstances, true);
}

/** @internal */
export function registerExtensionInstance(instance: ExtensionInstance) {
  const instances = currentInstances();

  if (instances.has(instance.instanceId)) {
    return;
  }

  instances.set(instance.instanceId, instance);
  configExtensionRecordsChanged = countInstanceRecord(instance, 1) || configExtensionRecordsChanged;
  publishInstances(instances);
}

/** @internal */
export function unregisterExtensionInstance(instanceId: string) {
  const instances = currentInstances();
  const instance = instances.get(instanceId);

  if (!instance) {
    return;
  }

  instances.delete(instanceId);
  configExtensionRecordsChanged = countInstanceRecord(instance, -1) || configExtensionRecordsChanged;
  publishInstances(instances);
}

/**
 * This returns a store that modules can use to get information about the
 * state of the extension system.
 */
export const getExtensionStore = () =>
  getGlobalStore<ExtensionStore>('extensions', {
    slots: {},
  });

let batchDepth = 0;
const pendingRecomputations = new Set<() => void>();

/**
 * Recomputing the extension system's derived state is eager: each write to one of its input
 * stores immediately re-derives the output store and the config bridge. `batchExtensionUpdates`
 * defers that work until `fn` returns, so a burst of related writes — registering all of an
 * app's extensions, say — costs one recomputation rather than one per write.
 *
 * Calls nest, and only the outermost one flushes. `fn` must be synchronous: the batch ends when
 * `fn` returns, so anything written after an `await` is not batched.
 */
export function batchExtensionUpdates<T>(fn: () => T): T {
  batchDepth++;

  try {
    return fn();
  } finally {
    batchDepth--;

    if (batchDepth === 0 && pendingRecomputations.size > 0) {
      const pending = Array.from(pendingRecomputations);
      pendingRecomputations.clear();

      for (const recompute of pending) {
        // Isolated so one failure doesn't drop the recomputations queued behind it, and so an
        // exception here can't escape the `finally` and replace one thrown by `fn` itself.
        try {
          recompute();
        } catch (e) {
          console.error(`The extension system's '${recompute.name}' recomputation failed`, e);
        }
      }
    }
  }
}

/**
 * Runs `recompute` now, or defers it to the end of the enclosing `batchExtensionUpdates` call.
 * Deferred callbacks are de-duplicated, so a batch ends in one pass per derived target.
 * @internal
 */
export function scheduleRecomputation(recompute: () => void) {
  if (batchDepth > 0) {
    pendingRecomputations.add(recompute);
  } else {
    recompute();
  }
}

/**
 * esm-config maintains its own store of the extension information it needs
 * to generate extension configs. We keep it updated based on which extension
 * instances are currently rendered.
 */

/**
 * The config system derives one config per slot and extension, so any number of rendered instances
 * of the same extension in the same slot collapse into a single record. These counts track how many
 * instances stand behind each record.
 *
 * They are maintained as instances come and go rather than rebuilt from the instances store, because
 * an application routinely has thousands of instances rendered at once: rebuilding would make every
 * mount and unmount cost a walk over all of them, where this way rendering another copy of a slot
 * already on screen costs nothing.
 */
const configExtensionRecordCounts = new Map<string, { count: number; record: ConfigExtensionStoreElement }>();

let configExtensionRecordsChanged = false;

updateConfigExtensionStoreToCurrent();
extensionInstancesStore.subscribe(() => scheduleRecomputation(updateConfigExtensionStoreToCurrent));

/** @returns whether the set of records changed, rather than just the count behind one of them. */
function countInstanceRecord(instance: ExtensionInstance, delta: 1 | -1) {
  const key = [instance.slotName, instance.id, instance.slotModuleName, instance.extensionModuleName].join(' ');
  const counted = configExtensionRecordCounts.get(key);

  if (!counted) {
    if (delta < 0) {
      return false;
    }

    configExtensionRecordCounts.set(key, {
      count: 1,
      record: {
        slotModuleName: instance.slotModuleName,
        extensionModuleName: instance.extensionModuleName,
        slotName: instance.slotName,
        extensionId: instance.id,
      },
    });

    return true;
  }

  counted.count += delta;

  if (counted.count < 1) {
    configExtensionRecordCounts.delete(key);
    return true;
  }

  return false;
}

function rebuildConfigExtensionRecords(instances: ReadonlyMap<string, ExtensionInstance>) {
  configExtensionRecordCounts.clear();

  for (const instance of instances.values()) {
    countInstanceRecord(instance, 1);
  }

  configExtensionRecordsChanged = true;
}

function updateConfigExtensionStoreToCurrent() {
  // Catches a write that bypassed the helpers above, which has to rebuild the counts.
  currentInstances();

  if (!configExtensionRecordsChanged) {
    return;
  }

  configExtensionRecordsChanged = false;

  const configExtensionRecords = Array.from(configExtensionRecordCounts.values(), ({ record }) => record);
  // Compared as an array, so an unstable order would look like a change and trigger a full config
  // recomputation every time an instance is remounted in a different position.
  configExtensionRecords.sort(compareConfigExtensionRecords);

  if (!isEqual(configExtensionStore.getState().mountedExtensions, configExtensionRecords)) {
    configExtensionStore.setState({
      mountedExtensions: configExtensionRecords,
    });
  }
}

function compareConfigExtensionRecords(a: ConfigExtensionStoreElement, b: ConfigExtensionStoreElement) {
  return (
    a.slotName.localeCompare(b.slotName, 'en') ||
    a.extensionId.localeCompare(b.extensionId, 'en') ||
    a.slotModuleName.localeCompare(b.slotModuleName, 'en') ||
    a.extensionModuleName.localeCompare(b.extensionModuleName, 'en')
  );
}
