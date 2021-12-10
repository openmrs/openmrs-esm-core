import {
  ExtensionSlotConfigObject,
  getExtensionSlotsConfigStore,
} from "@openmrs/esm-config";
import { ExtensionInfo } from ".";
import {
  ExtensionRegistration,
  ExtensionSlotInfo,
  ExtensionSlotInstance,
  ExtensionStore,
  extensionStore,
  updateExtensionStore,
} from "./store";

function createNewExtensionSlotInstance(): ExtensionSlotInstance {
  return {
    addedIds: [],
    idOrder: [],
    removedIds: [],
  };
}

function createNewExtensionSlotInfo(
  extensionSlotName: string
): ExtensionSlotInfo {
  return {
    name: extensionSlotName,
    attachedIds: [],
    instances: {},
  };
}

export function getExtensionNameFromId(extensionId: string) {
  const [extensionName] = extensionId.split("#");
  return extensionName;
}

export function getExtensionRegistrationFrom(
  state: ExtensionStore,
  extensionId: string
): ExtensionRegistration | undefined {
  const name = getExtensionNameFromId(extensionId);
  return state.extensions[name];
}

export function getExtensionRegistration(
  extensionId: string
): ExtensionRegistration | undefined {
  const state = extensionStore.getState();
  return getExtensionRegistrationFrom(state, extensionId);
}

export interface ExtensionDetails {
  moduleName: string;
  load: () => Promise<any>;
  meta: Record<string, any>;
  online?: boolean | object;
  offline?: boolean | object;
  order?: number;
}

export const registerExtension: (
  name: string,
  details: ExtensionDetails
) => void = extensionStore.action(
  (state, name: string, details: ExtensionDetails) => {
    state.extensions[name] = {
      ...details,
      name,
      instances: {},
    };
  }
);

export function attach(extensionSlotName: string, extensionId: string) {
  updateExtensionStore((state) => {
    const existingSlot = state.slots[extensionSlotName];

    if (!existingSlot) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            ...createNewExtensionSlotInfo(extensionSlotName),
            attachedIds: [extensionId],
          },
        },
      };
    } else {
      return {
        ...state,
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            ...existingSlot,
            attachedIds: [...existingSlot.attachedIds, extensionId],
          },
        },
      };
    }
  });
}

export function detach(extensionSlotName: string, extensionId: string) {
  updateExtensionStore((state) => {
    const existingSlot = state.slots[extensionSlotName];

    if (existingSlot && existingSlot.attachedIds.includes(extensionId)) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            ...existingSlot,
            attachedIds: existingSlot.attachedIds.filter(
              (id) => id !== extensionId
            ),
          },
        },
      };
    } else {
      return state;
    }
  });
}

export function detachAll(extensionSlotName: string) {
  updateExtensionStore((state) => {
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
  attachedOrder: Array<string>
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

export function getAssignedIds(
  slotName: string,
  config: ExtensionSlotConfigObject,
  attachedIds: Array<string>
) {
  const addedIds = config.add || [];
  const removedIds = config.remove || [];
  const idOrder = config.order || [];
  const { extensions } = extensionStore.getState();
  console.log(extensions);

  return [...attachedIds, ...addedIds]
    .filter((id) => !removedIds.includes(id))
    .sort((idA, idB) => {
      const ai = getOrder(
        idA,
        idOrder,
        extensions[getExtensionNameFromId(idA)].order,
        attachedIds
      );
      const bi = getOrder(
        idB,
        idOrder,
        extensions[getExtensionNameFromId(idB)].order,
        attachedIds
      );

      if (bi === -1) {
        return -1;
      } else if (ai === -1) {
        return 1;
      } else {
        return ai - bi;
      }
    });
}

function getUpdatedExtensionSlotInfoForRegistration(
  existingSlot: ExtensionSlotInfo,
  slotName: string,
  moduleName: string
) {
  if (!existingSlot) {
    return getUpdatedExtensionSlotInfo(slotName, moduleName, {
      ...createNewExtensionSlotInfo(slotName),
      instances: {
        [moduleName]: createNewExtensionSlotInstance(),
      },
    });
  } else if (moduleName in existingSlot.instances) {
    return getUpdatedExtensionSlotInfo(slotName, moduleName, existingSlot);
  } else {
    return getUpdatedExtensionSlotInfo(slotName, moduleName, {
      ...existingSlot,
      instances: {
        ...existingSlot.instances,
        [moduleName]: createNewExtensionSlotInstance(),
      },
    });
  }
}

function getUpdatedExtensionSlotInfoForUnregistration(
  existingSlot: ExtensionSlotInfo,
  extensionSlotName: string,
  moduleName: string
) {
  const { [moduleName]: existing, ...instances } = existingSlot.instances;

  return getUpdatedExtensionSlotInfo(extensionSlotName, moduleName, {
    ...existingSlot,
    instances,
  });
}

/**
 * @param moduleName The name of the module that contains the extension slot
 * @param slotName The extension slot name that is actually used
 */
export function registerExtensionSlot(moduleName: string, slotName: string) {
  updateExtensionStore((state) => {
    const existingSlot = state.slots[slotName];
    const updatedSlot = getUpdatedExtensionSlotInfoForRegistration(
      existingSlot,
      slotName,
      moduleName
    );

    if (existingSlot !== updatedSlot) {
      return {
        ...state,
        slots: {
          ...state.slots,
          [slotName]: updatedSlot,
        },
      };
    }

    return state;
  });
}

export function unregisterExtensionSlot(moduleName: string, slotName: string) {
  updateExtensionStore((state) => {
    const existingSlot = state.slots[slotName];

    if (existingSlot && moduleName in existingSlot.instances) {
      const updatedSlot = getUpdatedExtensionSlotInfoForUnregistration(
        existingSlot,
        slotName,
        moduleName
      );

      return {
        ...state,
        slots: {
          ...state.slots,
          [slotName]: updatedSlot,
        },
      };
    }

    return state;
  });
}

export function getExtensionSlotsForModule(moduleName: string) {
  const state = extensionStore.getState();
  return Object.keys(state.slots).filter(
    (name) => moduleName in state.slots[name].instances
  );
}

/**
 * @internal
 * Just for testing.
 */
export const reset: () => void = extensionStore.action(() => {
  return {
    slots: {},
    extensions: {},
  };
});

/**
 * Returns information describing all extensions which can be rendered into an extension slot with
 * the specified name.
 * The returned information describe the extension itself, as well as the extension slot name(s)
 * with which it has been attached.
 * @param slotName The extension slot name for which matching extension info should be returned.
 * @param moduleName The module name. Used for applying extension-specific config values to the result.
 * @param extensionSlot The extension slot information object.
 */
export function getUpdatedExtensionSlotInfo(
  slotName: string,
  moduleName: string,
  extensionSlot: ExtensionSlotInfo
): ExtensionSlotInfo {
  let instance = extensionSlot.instances[moduleName];

  if (instance) {
    const originalInstance = instance;
    const config =
      getExtensionSlotsConfigStore(moduleName).getState().extensionSlotConfigs[
        slotName
      ] ?? {};

    if (Array.isArray(config.add)) {
      config.add.forEach((extensionId) => {
        if (!instance.addedIds.includes(extensionId)) {
          instance = {
            ...instance,
            addedIds: [...instance.addedIds, extensionId],
          };
        }
      });
    }

    if (Array.isArray(config.remove)) {
      config.remove.forEach((extensionId) => {
        if (!instance.removedIds.includes(extensionId)) {
          instance = {
            ...instance,
            removedIds: [...instance.removedIds, extensionId],
          };
        }
      });
    }

    if (Array.isArray(config.order)) {
      const testOrder = config.order.join(",");
      const fullOrder = instance.idOrder.join(",");

      if (!fullOrder.endsWith(testOrder)) {
        config.order.forEach((extensionId) => {
          instance = {
            ...instance,
            idOrder: [
              ...instance.idOrder.filter((m) => m !== extensionId),
              extensionId,
            ],
          };
        });
      }
    }

    if (instance !== originalInstance) {
      return {
        ...extensionSlot,
        instances: {
          ...extensionSlot.instances,
          [moduleName]: instance,
        },
      };
    }
  }

  return extensionSlot;
}
