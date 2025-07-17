/** @module @category Extension*
 * We have the following extension modes:
 *
 * - attached (set via code in form of: attach, detach, ...)
 * - configured (set via configuration in form of: added, removed, ...)
 * - assigned (computed from attached and configured)
 * - connected (computed from assigned using connectivity and online / offline)
 */

/* eslint-disable no-console */

import { type Session, type SessionStore, sessionStore, userHasAccess, openmrsFetch } from '@openmrs/esm-api';
import {
  type ExtensionsConfigStore,
  type ExtensionSlotConfig,
  type ExtensionSlotsConfigStore,
  getExtensionConfigFromStore,
  getExtensionsConfigStore,
  getExtensionSlotConfig,
  getExtensionConfigFromExtensionSlotStore,
  getExtensionSlotConfigFromStore,
  getExtensionSlotsConfigStore,
} from '@openmrs/esm-config';
import { evaluateAsBoolean } from '@openmrs/esm-expression-evaluator';
import { type FeatureFlagsStore, featureFlagsStore } from '@openmrs/esm-feature-flags';
import { subscribeConnectivityChanged } from '@openmrs/esm-globals';
import { isOnline as isOnlineFn } from '@openmrs/esm-utils';
import { isEqual, merge } from 'lodash-es';
import { checkStatusFor } from './helpers';

import {
  type AssignedExtension,
  type ExtensionRegistration,
  type ExtensionSlotInfo,
  type ExtensionInternalStore,
  type ExtensionSlotState,
  getExtensionStore,
  getExtensionInternalStore,
  updateInternalExtensionStore,
  getExtensionExpressionContextStore,
} from './store';

const extensionInternalStore = getExtensionInternalStore();
const extensionStore = getExtensionStore();
const slotsConfigStore = getExtensionSlotsConfigStore();
const extensionsConfigStore = getExtensionsConfigStore();
const extensionExpressionContextStore = getExtensionExpressionContextStore();

// Keep the output store updated
function updateExtensionOutputStore(
  internalState: ExtensionInternalStore,
  extensionSlotConfigs: ExtensionSlotsConfigStore,
  extensionsConfigStore: ExtensionsConfigStore,
  featureFlagStore: FeatureFlagsStore,
  sessionStore: SessionStore,
  extensionExpressionContext: any,
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
      extensionExpressionContext,
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
    extensionExpressionContextStore.getState(),
  );
});

slotsConfigStore.subscribe((slotConfigs) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotConfigs,
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    sessionStore.getState(),
    extensionExpressionContextStore.getState(),
  );
});

extensionsConfigStore.subscribe((extensionConfigs) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionConfigs,
    featureFlagsStore.getState(),
    sessionStore.getState(),
    extensionExpressionContextStore.getState(),
  );
});

featureFlagsStore.subscribe((featureFlagStore) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagStore,
    sessionStore.getState(),
    extensionExpressionContextStore.getState(),
  );
});

sessionStore.subscribe((session) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    session,
    extensionExpressionContextStore.getState(),
  );
});

extensionExpressionContextStore.subscribe((context) => {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    sessionStore.getState(),
    context,
  );
});

function updateOutputStoreToCurrent() {
  updateExtensionOutputStore(
    extensionInternalStore.getState(),
    slotsConfigStore.getState(),
    extensionsConfigStore.getState(),
    featureFlagsStore.getState(),
    sessionStore.getState(),
    extensionExpressionContextStore.getState(),
  );
}

updateOutputStoreToCurrent();
subscribeConnectivityChanged(updateOutputStoreToCurrent);

// Automatic patient context management
let currentPatientUuid: string | null = null;
let patientDataCache: { [uuid: string]: any } = {};

async function fetchPatientData(patientUuid: string) {
  // Check cache first
  if (patientDataCache[patientUuid]) {
    return patientDataCache[patientUuid];
  }

  try {
    const response = await openmrsFetch(`/ws/rest/v1/patient/${patientUuid}`);
    const patientData = response.data;

    // Cache the result
    patientDataCache[patientUuid] = patientData;

    return patientData;
  } catch (error) {
    return null;
  }
}

function updatePatientContext() {
  const patientUuid = getPatientUuidFromUrl();

  if (patientUuid !== currentPatientUuid) {
    currentPatientUuid = patientUuid;

    if (patientUuid) {
      // Fetch patient data and update context
      fetchPatientData(patientUuid).then((patientData) => {
        // Only update if we're still on the same patient page
        if (patientData && currentPatientUuid === patientUuid) {
          const currentContext = extensionExpressionContextStore.getState();
          const newContext: any = {
            ...currentContext,
            patient: patientData,
            patientUuid: patientUuid,
          };

          extensionExpressionContextStore.setState(newContext);
        }
      });
    } else {
      // Clear patient context when not on patient page
      const currentContext = extensionExpressionContextStore.getState();
      const newContext = { ...currentContext };
      delete newContext.patient;
      delete newContext.patientUuid;
      extensionExpressionContextStore.setState(newContext);
    }
  }
}

// Update patient context on URL changes
function handleUrlChange() {
  updatePatientContext();
  updateOutputStoreToCurrent();
}

// Listen for URL changes
window.addEventListener('popstate', handleUrlChange);

// Override pushState and replaceState to detect programmatic navigation
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (...args) {
  originalPushState.apply(history, args);
  setTimeout(handleUrlChange, 0);
};

history.replaceState = function (...args) {
  originalReplaceState.apply(history, args);
  setTimeout(handleUrlChange, 0);
};

// Initial setup
updatePatientContext();

function getPatientUuidFromUrl() {
  const match = /\/patient\/([a-zA-Z0-9\-]+)\/?/.exec(location.pathname);
  return match && match[1];
}

function createNewExtensionSlotInfo(slotName: string, moduleName?: string): ExtensionSlotInfo {
  return {
    moduleName,
    name: slotName,
    attachedIds: [],
    config: null,
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
 * via the `setupOpenMRS` return object.
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
  extensionExpressionContext: any,
): Array<AssignedExtension> {
  const attachedIds = internalState.slots[slotName].attachedIds;
  const assignedIds = calculateAssignedIds(config, attachedIds);
  const extensions: Array<AssignedExtension> = [];

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
        extensionConfig?.['Display expression']?.expression ??
        (typeof extension.displayExpression === 'string'
          ? extension.displayExpression
          : (extension.displayExpression as any)?.expression) ??
        null;

      if (displayConditionExpression !== null) {
        // Handle case where displayConditionExpression is still an object
        let expressionString = displayConditionExpression;
        if (typeof displayConditionExpression === 'object' && displayConditionExpression?.expression) {
          expressionString = displayConditionExpression.expression;
        }

        try {
          // Get patient UUID from URL and add to evaluation context
          const patientUuid = getPatientUuidFromUrl();
          let evaluationContext: any = { ...extensionExpressionContext, session };

          if (patientUuid) {
            evaluationContext = { ...extensionExpressionContext, session, patientUuid };
          }
          const result = evaluateAsBoolean(expressionString, evaluationContext);
          // if the expression evaluates to false, we do not display the extension
          if (!result) {
            continue;
          }
        } catch (error) {
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
  const extensionExpressionContext = extensionExpressionContextStore.getState();
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
    extensionExpressionContext,
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
 * @internal
 */
export const registerExtensionSlot: (moduleName: string, slotName: string) => void = (moduleName, slotName) =>
  extensionInternalStore.setState((state) => {
    const existingModuleName = state.slots[slotName]?.moduleName;
    if (existingModuleName && existingModuleName != moduleName) {
      console.warn(
        `An extension slot with the name '${slotName}' already exists. Refusing to register the same slot name twice (in "registerExtensionSlot"). The existing one is from module ${existingModuleName}.`,
      );
      return state;
    }
    if (existingModuleName && existingModuleName == moduleName) {
      // Re-rendering an existing slot
      return state;
    }
    if (state.slots[slotName]) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [slotName]: {
            ...state.slots[slotName],
            moduleName,
          },
        },
      };
    }
    const slot = createNewExtensionSlotInfo(slotName, moduleName);
    return {
      ...state,
      slots: {
        ...state.slots,
        [slotName]: slot,
      },
    };
  });

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
