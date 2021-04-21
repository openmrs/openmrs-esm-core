import { getExtensionSlotsConfigStore } from "@openmrs/esm-config";
import {
  ExtensionInfo,
  ExtensionRegistration,
  ExtensionSlotInfo,
  ExtensionSlotInstance,
  extensionStore,
  updateExtensionStore,
} from "./store";

function createNewExtensionSlotInstance(): ExtensionSlotInstance {
  return {
    addedIds: [],
    assignedIds: [],
    idOrder: [],
    removedIds: [],
    registered: 1,
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

export function getExtensionRegistration(
  extensionId: string
): ExtensionRegistration | undefined {
  const state = extensionStore.getState();
  const extensionName = extensionId.split("#")[0];
  return state.extensions[extensionName];
}

export interface ExtensionDetails {
  moduleName: string;
  load: () => Promise<any>;
  meta: Record<string, any>;
  online?: boolean | object;
  offline?: boolean | object;
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

export function getAssignedIds(
  instance: ExtensionSlotInstance,
  attachedIds: Array<string>
) {
  const { addedIds, removedIds, idOrder } = instance;

  return [...attachedIds, ...addedIds]
    .filter((m) => !removedIds.includes(m))
    .sort((a, b) => {
      const ai = idOrder.indexOf(a);
      const bi = idOrder.indexOf(b);

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
    return getUpdatedExtensionSlotInfo(slotName, moduleName, {
      ...existingSlot,
      instances: {
        ...existingSlot.instances,
        [moduleName]: {
          ...existingSlot.instances[moduleName],
          registered: existingSlot.instances[moduleName].registered + 1,
        },
      },
    });
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

  if (existing.registered > 1) {
    return getUpdatedExtensionSlotInfo(extensionSlotName, moduleName, {
      ...existingSlot,
      instances: {
        ...instances,
        [moduleName]: {
          ...existing,
          registered: existing.registered - 1,
        },
      },
    });
  } else {
    return getUpdatedExtensionSlotInfo(extensionSlotName, moduleName, {
      ...existingSlot,
      instances,
    });
  }
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
    return {
      ...state,
      slots: {
        ...state.slots,
        [slotName]: updatedSlot,
      },
    };
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
 * For URL like extension slots, this should be the name where parameters have been replaced with actual values
 * (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).
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

    const assignedIds = getAssignedIds(instance, extensionSlot.attachedIds);

    if (
      instance !== originalInstance ||
      assignedIds.join(",") !== instance.assignedIds.join(",")
    ) {
      return {
        ...extensionSlot,
        instances: {
          ...extensionSlot.instances,
          [moduleName]: {
            ...instance,
            assignedIds,
          },
        },
      };
    }
  }

  return extensionSlot;
}
