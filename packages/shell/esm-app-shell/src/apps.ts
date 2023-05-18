"use strict";

import {
  attach,
  registerExtension,
  defineConfigSchema,
  importDynamic,
} from "@openmrs/esm-framework/src/internal";
import { LifeCycles, registerApplication } from "single-spa";
import { emptyLifecycle, routePrefix, routeRegex } from "./helpers";
import type {
  Activator as ActivityFn,
  ActivatorDefinition as RouteDefinition,
  ExtensionDefinition,
  OpenmrsAppRoutes,
  RegisteredPageDefinition,
} from "./types";
import { appName } from "./ui";

const pages: Array<RegisteredPageDefinition> = [];

/**
 * This takes the pages route definition and turns it into a SingleSpa
 * activity function. This activity function is called by SingleSpa to
 * determine whether or not the page should be rendered.
 *
 * @param route The activator to preprocess.
 */
function getActivityFn(
  route: RouteDefinition | Array<RouteDefinition>
): ActivityFn {
  if (Array.isArray(route)) {
    const activators = route.map(getActivityFn);
    return (location) => activators.some((activator) => activator(location));
  } else if (typeof route === "string") {
    return (location) => routePrefix(route, location);
  } else if (route instanceof RegExp) {
    return (location) => routeRegex(route, location);
  } else {
    return () => route;
  }
}

const STARTUP_FUNCTION = "startupApp";
const initializedApps = new Map<string, Promise<unknown>>();

/**
 * This a page definition from an app's routes and turns returns an
 * appropriate SingleSpa loader function. The loader function is called
 * by SingleSpa the first time the application is loaded. The loader
 * function takes no arguments and returns a SingleSpa Application.
 *
 * @param page
 */
function getLoader(
  appName: string,
  component: string
): () => Promise<LifeCycles> {
  return async () => {
    const module = await importDynamic<
      {
        [k: string]: () => LifeCycles | Promise<LifeCycles>;
      } & { startApp?: Function }
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

export function registerApp(appName: string, routes: OpenmrsAppRoutes) {
  if (appName && routes && typeof routes === "object") {
    defineConfigSchema(appName, {});

    const availableExtensions: Array<ExtensionDefinition> =
      routes.extensions ?? [];

    routes.pages?.forEach((p) => {
      pages.push({ ...p, order: p.order ?? Number.MAX_VALUE, appName });
    });

    availableExtensions.forEach((ext) => {
      tryRegisterExtension(appName, ext);
    });
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

  const activityFn = getActivityFn(route);
  const loader = getLoader(page.appName, page.component);
  registerApplication(appName, loader, activityFn);
}

export function tryRegisterExtension(
  moduleName: string,
  extension: ExtensionDefinition
) {
  const name = extension.name;
  const slots = extension.slots
    ? extension.slots
    : extension.slot
    ? [extension.slot]
    : [];

  if (!name) {
    console.warn(
      `A registered extension definition is missing an name and thus cannot be registered.
To fix this, ensure that you define the "name" (or alternatively the "id") field inside the extension definition.`,
      extension
    );
    return;
  }

  if (!extension.component) {
    console.warn(
      `A registered extension definition is missing the component entry and thus cannot be registered.
To fix this, ensure that you define a "component" function inside the extension definition.`,
      extension
    );
    return;
  }

  // registerExtension({
  //   name,
  //   load: getLoader(appName, extension.component),
  //   meta: extension.meta || {},
  //   order: extension.order,
  //   moduleName,
  // });

  // for (const slot of slots) {
  //   attach(slot, name);
  // }
}
