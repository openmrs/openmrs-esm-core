import { mountRootParcel } from "single-spa";
import { getExtensionSlotConfig } from "@openmrs/esm-config";

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

export async function getExtensionNamesForExtensionSlot(
  extensionSlotName: string,
  moduleName: string
): Promise<Array<string>> {
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

  if (domElement) {
    if (component) {
      component.load().then(
        ({ default: result }) =>
          active &&
          mountRootParcel(renderFunction(result) as any, {
            domElement,
          })
      );
    } else {
      throw Error(
        `Couldn't find extension '${extensionName}' to attach to '${extensionSlotName}'`
      );
    }
  }

  return () => {
    active = false;
  };
}

export function getIsUIEditorEnabled(): boolean {
  return JSON.parse(
    localStorage.getItem("openmrs:isUIEditorEnabled") ?? "false"
  );
}

export function setIsUIEditorEnabled(enabled: boolean): void {
  localStorage.setItem("openmrs:isUIEditorEnabled", JSON.stringify(enabled));
}

interface ExtensionSlotConfigObject {
  // All these are optional, but TS 4.0.2 doesn't understand the undefined
  // guards above, so we're just telling TS they're not optional.
  add: Array<string>;
  remove: Array<string>;
  order: Array<string>;
}

/**
 * @internal
 * Just for testing.
 */
export function reset() {
  Object.keys(extensions).forEach((key) => delete extensions[key]);
  Object.keys(attachedExtensionsForExtensionSlot).forEach(
    (key) => delete attachedExtensionsForExtensionSlot[key]
  );
}
