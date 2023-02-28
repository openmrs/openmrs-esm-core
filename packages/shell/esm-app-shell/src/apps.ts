import {
  ExtensionDefinition,
  attach,
  checkStatus,
  getCustomProps,
  PageDefinition,
  registerExtension,
  ResourceLoader,
  Lifecycle,
  defineConfigSchema,
} from "@openmrs/esm-framework/src/internal";
import { registerApplication } from "single-spa";
import { routePrefix, routeRegex, wrapLifecycle } from "./helpers";
import type { Activator, ActivatorDefinition } from "./types";

const pages: Array<PageDefinition> = [];

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

function trySetup(appName: string, setup: () => unknown): any {
  try {
    return setup();
  } catch (error) {
    console.error(`Error when trying to set up the module`, appName, error);
    return undefined;
  }
}

function getLoader(
  load: () => Promise<Lifecycle>,
  resources?: Record<string, ResourceLoader>,
  privileges?: string | string[]
): () => Promise<Lifecycle> {
  if (typeof privileges === "string" || Array.isArray(privileges)) {
    load = wrapLifecycle(load, privileges);
  }

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
        const newLifecycle = {
          ...lifecycle,
          mount(props) {
            return lifecycle.mount({
              ...dataProps,
              ...props,
            });
          },
        };
        if (lifecycle.update) {
          Object.assign(newLifecycle, {
            update(props) {
              return (
                lifecycle.update &&
                lifecycle.update({
                  ...dataProps,
                  ...props,
                })
              );
            },
          });
        }
        return newLifecycle;
      };
    }
  }

  return load;
}

export function registerApp(appName: string, appExports: System.Module) {
  const setup = appExports.setupOpenMRS;

  if (typeof setup === "function") {
    defineConfigSchema(appName, {});

    const assets = appExports.assets;
    const result = trySetup(appName, setup);

    if (Array.isArray(assets)) {
      //TODO
    }

    if (result && typeof result === "object") {
      const availableExtensions: Array<Partial<ExtensionDefinition>> =
        result.extensions ?? [];

      result.pages?.forEach((p) => {
        pages.push({ ...p, appName, order: p.order ?? 1 });
      });

      if (typeof result.activate !== "undefined") {
        pages.push({
          appName,
          load: getLoader(result.lifecycle, result.resources),
          route: result.activate,
          offline: result.offline,
          online: result.online,
          privilege: result.privilege,
          order: result.order || 1,
        });
      }

      availableExtensions.forEach((ext) => {
        tryRegisterExtension(appName, ext);
      });
    }
  }
}

export function finishRegisteringAllApps() {
  pages.sort((a, b) => a.order - b.order);

  // Create a div for each page. This ensures their DOM order.
  // If we don't do this, Single-SPA 5 will create the DOM element only once
  // the page becomes active, which makes it impossible to guarantee order.

  let index = 0;
  let lastAppName: string | undefined = undefined;

  for (let page of pages) {
    if (page.appName !== lastAppName) {
      index = 0;
      lastAppName = page.appName;
    } else {
      index++;
    }
    const name = `${page.appName}-page-${index}`;
    const div = document.createElement("div");
    div.id = `single-spa-application:${name}`;
    document.body.appendChild(div);
    tryRegisterPage(name, page);
  }
}

export function tryRegisterPage(appName: string, page: PageDefinition) {
  const { route, load, online, offline, resources, privilege } = page;

  if (checkStatus(online, offline)) {
    const activityFn = preprocessActivator(route);
    const loader = getLoader(load, resources, privilege);
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
  extension: Partial<ExtensionDefinition>
) {
  const name = extension.name ?? extension.id;
  const slots = extension.slots || [extension.slot];

  if (!name) {
    console.warn(
      `A registered extension definition is missing an name and thus cannot be registered.
To fix this, ensure that you define the "name" (or alternatively the "id") field inside the extension definition.`,
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

  registerExtension({
    name,
    load: getLoader(extension.load, extension.resources, extension.privilege),
    meta: extension.meta || {},
    order: extension.order,
    moduleName,
    offline: extension.offline,
    online: extension.online,
    privileges: extension.privilege,
  });

  for (const slot of slots) {
    if (slot) {
      attach(slot, name);
    }
  }
}
