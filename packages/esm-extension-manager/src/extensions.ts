/**
 * Creates the extension component <-> extension slot management engine.
 *
 */

let extensions: Record<string, ExtensionDefinition> = {};
let attachedExtensionsForExtensionSlot: Record<string, Array<string>> = {};

const importSingleSpaPromise = System.import("single-spa");
const importConfigPromise = System.import("@openmrs/esm-module-config");

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

export async function getExtensionNamesForExtensionSlot(
  extensionSlotName: string,
  moduleName: string
): Promise<Array<string>> {
  const { getExtensionSlotConfig } = await importConfigPromise;
  const config: ExtensionSlotConfigObject = await getExtensionSlotConfig(
    extensionSlotName,
    moduleName
  );
  let extensionNames =
    attachedExtensionsForExtensionSlot[extensionSlotName] ?? [];
  if (config.add) {
    extensionNames = extensionNames.concat(config.add);
  }
  if (config.remove) {
    extensionNames = extensionNames.filter((n) => !config.remove?.includes(n));
  }
  if (config.order) {
    extensionNames = extensionNames.sort((a, b) =>
      config.order.includes(a)
        ? config.order.includes(b)
          ? config.order.indexOf(a) - config.order.indexOf(b)
          : -1
        : config.order.includes(b)
        ? 1
        : 0
    );
  }
  return extensionNames;
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
      if (component) {
        component.load().then(
          ({ default: result }) =>
            active &&
            mountRootParcel(renderFunction(result), {
              domElement,
            })
        );
      } else {
        throw Error(
          `Couldn't find extension '${extensionName}' to attach to '${extensionSlotName}'`
        );
      }
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

interface ExtensionSlotConfigObject {
  // All these are optional, but TS 4.0.2 doesn't understand the undefined
  // guards above, so we're just telling TS they're not optional.
  add: string[];
  remove: string[];
  order: string[];
}

/**
 * @internal
 * Just for testing.
 */
export function reset() {
  extensions = {};
  attachedExtensionsForExtensionSlot = {};
}
