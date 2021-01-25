import {
  attach,
  PageDefinition,
  registerExtension,
} from "@openmrs/esm-extensions";
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

interface ModernAppExtensionDefinition {
  id: string;
  slot: string;
  load(): Promise<any>;
}

interface LegacyAppExtensionDefinition {
  name: string;
  load(): Promise<any>;
}

type AppExtensionDefinition = ModernAppExtensionDefinition &
  LegacyAppExtensionDefinition;

export function registerApp(appName: string, appExports: System.Module) {
  const setup = appExports.setupOpenMRS;

  if (typeof setup === "function") {
    const result = setup();

    if (result && typeof result === "object") {
      const availableExtensions: Array<Partial<AppExtensionDefinition>> =
        result.extensions ?? [];

      const availablePages: Array<PageDefinition> = result.pages ?? [];

      if (typeof result.activate !== "undefined") {
        availablePages.push({
          load: result.lifecycle,
          route: result.activate,
        });
      }

      for (const ext of availableExtensions) {
        tryRegisterExtension(appName, ext);
      }

      for (const { route, load } of availablePages) {
        registerApplication(appName, load, preprocessActivator(route));
      }
    }
  }
}

export function tryRegisterExtension(
  appName: string,
  ext: Partial<AppExtensionDefinition>
) {
  const name = ext.id ?? ext.name;
  const slot = ext.slot;

  if (!name) {
    console.warn(
      "A registered extension definition is missing an id and thus cannot be registered. " +
        "To fix this, ensure that you define the `id` (or alternatively the `name`) field inside the extension definition.",
      ext
    );
    return;
  }

  if (!ext.load) {
    console.warn(
      "A registered extension definition is missing the loader and thus cannot be registered. " +
        "To fix this, ensure that you define a `load` function inside the extension definition.",
      ext
    );
    return;
  }

  registerExtension(appName, name, ext.load);

  if (slot) {
    attach(slot, name);
  }
}
