import { mountRootParcel } from "single-spa";
import { pathToRegexp, Key } from "path-to-regexp";
import { getExtensionSlotConfig } from "@openmrs/esm-config";

/**
 * Creates the extension component <-> extension slot management engine.
 */
const extensions: Record<string, ExtensionRegistration> = {};
const attachedExtensionsForExtensionSlot: Record<string, Array<string>> = {};
const extensionSlotsForModule: Record<string, Array<string>> = {};

interface ExtensionRegistration extends ExtensionDefinition {
  moduleName: string;
}

export interface ExtensionDefinition {
  name: string;
  load(): Promise<any>;
}

export interface AttachedExtensionInfo {
  extensionId: string;
  actualExtensionSlotName: string;
  attachedExtensionSlotName: string;
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

export async function getAttachedExtensionInfoForSlotAndConfig(
  actualExtensionSlotName: string,
  moduleName: string
): Promise<Array<AttachedExtensionInfo>> {
  const config = await getExtensionSlotConfig(
    actualExtensionSlotName,
    moduleName
  );
  let extensionIds = getAttachedExtensionInfoForSlot(actualExtensionSlotName);

  if (config.add) {
    extensionIds = extensionIds.concat(
      config.add.map((id) => ({
        extensionId: id,
        attachedExtensionSlotName: actualExtensionSlotName,
        actualExtensionSlotName,
      }))
    );
  }

  if (config.remove) {
    extensionIds = extensionIds.filter(
      (n) => !config.remove?.includes(n.extensionId)
    );
  }

  if (config.order) {
    extensionIds = extensionIds.sort((a, b) =>
      config.order?.includes(a.extensionId)
        ? config.order.includes(b.extensionId)
          ? config.order.indexOf(a.extensionId) -
            config.order.indexOf(b.extensionId)
          : -1
        : config.order?.includes(b.extensionId)
        ? 1
        : 0
    );
  }

  return extensionIds;
}

function getAttachedExtensionInfoForSlot(
  actualExtensionSlotName: string
): Array<AttachedExtensionInfo> {
  const strictlyMatchingExtensions = (
    attachedExtensionsForExtensionSlot[actualExtensionSlotName] ?? []
  ).map((extensionId) => ({
    attachedExtensionSlotName: actualExtensionSlotName,
    actualExtensionSlotName,
    extensionId,
  }));

  const pathTemplateMatchingExtensions = Object.entries(
    attachedExtensionsForExtensionSlot
  )
    .filter(
      ([attachedExtensionSlotName]) =>
        !attachedExtensionsForExtensionSlot[actualExtensionSlotName] &&
        !!getActualRouteProps(
          attachedExtensionSlotName,
          actualExtensionSlotName
        )
    )
    .flatMap(([attachedExtensionSlotName, extensionIds]) =>
      extensionIds.map((extensionId) => ({
        attachedExtensionSlotName,
        actualExtensionSlotName,
        extensionId,
      }))
    );

  return [...strictlyMatchingExtensions, ...pathTemplateMatchingExtensions];
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
  const extensionRegistration = extensions[extensionName];
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
