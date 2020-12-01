import { getAppState } from "@openmrs/esm-api";
import {
  attach,
  ExtensionDefinition,
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
      // Register apps declared with `lifecycle` and `activate`
      if (typeof result.activate !== "undefined") {
        registerApplication(
          appName,
          result.lifecycle,
          preprocessActivator(result.activate)
        );
      }

      // Register extensions
      const availableExtensions: Array<Partial<AppExtensionDefinition>> =
        result.extensions ?? [];
      for (const ext of availableExtensions) {
        tryRegisterExtension(appName, ext);
      }

      // Register pages
      const availablePages: Array<PageDefinition> = result.pages ?? [];
      for (const { route, load } of availablePages) {
        const activator = preprocessActivator(route);
        registerApplication(appName, load, activator);
        createActivePageSetterHook(route, activator);
      }
    }
  }
}

function tryRegisterExtension(
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

function createActivePageSetterHook(route: string, activator: Activator) {
  const simplifiedRoute = simplify("" + route); // cast to string
  const appName = simplifiedRoute + "-activePageRoute-setter";
  const application = {
    bootstrap: () => Promise.resolve(),
    mount: getPageMountFunction(simplifiedRoute),
    unmount: getPageUnmountFunction(simplifiedRoute),
  };

  registerApplication(appName, application, activator);
}

function getPageMountFunction(route: string) {
  return () =>
    Promise.resolve().then(() => getAppState().setState({ activePage: route }));
}

function getPageUnmountFunction(route: string) {
  return () =>
    Promise.resolve().then(() => {
      const state = getAppState();
      if (state.getState().activePage === route) {
        state.setState({ activePage: null });
      }
    });
}

/**
 * Replaces all sequences of special characters with a single dash
 * @param route An arbitrary string
 */
function simplify(route: string) {
  return route
    .replaceAll(/[\/\.\+\(\)\*\\_\^\$]/g, "-")
    .split("-")
    .filter((v) => v)
    .join("-");
}
