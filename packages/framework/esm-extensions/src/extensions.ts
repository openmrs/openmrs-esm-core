/** @module @category Extension */
/*
 * We have the following extension modes:
 *
 * - attached (set via code in form of: attach, detach, ...)
 * - configured (set via configuration in form of: added, removed, ...)
 * - assigned (computed from attached and configured)
 * - connected (computed from assigned using connectivity and online / offline)
 */

import { type Session, type SessionStore, sessionStore, userHasAccess } from '@openmrs/esm-api';
import {
  type ExtensionSlotConfig,
  type ExtensionSlotsConfigStore,
  type ExtensionsConfigStore,
  getExtensionConfigFromExtensionSlotStore,
  getExtensionConfigFromStore,
  getExtensionSlotConfig,
  getExtensionSlotConfigFromStore,
  getExtensionSlotsConfigStore,
  getExtensionsConfigStore,
} from '@openmrs/esm-config';
import { evaluateAsBoolean, type VariablesMap } from '@openmrs/esm-expression-evaluator';
import { type FeatureFlagsStore, featureFlagsStore } from '@openmrs/esm-feature-flags';
import { subscribeConnectivityChanged } from '@openmrs/esm-globals';
import { isOnline as isOnlineFn, shallowEqual } from '@openmrs/esm-utils';
import { isEqual, merge } from 'lodash-es';
import { checkStatusFor } from './helpers';
import {
  type AssignedExtension,
  type ExtensionInternalStore,
  type ExtensionRegistration,
  type ExtensionSlotCustomState,
  type ExtensionSlotInfo,
  type ExtensionSlotState,
  getExtensionInstancesStore,
  getExtensionInternalStore,
  getExtensionStore,
  scheduleRecomputation,
  updateInternalExtensionStore,
} from './store';

const extensionInternalStore = getExtensionInternalStore();
const extensionStore = getExtensionStore();
const slotsConfigStore = getExtensionSlotsConfigStore();
const extensionsConfigStore = getExtensionsConfigStore();

/**
 * Slots whose derived state may have changed since the output store was last updated. `null`
 * stands for "every slot", and is used when an input changes that isn't scoped to one slot —
 * the session, a feature flag, connectivity, or a new extension registration.
 */
let dirtySlots: Set<string> | null = new Set();
let isRecomputingOutputStore = false;

function markSlotsDirty(slots: Set<string> | null) {
  if (slots === null) {
    dirtySlots = null;
  } else if (dirtySlots !== null) {
    for (const slotName of slots) {
      dirtySlots.add(slotName);
    }
  }

  scheduleRecomputation(recomputeExtensionOutputStore);
}

function recomputeExtensionOutputStore() {
  // Writing the output store notifies its subscribers synchronously, and a subscriber that dirties
  // a slot would otherwise re-enter here and recurse without bound. What it dirties is picked up
  // by the next recomputation.
  if (isRecomputingOutputStore) {
    return;
  }

  const slots = dirtySlots;

  if (slots !== null && slots.size === 0) {
    return;
  }

  isRecomputingOutputStore = true;
  // Taken before the work so that anything dirtied while it runs accumulates for next time rather
  // than being discarded when this pass finishes.
  dirtySlots = new Set();

  try {
    updateExtensionOutputStore(
      extensionInternalStore.getState(),
      slotsConfigStore.getState(),
      extensionsConfigStore.getState(),
      featureFlagsStore.getState(),
      sessionStore.getState(),
      slots,
    );
  } catch (e) {
    // Fold the work back in, so a failure leaves these slots marked for the next recomputation
    // instead of stranding them stale.
    dirtySlots = slots === null || dirtySlots === null ? null : new Set([...slots, ...dirtySlots]);
    throw e;
  } finally {
    isRecomputingOutputStore = false;
  }
}

/**
 * Re-derives the output store from the extension system's inputs.
 *
 * Two things keep this cheap. `dirtySlotNames` limits which slots are recomputed at all; passing
 * `null` recomputes every slot. And slots whose derived value hasn't changed keep their existing
 * object, so that components subscribed to one slot don't re-render because a different slot
 * changed.
 */
function updateExtensionOutputStore(
  internalState: ExtensionInternalStore,
  extensionSlotConfigs: ExtensionSlotsConfigStore,
  extensionsConfigState: ExtensionsConfigStore,
  featureFlagState: FeatureFlagsStore,
  sessionState: SessionStore,
  dirtySlotNames: Set<string> | null = null,
) {
  const previousSlots = extensionStore.getState().slots;
  const slots: Record<string, ExtensionSlotState> = {};
  let changed = false;

  const isOnline = isOnlineFn();
  const enabledFeatureFlags = Object.entries(featureFlagState.flags)
    .filter(([, { enabled }]) => enabled)
    .map(([name]) => name);

  for (let [slotName, slot] of Object.entries(internalState.slots)) {
    const previous = previousSlots[slotName];

    if (previous && dirtySlotNames && !dirtySlotNames.has(slotName)) {
      slots[slotName] = previous;
      continue;
    }

    const { config } = getExtensionSlotConfigFromStore(extensionSlotConfigs, slot.name);
    const assignedExtensions = getAssignedExtensionsFromSlotData(
      slotName,
      internalState,
      config,
      extensionsConfigState,
      enabledFeatureFlags,
      isOnline,
      sessionState.session,
    );

    if (
      previous &&
      previous.moduleName === slot.moduleName &&
      isEqual(previous.assignedExtensions, assignedExtensions)
    ) {
      slots[slotName] = previous;
    } else {
      slots[slotName] = { moduleName: slot.moduleName, assignedExtensions };
      changed = true;
    }
  }

  if (changed || Object.keys(previousSlots).length !== Object.keys(slots).length) {
    extensionStore.setState({ slots });
  }
}

/**
 * Returns the keys whose values differ between two records, including keys present in only one.
 */
function changedKeys(next: Record<string, unknown>, previous: Record<string, unknown>): Set<string> {
  const changed = new Set<string>();

  for (const key of Object.keys(next)) {
    if (next[key] !== previous[key]) {
      changed.add(key);
    }
  }

  for (const key of Object.keys(previous)) {
    if (!(key in next)) {
      changed.add(key);
    }
  }

  return changed;
}

extensionInternalStore.subscribe((state, previousState) => {
  // A new or changed registration can affect any slot the extension might be assigned to. Every
  // other kind of change here — attaching, registering a slot, slot state — is scoped to the
  // slots whose entries actually changed.
  markSlotsDirty(state.extensions !== previousState.extensions ? null : changedKeys(state.slots, previousState.slots));
});

// Slot configs are per-slot, so a config change invalidates only the slots it names.
slotsConfigStore.subscribe((state, previousState) => {
  markSlotsDirty(changedKeys(state.slots, previousState.slots));
});

// Extension configs are keyed by slot too, but rebuilt wholesale on every config recomputation,
// so in practice any change here dirties every slot that has a mounted extension.
extensionsConfigStore.subscribe((state, previousState) => {
  markSlotsDirty(changedKeys(state.configs, previousState.configs));
});

featureFlagsStore.subscribe(() => markSlotsDirty(null));

sessionStore.subscribe(() => markSlotsDirty(null));

function updateOutputStoreToCurrent() {
  markSlotsDirty(null);
}

updateOutputStoreToCurrent();
subscribeConnectivityChanged(updateOutputStoreToCurrent);

function createNewExtensionSlotInfo(
  slotName: string,
  moduleName?: string,
  state?: ExtensionSlotCustomState,
): ExtensionSlotInfo {
  return {
    moduleName,
    name: slotName,
    attachedIds: [],
    config: null,
    state,
  };
}

/**
 * Given an extension ID, which is a string uniquely identifying
 * an instance of an extension within an extension slot, this
 * returns the extension name.
 *
 * @example
 * ```js
 * getExtensionNameFromId("foo#bar")
 *  --> "foo"
 * getExtensionNameFromId("baz")
 *  --> "baz"
 * ```
 */
export function getExtensionNameFromId(extensionId: string) {
  const [extensionName] = extensionId.split('#');
  return extensionName;
}

export function getExtensionRegistrationFrom(
  state: ExtensionInternalStore,
  extensionId: string,
): ExtensionRegistration | undefined {
  const name = getExtensionNameFromId(extensionId);
  return state.extensions[name];
}

export function getExtensionRegistration(extensionId: string): ExtensionRegistration | undefined {
  const state = extensionInternalStore.getState();
  return getExtensionRegistrationFrom(state, extensionId);
}

/**
 * Extensions must be registered in order to be rendered.
 * This is handled by the app shell, when extensions are provided
 * via the `routes.json` file and registered through `registerApp()`.
 * @internal
 */
export const registerExtension: (extensionRegistration: ExtensionRegistration) => void = (extensionRegistration) =>
  updateInternalExtensionStore((state) => ({
    ...state,
    extensions: {
      ...state.extensions,
      [extensionRegistration.name]: { ...extensionRegistration },
    },
  }));

/**
 * Attach an extension to an extension slot.
 *
 * This will cause the extension to be rendered into the specified
 * extension slot, unless it is removed by configuration. Using
 * `attach` is an alternative to specifying the `slot` or `slots`
 * in the extension declaration.
 *
 * It is particularly useful when creating a slot into which
 * you want to render an existing extension. This enables you
 * to do so without modifying the extension's declaration, which
 * may be impractical or inappropriate, for example if you are
 * writing a module for a specific implementation.
 *
 * @param slotName a name uniquely identifying the slot
 * @param extensionId an extension name, with an optional #-suffix
 *    to distinguish it from other instances of the same extension
 *    attached to the same slot.
 */
export function attach(slotName: string, extensionId: string) {
  updateInternalExtensionStore((state) => {
    const existingSlot = state.slots[slotName];

    if (!existingSlot) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [slotName]: {
            ...createNewExtensionSlotInfo(slotName),
            attachedIds: [extensionId],
          },
        },
      };
    } else {
      return {
        ...state,
        slots: {
          ...state.slots,
          [slotName]: {
            ...existingSlot,
            attachedIds: [...existingSlot.attachedIds, extensionId],
          },
        },
      };
    }
  });
}

/**
 * Detaches an extension from an extension slot.
 *
 * @param extensionSlotName The name of the extension slot to detach from.
 * @param extensionId The ID of the extension to detach.
 *
 * @deprecated Avoid using this. Extension attachments should be considered declarative.
 */
export function detach(extensionSlotName: string, extensionId: string) {
  updateInternalExtensionStore((state) => {
    const existingSlot = state.slots[extensionSlotName];

    if (existingSlot && existingSlot.attachedIds.includes(extensionId)) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            ...existingSlot,
            attachedIds: existingSlot.attachedIds.filter((id) => id !== extensionId),
          },
        },
      };
    } else {
      return state;
    }
  });
}

/**
 * Detaches all extensions from an extension slot.
 *
 * @param extensionSlotName The name of the extension slot to clear.
 *
 * @deprecated Avoid using this. Extension attachments should be considered declarative.
 */
export function detachAll(extensionSlotName: string) {
  updateInternalExtensionStore((state) => {
    const existingSlot = state.slots[extensionSlotName];

    if (existingSlot) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            ...existingSlot,
            attachedIds: [],
          },
        },
      };
    } else {
      return state;
    }
  });
}

/**
 * Get an order index for the extension. This will
 * come from either its configured order, its registered order
 * parameter, or the order in which it happened to be attached.
 *
 * The four bands below are what makes the comparison a total order: every extension lands in
 * exactly one, and extensions with no ordering information of any kind share the last band rather
 * than getting a sentinel that can't be compared against itself.
 */
function getOrder(
  extensionId: string,
  configuredOrder: Array<string>,
  registeredOrderIndex: number | undefined,
  attachedOrder: Array<string>,
) {
  const configuredIndex = configuredOrder.indexOf(extensionId);
  if (configuredIndex !== -1) {
    return configuredIndex;
  } else if (registeredOrderIndex !== undefined) {
    // extensions that don't have a configured order should appear after those that do
    return 1000 + registeredOrderIndex;
  } else {
    const assignedIndex = attachedOrder.indexOf(extensionId);
    if (assignedIndex !== -1) {
      // extensions that have neither a configured nor registered order should appear
      // after all others
      return 2000 + assignedIndex;
    } else {
      // Added by configuration with no order of any kind — after everything else, and among
      // themselves in the order the configuration lists them.
      return 3000;
    }
  }
}

function getAssignedExtensionsFromSlotData(
  slotName: string,
  internalState: ExtensionInternalStore,
  config: ExtensionSlotConfig,
  extensionConfigStoreState: ExtensionsConfigStore,
  enabledFeatureFlags: Array<string>,
  isOnline: boolean,
  session: Session | null,
): Array<AssignedExtension> {
  const attachedIds = internalState.slots[slotName].attachedIds;
  const assignedIds = calculateAssignedIds(config, attachedIds);
  const extensions: Array<AssignedExtension> = [];

  for (let id of assignedIds) {
    const { config: rawExtensionConfig } = getExtensionConfigFromStore(extensionConfigStoreState, slotName, id);
    const rawExtensionSlotExtensionConfig = getExtensionConfigFromExtensionSlotStore(config, slotName, id);
    // `merge` mutates its first argument, and `rawExtensionConfig` belongs to the config store,
    // so never merge into it.
    const extensionConfig = rawExtensionSlotExtensionConfig
      ? merge({}, rawExtensionConfig, rawExtensionSlotExtensionConfig)
      : rawExtensionConfig;

    const name = getExtensionNameFromId(id);
    const extension = internalState.extensions[name];

    // if the extension has not been registered yet, do not include it
    if (extension) {
      const requiredPrivileges = extensionConfig?.['Display conditions']?.privileges ?? extension.privileges ?? [];
      if (
        requiredPrivileges &&
        (typeof requiredPrivileges === 'string' || (Array.isArray(requiredPrivileges) && requiredPrivileges.length > 0))
      ) {
        if (!session?.user) {
          continue;
        }

        if (!userHasAccess(requiredPrivileges, session.user)) {
          continue;
        }
      }

      if (extension.featureFlag && !enabledFeatureFlags.includes(extension.featureFlag)) {
        continue;
      }

      if (window.offlineEnabled && !checkStatusFor(isOnline, extension.online, extension.offline)) {
        continue;
      }

      extensions.push({
        id,
        name,
        moduleName: extension.moduleName,
        config: extensionConfig,
        featureFlag: extension.featureFlag,
        meta: extension.meta,
        online: extensionConfig?.['Display conditions']?.online ?? extension.online ?? true,
        offline: extensionConfig?.['Display conditions']?.offline ?? extension.offline ?? false,
        displayConditionExpression: extensionConfig?.['Display conditions']?.expression || extension.displayExpression,
      });
    }
  }

  return extensions;
}

/**
 * Narrows `extensions` to those whose display condition holds for one particular rendering of a
 * slot, evaluating each condition against `state`.
 *
 * The same slot can be rendered many times at once with different state — a list renders one per
 * row — so a display condition cannot be resolved when the slot's extensions are derived. It has
 * to be resolved against the state of the rendering being displayed, which is what this takes.
 *
 * An extension whose condition throws is left out, on the grounds that a condition that cannot be
 * evaluated has not been met.
 *
 * @param extensions The extensions assigned to the slot, from `getAssignedExtensions` or the store
 * @param state The state of this rendering of the slot
 * @param session The current session, which conditions may refer to as `session`
 * @returns Those of `extensions` that should be displayed, in the same order. Always a new array.
 */
export function filterExtensionsByDisplayConditions(
  extensions: Array<AssignedExtension>,
  state?: ExtensionSlotCustomState,
  session: Session | null = null,
): Array<AssignedExtension> {
  // Built once for the whole slot rather than per extension: the context is the same for all of
  // them, and most slots have no conditions at all.
  let expressionContext: VariablesMap | undefined;

  return extensions.filter((extension) => {
    const expression = extension.displayConditionExpression;

    if (typeof expression !== 'string' || expression.trim().length === 0) {
      return true;
    }

    expressionContext ??= state && typeof state === 'object' ? { session, ...state } : { session };

    try {
      return Boolean(evaluateAsBoolean(expression, expressionContext));
    } catch (e) {
      console.error(
        `Error while evaluating expression '${expression}' for extension ${extension.name} in slot ${extension.id}`,
        e,
      );
      return false;
    }
  });
}

/**
 * Gets the list of extensions assigned to a given slot.
 *
 * Pass `state` whenever the extensions are being displayed. A slot can be rendered in several
 * places at once with different state, so display conditions are evaluated against the state of the
 * rendering rather than against the slot, and are only applied when `state` is given. Omitting it
 * returns every assigned extension, including those a display condition might hide.
 *
 * @param slotName The slot to load the assigned extensions for
 * @param state The state of the rendering of the slot the extensions will be displayed in
 * @returns An array of extensions assigned to the named slot
 */
export function getAssignedExtensions(slotName: string, state?: ExtensionSlotCustomState): Array<AssignedExtension> {
  const internalState = extensionInternalStore.getState();
  const { config: slotConfig } = getExtensionSlotConfig(slotName);
  const extensionStoreState = extensionsConfigStore.getState();
  const featureFlagState = featureFlagsStore.getState();
  const sessionState = sessionStore.getState();
  const isOnline = isOnlineFn();
  const enabledFeatureFlags = Object.entries(featureFlagState.flags)
    .filter(([, { enabled }]) => enabled)
    .map(([name]) => name);

  const assigned = getAssignedExtensionsFromSlotData(
    slotName,
    internalState,
    slotConfig,
    extensionStoreState,
    enabledFeatureFlags,
    isOnline,
    sessionState.session,
  );

  return state === undefined ? assigned : filterExtensionsByDisplayConditions(assigned, state, sessionState.session);
}

function calculateAssignedIds(config: ExtensionSlotConfig, attachedIds: Array<string>) {
  const addedIds = config.add || [];
  const removedIds = config.remove || [];
  const idOrder = config.order || [];
  const { extensions } = extensionInternalStore.getState();

  return [...attachedIds, ...addedIds]
    .filter((id) => !removedIds.includes(id))
    .sort((idA, idB) => {
      const ai = getOrder(idA, idOrder, extensions[getExtensionNameFromId(idA)]?.order, attachedIds);
      const bi = getOrder(idB, idOrder, extensions[getExtensionNameFromId(idB)]?.order, attachedIds);

      // Ties keep their input order — `Array.prototype.sort` is stable, and the input is
      // `[...attachedIds, ...addedIds]`, so two extensions the ordering rules can't separate
      // come out in the order the code and the configuration declared them.
      return ai - bi;
    });
}

/**
 * Used by by extension slots at mount time.
 *
 * @param moduleName The name of the module that contains the extension slot
 * @param slotName The extension slot name that is actually used
 * @param state Optional custom state for the slot, which will be stored in the extension store.
 * @internal
 */
export const registerExtensionSlot: (moduleName: string, slotName: string, state?: ExtensionSlotCustomState) => void = (
  moduleName,
  slotName,
  state,
) =>
  extensionInternalStore.setState((currentState) => {
    const existingModuleName = currentState.slots[slotName]?.moduleName;
    if (existingModuleName && existingModuleName != moduleName) {
      console.warn(
        `An extension slot with the name '${slotName}' already exists. Refusing to register the same slot name twice (in "registerExtensionSlot"). The existing one is from module ${existingModuleName}.`,
      );
      return currentState;
    }

    if (existingModuleName && existingModuleName == moduleName) {
      // Re-rendering an existing slot
      return currentState;
    }

    if (currentState.slots[slotName]) {
      return {
        ...currentState,
        slots: {
          ...currentState.slots,
          [slotName]: {
            ...currentState.slots[slotName],
            moduleName,
            state,
          },
        },
      };
    }

    const slot = createNewExtensionSlotInfo(slotName, moduleName, state);
    return {
      ...currentState,
      slots: {
        ...currentState.slots,
        [slotName]: {
          ...slot,
        },
      },
    };
  });

/**
 * Used by extension slots to update the copy of the state for the extension slot.
 *
 * Callers generally pass a fresh object every render, so this compares the new state against
 * the stored one and does nothing if they match. Without that, every render of every extension
 * slot would invalidate the extension graph.
 *
 * Does nothing if the slot has not been registered.
 *
 * @param slotName The name of the slot with state to update
 * @param state A copy of the new state
 * @param partial Whether this should be applied as a partial
 */
export function updateExtensionSlotState(slotName: string, state: ExtensionSlotCustomState, partial: boolean = false) {
  updateInternalExtensionStore((currentState) => {
    const slot = currentState.slots[slotName];

    if (!slot) {
      console.warn(
        `Attempted to update the state of extension slot '${slotName}', which has not been registered. ` +
          `The update was ignored. Extension slots must be registered — normally by rendering ` +
          `<ExtensionSlot> — before their state can be set.`,
      );
      return currentState;
    }

    // Merged into a fresh object: `merge` mutates its first argument, and mutating the stored
    // state in place would make the comparison below always find them equal.
    const newState = partial ? merge({}, slot.state, state) : state;

    if (shallowEqual(slot.state, newState)) {
      return currentState;
    }

    return {
      ...currentState,
      slots: {
        ...currentState.slots,
        [slotName]: {
          ...slot,
          state: newState,
        },
      },
    };
  });
}

/**
 * @internal
 * Just for testing.
 */
export const reset: () => void = () => {
  // Invalidation is carried in module state, so it has to be reset too or it bleeds into the
  // next test as either a stale dirty set or a missing one.
  dirtySlots = null;
  updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
  getExtensionInstancesStore().setState({ instances: new Map() });
  extensionStore.setState({ slots: {} });
};
