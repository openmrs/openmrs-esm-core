/**
 * Creates the extension component <-> extension slot management engine.
 *
 */

const extensions: Record<string, ExtensionDefinition> = {};
const attachedExtensionsForExtensionSlot: Record<string, Array<string>> = {};

const importSingleSpaPromise = System.import("single-spa");

export interface ExtensionDefinition {
  appName: string;
  name: string;
  load(): Promise<any>;
}

export interface CancelLoading {
  (): void;
}

export function registerExtension({
  name,
  load,
  appName,
}: ExtensionDefinition): void {
  extensions[name] = {
    name,
    load,
    appName,
  };
}

export function attach(extensionSlotName: string, extensionName: string): void {
  if (attachedExtensionsForExtensionSlot.hasOwnProperty(extensionSlotName)) {
    attachedExtensionsForExtensionSlot[extensionSlotName].push(extensionName);
  } else {
    attachedExtensionsForExtensionSlot[extensionSlotName] = [extensionName];
  }
}

export function getExtensionNamesForExtensionSlot(
  extensionSlotName: string
): string[] {
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

  importSingleSpaPromise.then(({ mountRootParcel }) => {
    if (domElement) {
      component.load().then(
        ({ default: result }) =>
          active &&
          mountRootParcel(renderFunction(result), {
            domElement,
          })
      );
    }
  });
  return () => {
    active = false;
  };
}

interface Lifecycle {
  bootstrap: () => void;
  mount: () => void;
  unmount: () => void;
  update?: () => void;
}
