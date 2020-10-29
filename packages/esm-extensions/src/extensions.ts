import { mountRootParcel } from "single-spa";
import { pathToRegexp, Key } from "path-to-regexp";
import { getExtensionSlotConfig } from "@openmrs/esm-config";

/**
 * Creates the extension component <-> extension slot management engine.
 */
const extensions: Record<string, ExtensionRegistration> = {};
const attachedExtensionsForExtensionSlot: Record<string, Array<string>> = {};
const extensionSlotsForModule: Record<string, Array<string>> = {};

interface ExtensionLinkMatcher {
  (link: string): undefined | Record<string, string>;
}

interface ExtensionRegistration extends ExtensionDefinition {
  moduleName: string;
  matcher: ExtensionLinkMatcher;
}

/**
 * Generates a matcher for URL-like extension slot names.
 * Returns a function that provides the params (or an empty object)
 * if a match has been found. Otherwise undefined is returned.
 * @param url The URL to generate a matcher for.
 */
function getUrlMatcher(url: string): ExtensionLinkMatcher {
  const keys: Array<Key> = [];
  const ptr = pathToRegexp(url, keys);

  return (link) => {
    const result = ptr.exec(link);

    if (result) {
      return keys.reduce((p, c, i) => {
        p[c.name] = result[i + 1];
        return p;
      }, {} as Record<string, string>);
    }

    return undefined;
  };
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
  moduleName: string,
  name: string,
  load: () => Promise<any>
) {
  extensions[name] = {
    name,
    load,
    moduleName,
    matcher: name.startsWith("/") ? getUrlMatcher(name) : () => undefined,
  };
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

export function attach(extensionSlotName: string, extensionId: string) {
  if (attachedExtensionsForExtensionSlot.hasOwnProperty(extensionSlotName)) {
    attachedExtensionsForExtensionSlot[extensionSlotName].push(extensionId);
  } else {
    attachedExtensionsForExtensionSlot[extensionSlotName] = [extensionId];
  }
}

export function getExtensionRegistration(
  extensionId: string
): ExtensionRegistration {
  const extensionName = extensionId.split("#")[0];
  return extensions[extensionName];
}

export async function getExtensionIdsForExtensionSlot(
  extensionSlotName: string,
  moduleName: string
): Promise<Array<string>> {
  const config = await getExtensionSlotConfig(extensionSlotName, moduleName);
  let extensionIds =
    attachedExtensionsForExtensionSlot[extensionSlotName] ?? [];

  if (config.add) {
    extensionIds = extensionIds.concat(config.add);
  }

  if (config.remove) {
    extensionIds = extensionIds.filter((n) => !config.remove?.includes(n));
  }

  if (config.order) {
    extensionIds = extensionIds.sort((a, b) =>
      config.order?.includes(a)
        ? config.order.includes(b)
          ? config.order.indexOf(a) - config.order.indexOf(b)
          : -1
        : config.order?.includes(b)
        ? 1
        : 0
    );
  }

  return extensionIds;
}

function getExtensionComponent(extensionName: string) {
  const component = extensions[extensionName];

  if (!component && extensionName && extensionName[0] === "/") {
    for (const name of Object.keys(extensions)) {
      const routeProps = extensions[name].matcher(extensionName);

      if (routeProps) {
        return { component: extensionName[name], routeProps };
      }
    }
  }

  return { component, routeProps: {} };
}

/**
 * Mounts into a DOM node (representing an extension slot)
 * a lazy-loaded component from *any* microfrontend
 * that registered an extension component for this slot.
 */
export function renderExtension(
  domElement: HTMLElement,
  extensionSlotName: string, // will be used to look up configuration info
  extensionId: string,
  renderFunction: (lifecycle: Lifecycle) => Lifecycle = (x) => x,
  additionalProps: Record<string, any> = {}
): CancelLoading {
  const extensionName = extensionId.split("#")[0];
  const { component, routeProps } = getExtensionComponent(extensionName);
  let active = true;

  if (domElement) {
    if (component) {
      component.load().then(
        ({ default: result }) =>
          active &&
          mountRootParcel(renderFunction(result) as any, {
            ...additionalProps,
            ...routeProps,
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
