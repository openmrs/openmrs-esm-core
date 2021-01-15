import { getExtensionSlotConfig } from "@openmrs/esm-config";
import { getActualRouteProps } from "./route";
import {
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
    domElement: null,
  };
}

function createNewExtensionSlotInfo(
  extensionSlotName: string
): ExtensionSlotInfo {
  return {
    name: extensionSlotName,
    attachedIds: [],
    instances: {},
    matches: (actualExtensionSlotName) =>
      slotNamesMatch(extensionSlotName, actualExtensionSlotName),
  };
}

export function getExtensionRegistration(
  extensionId: string
): ExtensionRegistration | undefined {
  const state = extensionStore.getState();
  const extensionName = extensionId.split("#")[0];
  return state.extensions[extensionName];
}

export const registerExtension: (
  moduleName: string,
  name: string,
  load: () => Promise<any>
) => void = extensionStore.action(
  (state, moduleName: string, name: string, load: () => Promise<any>) => {
    state.extensions[name] = {
      name,
      load,
      moduleName,
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

function slotNamesMatch(
  attachedExtensionSlotName: string,
  actualExtensionSlotName: string
) {
  return (
    attachedExtensionSlotName === actualExtensionSlotName ||
    (attachedExtensionSlotName.startsWith("/") &&
      !!getActualRouteProps(attachedExtensionSlotName, actualExtensionSlotName))
  );
}

function getAssignedIds(
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
  actualExtensionSlotName: string,
  moduleName: string
) {
  if (!existingSlot) {
    return getUpdatedExtensionSlotInfo(actualExtensionSlotName, moduleName, {
      ...createNewExtensionSlotInfo(actualExtensionSlotName),
      instances: {
        [moduleName]: createNewExtensionSlotInstance(),
      },
    });
  } else if (moduleName in existingSlot.instances) {
    return getUpdatedExtensionSlotInfo(actualExtensionSlotName, moduleName, {
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
    return getUpdatedExtensionSlotInfo(actualExtensionSlotName, moduleName, {
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
  actualExtensionSlotName: string,
  moduleName: string
) {
  const { [moduleName]: existing, ...instances } = existingSlot.instances;

  if (existing.registered > 1) {
    return getUpdatedExtensionSlotInfo(actualExtensionSlotName, moduleName, {
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
    return getUpdatedExtensionSlotInfo(actualExtensionSlotName, moduleName, {
      ...existingSlot,
      instances,
    });
  }
}

/**
 * This is only used to inform tooling about the extension slot. Extension slots
 * do not have to be registered to mount extensions.
 *
 * @param moduleName The name of the module that contains the extension slot
 * @param actualExtensionSlotName The extension slot name that is actually used
 * @param domElement The HTML element of the extension slot
 */
export function registerExtensionSlot(
  moduleName: string,
  actualExtensionSlotName: string,
  domElement: HTMLElement
) {
  updateExtensionStore(async (state) => {
    const slotName =
      Object.keys(state.slots).filter((name) =>
        state.slots[name].matches(actualExtensionSlotName)
      )?.[0] ?? actualExtensionSlotName;
    const existingSlot = state.slots[slotName];
    const updatedSlot = await getUpdatedExtensionSlotInfoForRegistration(
      existingSlot,
      actualExtensionSlotName,
      moduleName
    );
    return {
      ...state,
      slots: {
        ...state.slots,
        [slotName]: {
          ...updatedSlot,
          instances: {
            ...updatedSlot.instances,
            [moduleName]: {
              ...updatedSlot.instances[moduleName],
              domElement,
            },
          },
        },
      },
    };
  });
}

export function unregisterExtensionSlot(
  moduleName: string,
  actualExtensionSlotName: string
) {
  updateExtensionStore(async (state) => {
    const slotName =
      Object.keys(state.slots).filter((name) =>
        state.slots[name].matches(actualExtensionSlotName)
      )?.[0] ?? actualExtensionSlotName;
    const existingSlot = state.slots[slotName];

    if (existingSlot && moduleName in existingSlot.instances) {
      const updatedSlot = await getUpdatedExtensionSlotInfoForUnregistration(
        existingSlot,
        actualExtensionSlotName,
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
 * @param actualExtensionSlotName The extension slot name for which matching extension info should be returned.
 * For URL like extension slots, this should be the name where parameters have been replaced with actual values
 * (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).
 * @param moduleName The module name. Used for applying extension-specific config values to the result.
 * @param extensionSlot The extension slot information object.
 */
export async function getUpdatedExtensionSlotInfo(
  actualExtensionSlotName: string,
  moduleName: string,
  extensionSlot: ExtensionSlotInfo
): Promise<ExtensionSlotInfo> {
  let instance = extensionSlot.instances[moduleName];

  if (instance) {
    const originalInstance = instance;
    const config = await getExtensionSlotConfig(
      actualExtensionSlotName,
      moduleName
    );

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
