/** @module @category Extension */
import type { ConfigExtensionStoreElement, ConfigObject } from '@openmrs/esm-config';
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
 * @deprecated Use `ExtensionRegistration`, which this aliases. Renderings are not reachable from
 *   a registration; they are tracked separately.
 */
export type ExtensionInfo = ExtensionRegistration;

/**
 * A single rendering of an extension into a slot.
 *
 * Three things are easily confused, and the extension system distinguishes them:
 *
 *  - an *extension* is what a module registers, identified by its **name** (`obs`);
 *  - an *extension instance* is a configurable use of one within a slot, identified by its
 *    **ID** — the name plus an optional `#`-suffix (`obs#weight`) — which is what an implementer
 *    writes under a slot's `configure` key, and what a config is derived for;
 *  - a *rendering*, this type, is one live copy of an instance being rendered.
 *
 * One instance has any number of renderings at a time: a list renders the same slot once per row,
 * so each row holds its own rendering of every instance assigned to that slot.
 */
export interface ExtensionRendering {
  /** Uniquely identifies this rendering. Never reused. */
  readonly renderingId: string;
  /** The name of the extension being rendered. */
  readonly extensionName: string;
  /** The module which registered the extension. */
  readonly extensionModuleName: string;
  /** The ID of the extension instance being rendered: the name plus an optional `#`-suffix. */
  readonly extensionId: string;
  readonly slotName: string;
  readonly slotModuleName: string;
}

export interface ExtensionInternalStore {
  /** Slots indexed by name */
  slots: Record<string, ExtensionSlotInfo>;
  /** Extension registrations indexed by name */
  extensions: Record<string, ExtensionRegistration>;
}

/** @internal */
export interface ExtensionRenderingsStore {
  /**
   * Every rendering that has started and not yet been released, indexed by rendering ID.
   *
   * Mutated in place as extensions mount and unmount, retaining identity across mounts
   * and unmounts.
   */
  renderings: ReadonlyMap<string, ExtensionRendering>;
}

/**
 * The state one rendering of a slot is displaying, which its extensions' display conditions are
 * evaluated against. Each key becomes a variable of that name in the expression, so only string
 * keys are reachable from a condition.
 */
export type ExtensionSlotCustomState = Record<string, unknown> | undefined;

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
}

export interface ExtensionStore {
  slots: Record<string, ExtensionSlotState>;
}

export interface ExtensionSlotState {
  moduleName?: string;
  /**
   * Candidates only. Call `getAssignedExtensions()` for the extensions a given rendering of
   * this slot should actually display.
   */
  candidateExtensions: Array<AssignedExtension>;
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
  /** The condition under which this extension should be displayed. */
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

const extensionRenderingsStore = createGlobalStore<ExtensionRenderingsStore>('extensionRenderings', {
  renderings: new Map(),
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
 * This gets the store of extension renderings currently on screen. Renderings are added by
 * `renderExtension` and removed once their parcel is gone — whether it unmounted, failed to load,
 * or failed to mount. It is subject to change radically and without warning. It should not be
 * used outside esm-core.
 * @internal
 */
export const getExtensionRenderingsStore = () =>
  getGlobalStore<ExtensionRenderingsStore>('extensionRenderings', {
    renderings: new Map(),
  });

/** @internal */
export function updateInternalExtensionStore(updater: (state: ExtensionInternalStore) => ExtensionInternalStore) {
  // Skips the write entirely when the updater returns the state it was given.
  const state = extensionInternalStore.getState();
  const newState = updater(state);

  if (newState !== state) {
    extensionInternalStore.setState(newState);
  }
}

/**
 * The rendering map this module owns and mutates, and the state object it last published. A current
 * state that isn't the published one means someone else wrote the store, and the map and the record
 * counts below have to be rebuilt from it.
 */
let ownedRenderings: Map<string, ExtensionRendering> | null = null;
let publishedRenderings: ExtensionRenderingsStore | null = null;

function currentRenderings() {
  const state = extensionRenderingsStore.getState();

  if (!ownedRenderings || state !== publishedRenderings) {
    ownedRenderings = new Map(state.renderings);
    publishedRenderings = state;
    rebuildConfigExtensionRecords(ownedRenderings);
  }

  return ownedRenderings;
}

function publishRenderings(renderings: Map<string, ExtensionRendering>) {
  publishedRenderings = { renderings };
  extensionRenderingsStore.setState(publishedRenderings, true);
}

/** @internal */
export function registerExtensionRendering(rendering: ExtensionRendering) {
  const renderings = currentRenderings();

  if (renderings.has(rendering.renderingId)) {
    return;
  }

  renderings.set(rendering.renderingId, rendering);
  countRenderingRecord(rendering, 1);
  publishRenderings(renderings);
}

/** @internal */
export function unregisterExtensionRendering(renderingId: string) {
  const renderings = currentRenderings();
  const rendering = renderings.get(renderingId);

  if (!rendering) {
    return;
  }

  renderings.delete(renderingId);
  countRenderingRecord(rendering, -1);
  publishRenderings(renderings);
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
 * @internal
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
        runRecomputation(recompute);
      }
    }
  }
}

/**
 * Simple wrapper to ensure recomputations do not throw during store state updates, as this
 * can block other consumers.
 */
function runRecomputation(recompute: () => void) {
  try {
    recompute();
  } catch (e) {
    console.error(`The extension system's '${recompute.name}' recomputation failed`, e);
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
    runRecomputation(recompute);
  }
}

/**
 * esm-config keeps its own store of what it needs to derive extension configs. It derives one config
 * per extension instance in a slot, so renderings of the same instance collapse into a single record;
 * these count how many stand behind each.
 *
 * Counted as renderings come and go rather than rebuilt from the store: an application has thousands
 * on screen at once, so rebuilding would make every mount cost a walk over all of them.
 */
const configExtensionRecordCounts = new Map<string, { count: number; record: ConfigExtensionStoreElement }>();

let configExtensionRecordsChanged = false;

updateConfigExtensionStoreToCurrent();
extensionRenderingsStore.subscribe(() => scheduleRecomputation(updateConfigExtensionStoreToCurrent));

/**
 * Adjusts the count behind one record, marking the records changed only when the *set* of them
 * changes rather than merely the count behind one.
 */
function countRenderingRecord(rendering: ExtensionRendering, delta: 1 | -1) {
  const key = JSON.stringify([
    rendering.slotName,
    rendering.extensionId,
    rendering.slotModuleName,
    rendering.extensionModuleName,
  ]);
  const counted = configExtensionRecordCounts.get(key);

  if (!counted) {
    if (delta < 0) {
      return;
    }

    configExtensionRecordCounts.set(key, {
      count: 1,
      record: {
        slotModuleName: rendering.slotModuleName,
        extensionModuleName: rendering.extensionModuleName,
        slotName: rendering.slotName,
        extensionId: rendering.extensionId,
      },
    });

    configExtensionRecordsChanged = true;
    return;
  }

  counted.count += delta;

  if (counted.count < 1) {
    configExtensionRecordCounts.delete(key);
    configExtensionRecordsChanged = true;
  }
}

function rebuildConfigExtensionRecords(renderings: ReadonlyMap<string, ExtensionRendering>) {
  configExtensionRecordCounts.clear();

  for (const rendering of renderings.values()) {
    countRenderingRecord(rendering, 1);
  }

  configExtensionRecordsChanged = true;
}

function updateConfigExtensionStoreToCurrent() {
  // Catches a write that bypassed the helpers above, which has to rebuild the counts.
  currentRenderings();

  if (!configExtensionRecordsChanged) {
    return;
  }

  configExtensionRecordsChanged = false;

  const configExtensionRecords = Array.from(configExtensionRecordCounts.values(), ({ record }) => record);
  // Compared as an array, so an unstable order would look like a change and trigger a full config
  // recomputation every time a rendering is remounted in a different position.
  configExtensionRecords.sort(compareConfigExtensionRecords);

  if (!sameConfigExtensionRecords(configExtensionStore.getState().mountedExtensions, configExtensionRecords)) {
    configExtensionStore.setState({
      mountedExtensions: configExtensionRecords,
    });
  }
}

/**
 * Deep-equality predicate for arrays of `ConfigExtensionStoreElement`, defined in terms of
 * {@link compareConfigExtensionRecords} so that ordering and equality cannot drift apart.
 */
function sameConfigExtensionRecords(
  a: Array<ConfigExtensionStoreElement>,
  b: Array<ConfigExtensionStoreElement>,
): boolean {
  return a.length === b.length && a.every((record, i) => compareConfigExtensionRecords(record, b[i]) === 0);
}

/**
 * Orders records by their four identifying strings. No collation is used as these are internal
 * identifiers.
 */
function compareConfigExtensionRecords(a: ConfigExtensionStoreElement, b: ConfigExtensionStoreElement) {
  return (
    compareStrings(a.slotName, b.slotName) ||
    compareStrings(a.extensionId, b.extensionId) ||
    compareStrings(a.slotModuleName, b.slotModuleName) ||
    compareStrings(a.extensionModuleName, b.extensionModuleName)
  );
}

function compareStrings(a: string, b: string) {
  if (a === b) {
    return 0;
  }

  return a < b ? -1 : 1;
}
