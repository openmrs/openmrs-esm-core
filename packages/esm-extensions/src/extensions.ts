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
  /** The ID of the extension which is attached to the slot. */
  extensionId: string;
  /**
   * The *actual* name of the extension slot which is defined when the slot is created.
   *
   * If the extension slot has a "normal" name (e.g. `my-extension-slot`), this is equal to `attachedExtensionSlot`.
   *
   * If the extension slot has a URL-like name, this `actualExtensionSlotName`'s path parameters have
   * actual values (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).
   * This is in contrast to the `attachedExtensionSlotName` which defines the path parameters
   * (`e.g. `/mySlot/:uuidParameter`).
   */
  actualExtensionSlotName: string;
  /**
   * The name which has been used to attach the extension to the extension slot.
   *
   * If the extension slot has a "normal" name (e.g. `my-extension-slot`), this is equal to `actualExtensionSlotName`.
   *
   * If the extension slot has a URL-like name, this `attachedExtensionSlotName`'s defines the path parameters
   * (`e.g. `/mySlot/:uuidParameter`).
   * This is in contrast to the `actualExtensionSlotName` where the parameters have been replaced with actual values
   * (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).
   */
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

/**
 * Returns information describing all extensions which can be rendered into an extension slot with
 * the specified name.
 * The returned information describe the extension itself, as well as the extension slot name(s)
 * with which it has been attached.
 * @param actualExtensionSlotName The extension slot name for which matching extension info should be returned.
 * For URL like extension slots, this should be the name where parameters have been replaced with actual values
 * (e.g. `/mySlot/213da954-87a2-432d-91f6-a3c441851726`).
 * @param moduleName The module name. Used for applying extension-specific config values to the result.
 */
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

function getEntries<T>(obj: Record<string, T>): Array<[string, T]> {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}

function getAttachedExtensionInfoForSlot(
  actualExtensionSlotName: string
): Array<AttachedExtensionInfo> {
  const result = (
    attachedExtensionsForExtensionSlot[actualExtensionSlotName] ?? []
  ).map((extensionId) => ({
    attachedExtensionSlotName: actualExtensionSlotName,
    actualExtensionSlotName,
    extensionId,
  }));

  const pathTemplateMatchingExtensions = getEntries(
    attachedExtensionsForExtensionSlot
  ).filter(
    ([attachedExtensionSlotName]) =>
      !attachedExtensionsForExtensionSlot[actualExtensionSlotName] &&
      !!getActualRouteProps(attachedExtensionSlotName, actualExtensionSlotName)
  );

  for (const [
    attachedExtensionSlotName,
    extensionIds,
  ] of pathTemplateMatchingExtensions) {
    result.push(
      ...extensionIds.map((extensionId) => ({
        attachedExtensionSlotName,
        actualExtensionSlotName,
        extensionId,
      }))
    );
  }

  return result;
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
