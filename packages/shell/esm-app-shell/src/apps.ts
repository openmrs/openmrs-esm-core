import {
  AppExtensionDefinition,
  attach,
  checkStatus,
  getCustomProps,
  PageDefinition,
  registerExtension,
  ResourceLoader,
} from "@openmrs/esm-framework";
import { registerApplication } from "single-spa";
import { routePrefix, routeRegex } from "./helpers";
import type { Activator, ActivatorDefinition } from "./types";

/**
 * Normalizes the activator function, i.e., if we receive a
 * string we'll prepend the SPA base (prefix). We'll also handle
 * the case of a supplied array.
 * @param activator The activator to preprocess.
 */
function preprocessActivator(
  activator: ActivatorDefinition | Array<ActivatorDefinition>
): Activator {
  if (Array.isArray(activator)) {
    const activators = activator.map(preprocessActivator);
    return (location) => activators.some((activator) => activator(location));
  } else if (typeof activator === "string") {
    return (location) => routePrefix(activator, location);
  } else if (activator instanceof RegExp) {
    return (location) => routeRegex(activator, location);
  } else {
    return activator;
  }
}

function trySetup(appName: string, setup: () => any): any {
  try {
    return setup();
  } catch (error) {
    console.error(`Error when trying to set up the module`, appName, error);
    return undefined;
  }
}

function getLoader(
  load: () => Promise<any>,
  resources?: Record<string, ResourceLoader>
) {
  if (typeof resources === "object") {
    const resourceKeys = Object.keys(resources);

    if (resourceKeys.length > 0) {
      return async () => {
        const data = await Promise.all(
          resourceKeys.map((key) => resources[key]())
        );
        const dataProps = resourceKeys.reduce((props, name, index) => {
          props[name] = data[index];
          return props;
        }, {});
        const lifecycle = await load();
        return {
          ...lifecycle,
          mount(props) {
            return lifecycle.mount({
              ...dataProps,
              ...props,
            });
          },
          update(props) {
            return lifecycle.update({
              ...dataProps,
              ...props,
            });
          },
        };
      };
    }
  }

  return load;
}

export function registerApp(appName: string, appExports: System.Module) {
  const setup = appExports.setupOpenMRS;

  if (typeof setup === "function") {
    const result = trySetup(appName, setup);

    if (result && typeof result === "object") {
      const availableExtensions: Array<Partial<AppExtensionDefinition>> =
        result.extensions ?? [];

      const availablePages: Array<PageDefinition> = result.pages ?? [];

      if (typeof result.activate !== "undefined") {
        availablePages.push({
          load: getLoader(result.lifecycle, result.resources),
          route: result.activate,
          offline: result.offline,
          online: result.online,
        });
      }

      availableExtensions.forEach((ext) => {
        tryRegisterExtension(appName, ext);
      });

      return () => {
        availablePages.forEach((page, index) => {
          tryRegisterPage(`${appName}-page-${index}`, page);
        });
      };
    }
  }

  return () => {};
}

export function tryRegisterPage(appName: string, page: PageDefinition) {
  const { route, load, online, offline, resources } = page;

  if (checkStatus(online, offline)) {
    const activityFn = preprocessActivator(route);
    const loader = getLoader(load, resources);
    registerApplication(
      appName,
      loader,
      (location) => activityFn(location),
      () => getCustomProps(online, offline)
    );
  }
}

export function tryRegisterExtension(
  moduleName: string,
  extension: Partial<AppExtensionDefinition>
) {
  const id = extension.id ?? extension.name;
  const slots = extension.slots || [extension.slot];

  if (!id) {
    console.warn(
      `A registered extension definition is missing an id and thus cannot be registered.
To fix this, ensure that you define the "id" (or alternatively the "name") field inside the extension definition.`,
      extension
    );
    return;
  }

  if (!extension.load) {
    console.warn(
      `A registered extension definition is missing the loader and thus cannot be registered. 
To fix this, ensure that you define a "load" function inside the extension definition.`,
      extension
    );
    return;
  }

  registerExtension(id, {
    load: getLoader(extension.load, extension.resources),
    meta: extension.meta || {},
    moduleName,
    offline: extension.offline,
    online: extension.online,
  });

  for (const slot of slots) {
    if (slot) {
      attach(slot, id);
    }
  }
}
