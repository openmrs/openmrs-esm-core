import { type ActivityFn, pathToActiveWhen, registerApplication } from 'single-spa';
import { registerModuleWithConfigSystem } from '@openmrs/esm-config';
import {
  type WorkspaceGroupDefinition,
  type ExtensionDefinition,
  type FeatureFlagDefinition,
  type ModalDefinition,
  type OpenmrsAppRoutes,
  type RegisteredPageDefinition,
  type RouteDefinition,
  type WorkspaceDefinition,
} from '@openmrs/esm-globals';
import { getFeatureFlag } from '@openmrs/esm-feature-flags';
import { routeRegex } from './helpers';
import {
  tryRegisterExtension,
  tryRegisterFeatureFlag,
  tryRegisterModal,
  tryRegisterWorkspace,
  tryRegisterWorkspace2,
  tryRegisterWorkspaceGroup,
  tryRegisterWorkspaceGroups2,
  tryRegisterWorkspaceWindows2,
} from './components';
import { loadLifeCycles } from './load-lifecycles';

// this is the global holder of all pages registered in the app
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
function getActivityFn(route: RouteDefinition | Array<RouteDefinition>): ActivityFn {
  if (Array.isArray(route)) {
    const activators = route.map(getActivityFn);
    return (location) => activators.some((activator) => activator(location));
  } else if (typeof route === 'string') {
    return pathToActiveWhen(window.getOpenmrsSpaBase() + route);
  } else if (route instanceof RegExp) {
    return (location) => routeRegex(route, location);
  } else {
    return () => route;
  }
}

/**
 * For pages, we also add support for rendered them based on online and offline mode as well as
 * any feature flags.
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
  { online, offline, featureFlag }: RegisteredPageDefinition,
): ActivityFn {
  if (window.offlineEnabled) {
    return (location) => {
      // basically, if the page should only work online and we're offline or if the
      // page should only work offline and we're online, defaulting to always rendering
      // the page
      if (!((navigator.onLine && (online ?? true)) || (!navigator.onLine && (offline ?? false)))) {
        return false;
      }

      if (featureFlag) {
        if (!getFeatureFlag(featureFlag)) {
          return false;
        }
      }

      return activityFn(location);
    };
  } else {
    return activityFn;
  }
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
  if (appName && routes && typeof routes === 'object') {
    registerModuleWithConfigSystem(appName);

    const availableExtensions: Array<ExtensionDefinition> = routes.extensions ?? [];
    const availableModals: Array<ModalDefinition> = routes.modals ?? [];
    const availableWorkspaces: Array<WorkspaceDefinition> = routes.workspaces ?? [];
    const availableWorkspaceGroups: Array<WorkspaceGroupDefinition> = routes.workspaceGroups ?? [];
    const availableFeatureFlags: Array<FeatureFlagDefinition> = routes.featureFlags ?? [];
    const availableWorkspaceGroups2 = routes.workspaceGroups2 ?? [];
    const availableWorkspaceWindows2 = routes.workspaceWindows2 ?? [];
    const availableWorkspaces2 = routes.workspaces2 ?? [];

    routes.pages?.forEach((p) => {
      if (
        p &&
        typeof p === 'object' &&
        Object.hasOwn(p, 'component') &&
        (Object.hasOwn(p, 'route') || Object.hasOwn(p, 'routeRegex') || Object.hasOwn(p, 'routes'))
      ) {
        pages.push({
          ...p,
          appName,
        });
      } else {
        console.warn(
          `A page for ${appName} could not be registered as it does not appear to have the required properties`,
          p,
        );
      }
    });

    availableExtensions.forEach((ext) => {
      if (ext && typeof ext === 'object' && Object.hasOwn(ext, 'name') && Object.hasOwn(ext, 'component')) {
        tryRegisterExtension(appName, ext);
      } else {
        console.warn(
          `An extension for ${appName} could not be registered as it does not appear to have the required properties`,
          ext,
        );
      }
    });

    availableModals.forEach((modal) => {
      if (modal && typeof modal === 'object' && Object.hasOwn(modal, 'name') && Object.hasOwn(modal, 'component')) {
        tryRegisterModal(appName, modal);
      } else {
        console.warn(
          `A modal for ${appName} could not be registered as it does not appear to have the required properties`,
          modal,
        );
      }
    });

    availableWorkspaces.forEach((workspace) => {
      if (
        workspace &&
        typeof workspace === 'object' &&
        Object.hasOwn(workspace, 'name') &&
        Object.hasOwn(workspace, 'component')
      ) {
        tryRegisterWorkspace(appName, workspace);
      } else {
        console.warn(
          `A workspace for ${appName} could not be registered as it does not appear to have the required properties`,
          workspace,
        );
      }
    });

    availableWorkspaceGroups.forEach((workspaceGroup) => {
      if (workspaceGroup && typeof workspaceGroup === 'object' && Object.hasOwn(workspaceGroup, 'name')) {
        tryRegisterWorkspaceGroup(appName, workspaceGroup);
      } else {
        console.warn(
          `A workspace group for ${appName} could not be registered as it does not appear to have the required properties`,
          workspaceGroup,
        );
      }
    });
    tryRegisterWorkspaceGroups2(appName, availableWorkspaceGroups2);
    tryRegisterWorkspaceWindows2(appName, availableWorkspaceWindows2);
    tryRegisterWorkspace2(appName, availableWorkspaces2);

    availableFeatureFlags.forEach((featureFlag) => {
      if (featureFlag && typeof featureFlag === 'object' && Object.hasOwn(featureFlag, 'flagName')) {
        tryRegisterFeatureFlag(appName, featureFlag);
      } else {
        console.warn(
          `A feature flag for ${appName} could not be registered as it does not appear to have the required properties`,
          featureFlag,
        );
      }
    });
  }
}

/**
 * This is called by the app shell once all route entries have been processed.
 * This registers the pages with the application, and creates the root div
 * for each page in the DOM element specified by the page's containerDomId.
 */
export function finishRegisteringAllApps() {
  pages.sort((a, b) => {
    return a.appName.localeCompare(b.appName, 'en');
  });

  // Create a div for each page, unless the DOM already contains the div with
  // the expected id for the page to be mounted on. See:
  // https://single-spa.js.org/docs/configuration/#two-registered-applications-simultaneously
  // The div is put inside the DOM element specified by the page's containerDomId.
  // If we don't do this, Single-SPA 5 will create the DOM element only once
  // the page becomes active, at the end of <body>.
  let appIndices = new Map();
  for (let page of pages) {
    if (!appIndices.has(page.appName)) {
      appIndices.set(page.appName, 0);
    } else {
      appIndices.set(page.appName, appIndices.get(page.appName) + 1);
    }
    const index = appIndices.get(page.appName);

    const name = `${page.appName}-page-${index}`;
    const containerDomId = page.containerDomId ?? 'omrs-apps-container';
    const containerDiv = document.getElementById(containerDomId);
    const appDomRootId = `single-spa-application:${name}`;

    if (containerDiv) {
      const div = document.createElement('div');
      div.id = appDomRootId;
      containerDiv?.appendChild(div);
    } else {
      throw new Error(
        `${page.appName} ${page.component} cannot be mounted to "${containerDomId}"; DOM element does not exist.`,
      );
    }
    tryRegisterPage(name, page);
  }
}

/**
 * This function converts each page definition into a single-spa application
 * if that's possible. After this point, pages are rendered using single-spa's
 * routing logic.
 *
 * @param appName The name of the app containing this page
 * @param page An object that describes the page, derived from `routes.json`
 */
function tryRegisterPage(appName: string, page: RegisteredPageDefinition) {
  const route =
    typeof page.route !== 'undefined'
      ? page.route
      : typeof page.routeRegex !== 'undefined'
        ? new RegExp(page.routeRegex)
        : false;

  if (route === false) {
    console.warn(
      `A registered page definition is missing a route and thus cannot be registered.
To fix this, ensure that you define the "route" (or alternatively the "routeRegex") field inside the extension definition.`,
      appName,
    );
    return;
  }

  if (!page.component) {
    console.warn(
      `A registered page definition is missing a component and thus cannot be registered.
To fix this, ensure that you define the "component" field inside the page definition.`,
      appName,
    );
    return;
  }

  const activityFn = wrapPageActivityFn(getActivityFn(route), page);
  const loader = () => loadLifeCycles(page.appName, page.component);
  registerApplication(appName, loader, activityFn);
}
