import { mountRootParcel } from "single-spa";

/**
 * Creates the extension component <-> extension slot management engine.
 */
const extensions: Record<string, ExtensionRegistration> = {};
const attachedExtensionsForExtensionSlot: Record<string, Array<string>> = {};

interface ExtensionRegistration extends ExtensionDefinition {
  appName: string;
}

export interface ExtensionDefinition {
  name: string;
  load(): Promise<any>;
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

export function registerExtension(
  appName: string,
  name: string,
  load: () => Promise<any>
) {
  extensions[name] = {
    name,
    load,
    appName,
  };
}

export function attach(extensionSlotName: string, extensionName: string) {
  if (attachedExtensionsForExtensionSlot.hasOwnProperty(extensionSlotName)) {
    attachedExtensionsForExtensionSlot[extensionSlotName].push(extensionName);
  } else {
    attachedExtensionsForExtensionSlot[extensionSlotName] = [extensionName];
  }
}

export function getExtensionNamesForExtensionSlot(extensionSlotName: string) {
  return attachedExtensionsForExtensionSlot[extensionSlotName] ?? [];
}

/**
 * Updates a DOM node (representing a so-called "extension slot")
 * dynamically with a lazy loaded component from *any* microfrontend
 * that registered an extension component for this slot.
 */
export function renderExtension(
  domElement: HTMLElement,
  extensionSlotName: string, // will be used to look up configuration info
  extensionName: string,
  renderFunction: (lifecycle: Lifecycle) => Lifecycle = (x) => x
): CancelLoading {
  const component = extensions[extensionName];
  let active = true;

  if (domElement) {
    component.load().then(
      ({ default: result }) =>
        active &&
        mountRootParcel(renderFunction(result) as any, {
          domElement,
        })
    );
  }

  return () => {
    active = false;
  };
}
