import {
  ExtensionDefinition,
  PageDefinition,
  registerExtension,
} from "@openmrs/esm-extension-manager";
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

export function registerApp(appName: string, appExports: System.Module) {
  const setup = appExports.setupOpenMRS;

  if (typeof setup === "function") {
    const result = setup();

    if (result && typeof result === "object") {
      const availableExtensions: Array<ExtensionDefinition> =
        result.extensions ?? [];

      const availablePages: Array<PageDefinition> = result.pages ?? [];

      if (typeof result.activate !== "undefined") {
        availablePages.push({
          load: result.lifecycle,
          route: result.activate,
        });
      }

      for (const { name, load } of availableExtensions) {
        registerExtension(appName, name, load);
      }

      for (const { route, load } of availablePages) {
        registerApplication(appName, load, preprocessActivator(route));
      }
    }
  }
}
