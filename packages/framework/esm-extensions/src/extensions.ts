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
import { evaluateAsBoolean } from '@openmrs/esm-expression-evaluator';
import { type FeatureFlagsStore, featureFlagsStore } from '@openmrs/esm-feature-flags';
import { subscribeConnectivityChanged } from '@openmrs/esm-globals';
import { isOnline as isOnlineFn } from '@openmrs/esm-utils';
import { isEqual, merge } from 'lodash-es';
import { checkStatusFor } from './helpers';
import {
  type AssignedExtension,
  type ExtensionInternalStore,
  type ExtensionRegistration,
  type ExtensionSlotCustomState,
  type ExtensionSlotInfo,
  type ExtensionSlotState,
  getExtensionInternalStore,
  getExtensionStore,
  updateInternalExtensionStore,
} from './store';

const extensionInternalStore = getExtensionInternalStore();
const extensionStore = getExtensionStore();
const slotsConfigStore = getExtensionSlotsConfigStore();
const extensionsConfigStore = getExtensionsConfigStore();

// Keep the output store updated
function updateExtensionOutputStore(
  internalState: ExtensionInternalStore,
  extensionSlotConfigs: ExtensionSlotsConfigStore,
  extensionsConfigStore: ExtensionsConfigStore,
  featureFlagStore: FeatureFlagsStore,
  sessionStore: SessionStore,
) {
  const slots: Record<string, ExtensionSlotState> = {};

  const isOnline = isOnlineFn();
  const enabledFeatureFlags = Object.entries(featureFlagStore.flags)
    .filter(([, { enabled }]) => enabled)
    .map(([name]) => name);

  for (let [slotName, slot] of Object.entries(internalState.slots)) {
    const { config } = getExtensionSlotConfigFromStore(extensionSlotConfigs, slot.name);
    const assignedExtensions = getAssignedExtensionsFromSlotData(
      slotName,
      internalState,
      config,
      extensionsConfigStore,
      enabledFeatureFlags,
      isOnline,
      sessionStore.session,
    );
    slots[slotName] = { moduleName: slot.moduleName, assignedExtensions };
  }

  if (!isEqual(extensionStore.getState().slots, slots)) {
    extensionStore.setState({ slots });
  }
}

extensionInternalStore.subscribe((internalStore) => {
  updateExtensionOutputStore(
    internalStore,
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    sessionStore.getState(),
  );
});

slotsConfigStore.subscribe((slotConfigs) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotConfigs,
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    sessionStore.getState(),
  );
});

extensionsConfigStore.subscribe((extensionConfigs) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionConfigs,
    featureFlagsStore.getState(),
    sessionStore.getState(),
  );
});

featureFlagsStore.subscribe((featureFlagStore) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagStore,
    sessionStore.getState(),
  );
});

sessionStore.subscribe((session) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    session,
  );
});

function updateOutputStoreToCurrent() {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    sessionStore.getState(),
  );
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
  extensionInternalStore.setState((state) => {
    state.extensions[extensionRegistration.name] = {
      ...extensionRegistration,
      instances: [],
    };
    return state;
  });

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
      return -1;
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

  // Create context once for all extensions in this slot
  const slotState = internalState.slots[slotName]?.state;
  const expressionContext = slotState && typeof slotState === 'object' ? { session, ...slotState } : { session };

  for (let id of assignedIds) {
    const { config: rawExtensionConfig } = getExtensionConfigFromStore(extensionConfigStoreState, slotName, id);
    const rawExtensionSlotExtensionConfig = getExtensionConfigFromExtensionSlotStore(config, slotName, id);
    const extensionConfig = merge(rawExtensionConfig, rawExtensionSlotExtensionConfig);

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

      const displayConditionExpression =
        extensionConfig?.['Display conditions']?.expression || extension.displayExpression;

      if (
        displayConditionExpression !== undefined &&
        typeof displayConditionExpression === 'string' &&
        displayConditionExpression.trim().length > 0
      ) {
        try {
          if (!evaluateAsBoolean(displayConditionExpression, expressionContext)) {
            continue;
          }
        } catch (e) {
          console.error(
            `Error while evaluating expression '${displayConditionExpression}' for extension ${name} in slot ${slotName}`,
            e,
          );
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
      });
    }
  }

  return extensions;
}

/**
 * Gets the list of extensions assigned to a given slot
 *
 * @param slotName The slot to load the assigned extensions for
 * @returns An array of extensions assigned to the named slot
 */
export function getAssignedExtensions(slotName: string): Array<AssignedExtension> {
  const internalState = extensionInternalStore.getState();
  const { config: slotConfig } = getExtensionSlotConfig(slotName);
  const extensionStoreState = extensionsConfigStore.getState();
  const featureFlagState = featureFlagsStore.getState();
  const sessionState = sessionStore.getState();
  const isOnline = isOnlineFn();
  const enabledFeatureFlags = Object.entries(featureFlagState.flags)
    .filter(([, { enabled }]) => enabled)
    .map(([name]) => name);

  return getAssignedExtensionsFromSlotData(
    slotName,
    internalState,
    slotConfig,
    extensionStoreState,
    enabledFeatureFlags,
    isOnline,
    sessionState.session,
  );
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

      if (bi === -1) {
        return -1;
      } else if (ai === -1) {
        return 1;
      } else {
        return ai - bi;
      }
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
 * Used by extension slots to update the copy of the state for the extension slot
 *
 * @param slotName The name of the slot with state to update
 * @param state A copy of the new state
 * @param partial Whether this should be applied as a partial
 */
export function updateExtensionSlotState(slotName: string, state: ExtensionSlotCustomState, partial: boolean = false) {
  extensionInternalStore.setState((currentState) => {
    const newState = partial ? merge(currentState.slots[slotName].state, state) : state;
    return {
      ...currentState,
      slots: {
        ...currentState.slots,
        [slotName]: {
          ...currentState.slots[slotName],
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
export const reset: () => void = () =>
  extensionStore.setState(() => {
    return {
      slots: {},
      extensions: {},
    };
  });
