import { mountRootParcel } from "single-spa";
import { pathToRegexp, Key } from "path-to-regexp";
import { createGlobalStore } from "@openmrs/esm-api";

export interface ExtensionDefinition {
  name: string;
  load(): Promise<any>;
}

interface ExtensionRegistration extends ExtensionDefinition {
  moduleName: string;
}

export interface ExtensionStore {
  slots: Record<string, ExtensionSlotDefinition>;
  extensions: Record<string, ExtensionRegistration>;
}

export interface ExtensionSlotDefinition {
  /**
   * The name under which the extension slot has been registered.
   */
  name: string;
  /**
   * The set of extension IDs which have been attached to this slot.
   * This is essentially a complete history of `attach` calls to this specific slot.
   * However, not all of these extension IDs should be rendered.
   * `assignedIds` is the set defining those.
   */
  attachedIds: Array<string>;
  /**
   * The set of extensions IDs which should be rendered into this slot at the current point in time.
   */
  assignedIds: Array<string>;
  /**
   * A set of additional extension IDs which have been added to to this slot despite not being
   * explicitly `attach`ed to it.
   * An example may be an extension which is added to the slot via the configuration.
   */
  addedIds: Array<string>;
  /**
   * A set of extension IDs which have been removed/hidden from this slot, even though they have
   * previously been `attach`ed/added to it.
   * An example may be an extension which is removed from the slot via the configuration.
   */
  removedIds: Array<string>;
  /**
   * A set allowing explicit ordering of the `assignedIds`.
   */
  idOrder: Array<string>;
  /**
   * Returns a value indicating whether extensions of this extension slot definition can be rendered
   * into an arbitrary extension slot component with the specified `actualExtensionSlotName`.
   * @param actualExtensionSlotName The actual extension slot name into which the extensions might be rendered.
   * For URL like extension slots, this should be the name where parameters have been replaced with actual values
   * (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).
   */
  canRenderInto: (actualExtensionSlotName: string) => boolean;
}

export interface PageDefinition {
  route: string;
  load(): Promise<any>;
}

export interface Lifecycle {
  bootstrap(): void;
  mount(): void;
  unmount(): void;
  update?(): void;
}

export interface CancelLoading {
  (): void;
}

const extensionSlotsForModule: Record<string, Array<string>> = {};

export const extensionStore = createGlobalStore<ExtensionStore>("extensions", {
  slots: {},
  extensions: {},
});

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
    };
  }
);

export const attach: (
  extensionSlotName: string,
  extensionId: string
) => void = extensionStore.action(
  (state, extensionSlotName: string, extensionId: string) => {
    const existingSlot = state.slots[extensionSlotName];
    if (!existingSlot) {
      return {
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            name: extensionSlotName,
            attachedIds: [extensionId],
            assignedIds: [extensionId],
            addedIds: [],
            removedIds: [],
            idOrder: [],
            canRenderInto: (actualExtensionSlotName) =>
              canSlotRenderInto(extensionSlotName, actualExtensionSlotName),
          },
        },
      };
    } else {
      return {
        slots: {
          ...state.slots,
          [extensionSlotName]: {
            ...existingSlot,
            attachedIds: [...existingSlot.attachedIds, extensionId],
            assignedIds: [...existingSlot.assignedIds, extensionId],
          },
        },
      };
    }
  }
);

function canSlotRenderInto(
  attachedExtensionSlotName: string,
  actualExtensionSlotName: string
) {
  return (
    attachedExtensionSlotName === actualExtensionSlotName ||
    (attachedExtensionSlotName.startsWith("/") &&
      !!getActualRouteProps(attachedExtensionSlotName, actualExtensionSlotName))
  );
}

/**
 * Mounts into a DOM node (representing an extension slot)
 * a lazy-loaded component from *any* microfrontend
 * that registered an extension component for this slot.
 */
export function renderExtension(
  domElement: HTMLElement,
  actualExtensionSlotName: string,
  attachedExtensionSlotName: string,
  extensionId: string,
  renderFunction: (lifecycle: Lifecycle) => Lifecycle = (x) => x,
  additionalProps: Record<string, any> = {}
): CancelLoading {
  const extensionName = extensionId.split("#")[0];
  const {
    extensionRegistration,
    routeProps,
  } = tryGetExtensionRegistrationAndRouteProps(
    extensionId,
    actualExtensionSlotName,
    attachedExtensionSlotName
  );
  let active = true;

  if (domElement) {
    if (extensionRegistration) {
      extensionRegistration.load().then(
        ({ default: result, ...lifecycle }) =>
          active &&
          mountRootParcel(renderFunction(result ?? lifecycle) as any, {
            ...additionalProps,
            ...routeProps,
            domElement,
          })
      );
    } else {
      throw Error(
        `Couldn't find extension '${extensionName}' to attach to '${actualExtensionSlotName}'`
      );
    }
  }

  return () => {
    active = false;
  };
}

function tryGetExtensionRegistrationAndRouteProps(
  extensionName: string,
  actualExtensionSlotName: string,
  attachedExtensionSlotName: string
) {
  const state = extensionStore.getState();
  const extensionRegistration = state.extensions[extensionName];
  if (!extensionRegistration) {
    return { extensionRegistration: undefined, routeProps: {} };
  }

  const routeProps = getActualRouteProps(
    attachedExtensionSlotName,
    actualExtensionSlotName
  );
  return { extensionRegistration, routeProps };
}

function getActualRouteProps(
  pathTemplate: string,
  url: string
): object | undefined {
  const keys: Array<Key> = [];
  const ptr = pathToRegexp(pathTemplate, keys);
  const result = ptr.exec(url);

  if (result) {
    return keys.reduce((p, c, i) => {
      p[c.name] = result[i + 1];
      return p;
    }, {} as Record<string, string>);
  }

  return undefined;
}

/**
 * This is only used to inform tooling about the extension slot. Extension slots
 * do not have to be registered to mount extensions.
 *
 * @param moduleName The name of the module that contains the extension slot
 * @param name The extension slot name
 */
export function registerExtensionSlot(moduleName: string, name: string) {
  if (extensionSlotsForModule.hasOwnProperty(moduleName)) {
    extensionSlotsForModule[moduleName].push(name);
  } else {
    extensionSlotsForModule[moduleName] = [name];
  }
}

export function unregisterExtensionSlot(moduleName: string, name: string) {
  extensionSlotsForModule[moduleName].splice(
    extensionSlotsForModule[moduleName].indexOf(name),
    1
  );
}

export function getExtensionSlotsForModule(moduleName: string) {
  return extensionSlotsForModule[moduleName] ?? [];
}

export function getIsUIEditorEnabled(): boolean {
  return JSON.parse(
    localStorage.getItem("openmrs:isUIEditorEnabled") ?? "false"
  );
}

export function setIsUIEditorEnabled(enabled: boolean): void {
  localStorage.setItem("openmrs:isUIEditorEnabled", JSON.stringify(enabled));
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
