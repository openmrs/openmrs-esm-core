import {
  attach,
  registerExtension,
  defineConfigSchema,
  importDynamic,
  RegisteredPageDefinition,
  ExtensionDefinition,
  OpenmrsAppRoutes,
  RouteDefinition,
} from "@openmrs/esm-framework";
import {
  ActivityFn,
  LifeCycles,
  pathToActiveWhen,
  registerApplication,
} from "single-spa";
import { emptyLifecycle, routeRegex } from "./helpers";

const pages: Array<RegisteredPageDefinition> = [];

/**
 * This takes a page's route definitions and returns a single-spa
 * activityFn which returns true when the page matches the current
 * route and false if it does not.
 *
 * @param route A string or regexp that matches the location when the
 * page should be displayed, a boolean constant, or an array of such
 * strings, regexps, and booleans
 * @returns An activityFn suitable to use for a single-spa application
 */
function getActivityFn(
  route: RouteDefinition | Array<RouteDefinition>
): ActivityFn {
  if (Array.isArray(route)) {
    const activators = route.map(getActivityFn);
    return (location) => activators.some((activator) => activator(location));
  } else if (typeof route === "string") {
    return pathToActiveWhen(window.getOpenmrsSpaBase() + route);
  } else if (route instanceof RegExp) {
    return (location) => routeRegex(route, location);
  } else {
    return () => route;
  }
}

/**
 * For pages, we also support the activityFn taking into account the online / offline
 * status. This wraps an existing single-spa activityFn and only allows the page to
 * be rendered in the appropriate mode.
 *
 * By default, we assume that all pages should be rendered when online, but only rendered
 * offline if specifically configured to do so.
 *
 * @param activityFn A standard single-spa activityFn such as that returned by {@link getActivityFn()}
 * @param pageDefinition The RegisteredPageDefinition object for this page
 * @returns An activityFn suitable to use for a single-spa application
 */
function wrapPageActivityFn(
  activityFn: ActivityFn,
  { online, offline }: RegisteredPageDefinition
) {
  return (location: Location) => {
    // basically, if the page should only work online and we're offline or if the
    // page should only work offline and we're online, defaulting to always rendering
    // the page
    if (
      !(
        (navigator.onLine && (online ?? true)) ||
        (!navigator.onLine && (offline ?? false))
      )
    ) {
      return false;
    }

    return activityFn(location);
  };
}

const STARTUP_FUNCTION = "startupApp";
/**
 * @internal
 *
 * Used internally to track which apps have had their `startupApp()` initializer called
 *
 * Values are promises to support asynchronous loading of the same app multiple times
 */
const initializedApps = new Map<string, Promise<unknown>>();

/**
 * This function creates a loader function suitable for use in either a single-spa
 * application or parcel.
 *
 * The returned function is lazy and ensures that the appropriate module is loaded,
 * that the module's `startupApp()` is called before the component is loaded. It
 * then calls the component function, which should return either a single-spa
 * {@link LifeCycles} object or a {@link Promise} that will resolve to such an object.
 *
 * React-based pages or extensions should generally use the framework's
 * `getAsyncLifecycle()` or `getSyncLifecycle()` functions.
 */
function getLoader(
  appName: string,
  component: string
): () => Promise<LifeCycles> {
  return async () => {
    const module = await importDynamic<
      Record<
        Exclude<string, "startupApp">,
        () => LifeCycles | Promise<LifeCycles>
      > & { startupApp?: () => unknown }
    >(appName);

    if (
      module &&
      Object.hasOwn(module, component) &&
      typeof module[component] === "function"
    ) {
      if (!(appName in initializedApps)) {
        await (initializedApps[appName] = new Promise((resolve, reject) => {
          if (Object.hasOwn(module, STARTUP_FUNCTION)) {
            const startup = module[STARTUP_FUNCTION];
            if (typeof startup === "function") {
              return Promise.resolve(startup()).then(resolve).catch(reject);
            }
          }

          resolve(null);
        }));
      } else {
        await initializedApps[appName];
      }

      return Promise.resolve(module[component]());
    } else {
      if (module && Object.hasOwn(module, component)) {
        console.warn(
          `The export ${component} of the app ${appName} is not a function`
        );
      } else {
        console.warn(
          `The app ${appName} does not define a component called ${component}, this cannot be loaded`
        );
      }
    }

    return emptyLifecycle;
  };
}

/**
 * This is the main entry-point for registering an app with the app shell.
 * Each app has a name and should have a `routes.json` file that defines it's
 * associated routes.
 *
 * @param appName The name of the application, e.g. `@openmrs/esm-my-app`
 * @param routes A Javascript object that corresponds to the app's  routes.json`
 * definition.
 */
export function registerApp(appName: string, routes: OpenmrsAppRoutes) {
  if (appName && routes && typeof routes === "object") {
    defineConfigSchema(appName, {});

    const availableExtensions: Array<ExtensionDefinition> =
      routes.extensions ?? [];

    routes.pages?.forEach((p) => {
      pages.push({ ...p, order: p.order ?? Number.MAX_SAFE_INTEGER, appName });
    });

    availableExtensions.forEach((ext) => {
      tryRegisterExtension(appName, ext);
    });
  }
}

/**
 * This is called by the app shell once all route entries have been processed.
 * This actually registers the pages with the application. This function is
 * necessary to ensure that pages are rendered in the DOM according to their
 * order definition, especially because certain pages _must_ be first in the DOM.
 *
 * Each page is rendered into a div with an appropriate name.
 */
export function finishRegisteringAllApps() {
  pages.sort((a, b) => {
    let sort = a.order - b.order;
    if (sort != 0) {
      return sort;
    }
    return a.appName.localeCompare(b.appName, "en");
  });

  // Create a div for each page. This ensures their DOM order.
  // If we don't do this, Single-SPA 5 will create the DOM element only once
  // the page becomes active, which makes it impossible to guarantee order.
  let appIndices = new Map();
  for (let page of pages) {
    if (!appIndices.has(page.appName)) {
      appIndices.set(page.appName, 0);
    } else {
      appIndices.set(page.appName, appIndices.get(page.appName) + 1);
    }
    const index = appIndices.get(page.appName);

    const name = `${page.appName}-page-${index}`;
    const div = document.createElement("div");
    div.id = `single-spa-application:${name}`;
    document.body.appendChild(div);
    tryRegisterPage(name, page);
  }
}

/**
 * This function actually converts each page definition into a single-spa application
 * if that's possible. After this point, pages are rendered using single-spa's
 * routing logic.
 *
 * @param appName The name of the app containing this page
 * @param page A Javascript object that describes the page defintion, derived from `routes.json`
 */
export function tryRegisterPage(
  appName: string,
  page: RegisteredPageDefinition
) {
  const route =
    typeof page.route !== "undefined"
      ? page.route
      : typeof page.routeRegex !== "undefined"
      ? new RegExp(page.routeRegex)
      : false;

  if (route === false) {
    console.warn(
      `A registered page definition is missing a route and thus cannot be registered.
To fix this, ensure that you define the "route" (or alternatively the "routeRegex") field inside the extension definition.`,
      appName
    );
    return;
  }

  if (!page.component) {
    console.warn(
      `A registered page definition is missing a component and thus cannot be registered.
To fix this, ensure that you define the "component" field inside the page definition.`,
      appName
    );
    return;
  }

  const activityFn = wrapPageActivityFn(getActivityFn(route), page);
  const loader = getLoader(page.appName, page.component);
  registerApplication(appName, loader, activityFn);
}

/**
 * This function actually registers an extension definition with the framework and will
 * attach the extension to any configured slots.
 *
 * @param appName The name of the app containing this page
 * @param extension A Javascript object that describes the extension defintion, derived from `routes.json`
 */
export function tryRegisterExtension(
  appName: string,
  extension: ExtensionDefinition
) {
  const name = extension.name;
  if (!name) {
    console.error(
      `An extension definition in ${appName} is missing an name and thus cannot be
registered. To fix this, ensure that you define the "name" field inside the
extension definition.`,
      extension
    );
    return;
  }

  if (extension.slots && extension.slot) {
    console.warn(
      `The extension ${name} from ${appName} declares both a 'slots' property and 
a 'slot' property. Only the 'slots' property will be honored.`
    );
  }
  const slots = extension.slots
    ? extension.slots
    : extension.slot
    ? [extension.slot]
    : [];

  if (!extension.component && !extension.load) {
    console.error(
      `The extension ${name} from ${appName} is missing a 'component' entry and thus cannot be registered.
To fix this, ensure that you define a 'component' field inside the extension definition.`,
      extension
    );
    return;
  }

  let loader;
  if (extension.component) {
    loader = getLoader(appName, extension.component);
  } else if (extension.load) {
    if (typeof extension.load !== "function") {
      console.error(
        `The extension ${name} from ${appName} declares a 'load' property that is not a function. This is not
supported, so the extension will not be loaded.`
      );
      return;
    }
    loader = extension.load;
  }

  registerExtension({
    name,
    load: loader,
    meta: extension.meta || {},
    order: extension.order,
    moduleName: appName,
    privileges: extension.privileges,
    online: extension.online,
    offline: extension.offline,
  });

  for (const slot of slots) {
    attach(slot, name);
  }
}
