/** @module @category Routes Utilities */
import type { OpenmrsAppRoutes, OpenmrsRoutes } from '@openmrs/esm-globals';
import { canAccessStorage } from '@openmrs/esm-utils';
import { localStorageRoutesPrefix } from './constants';

const isEnabled = canAccessStorage();

/**
 * Used to add a route override to local storage. These are read as the routes registry
 * is assembled, so the app must be reloaded for new overrides to take effect.
 *
 * @internal
 * @param moduleName The name of the module the routes are for
 * @param routes Either an {@link OpenmrsAppRoutes} object, a string that represents a JSON
 *  version of an {@link OpenmrsAppRoutes} object or a string or URL that resolves to a
 *  JSON document that represents an {@link OpenmrsAppRoutes} object
 */
export function addRoutesOverride(moduleName: string, routes: OpenmrsAppRoutes | string | URL) {
  if (!isEnabled) {
    return;
  }

  if (typeof routes === 'string') {
    if (routes.startsWith('http')) {
      return addRouteOverrideInternal(moduleName, routes);
    } else {
      try {
        const maybeRoutes = JSON.parse(routes);
        if (isOpenmrsAppRoutes(maybeRoutes)) {
          return addRouteOverrideInternal(moduleName, maybeRoutes);
        } else {
          console.error(`The supplied routes for ${moduleName} is not a valid OpenmrsAppRoutes object`, routes);
        }
      } catch (e) {
        console.error(`Could not add routes override for ${moduleName}: `, e);
      }
    }
  } else if (routes instanceof URL) {
    return addRouteOverrideInternal(moduleName, routes.toString());
  } else if (isOpenmrsAppRoutes(routes)) {
    return addRouteOverrideInternal(moduleName, routes);
  }

  console.error(
    `Override for ${moduleName} is not in a valid format. Expected either a Javascript Object, a JSON string of a Javascript object, or a URL`,
    routes,
  );
}

/**
 * Used to remove an existing routes override from local storage. These are read as the routes registry
 * is assembled, so the app must be reloaded for removed override to be removed.
 *
 * @internal
 * @param moduleName The module to remove the overrides for
 */
export function removeRoutesOverride(moduleName: string) {
  if (!isEnabled) {
    return;
  }

  const key = localStorageRoutesPrefix + moduleName;
  localStorage.removeItem(key);
}

/**
 * Used to remove all existing routes overrides from local storage. These are read as the routes registry
 * is assembled, so the app must be reloaded for the removed overrides to appear to be removed.
 *
 * @internal
 */
export function resetAllRoutesOverrides() {
  if (!isEnabled) {
    return;
  }

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(localStorageRoutesPrefix)) {
      localStorage.removeItem(key);
    }
  }
}

function addRouteOverrideInternal(moduleName: string, routes: OpenmrsAppRoutes | string) {
  const key = localStorageRoutesPrefix + moduleName;
  localStorage.setItem(key, JSON.stringify(routes));
}

/**
 * Simple type-predicate to ensure that the value can be treated as an OpenmrsAppRoutes
 * object.
 *
 * @internal
 * @param routes the object to check to see if it is an OpenmrsAppRoutes object
 * @returns true if the routes value is an OpenmrsAppRoutes
 */
export function isOpenmrsAppRoutes(routes: OpenmrsAppRoutes | unknown): routes is OpenmrsAppRoutes {
  if (routes && typeof routes === 'object') {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    // we cast maybeRoutes as OpenmrsAppRoutes mainly so we can refer to the properties it should
    // have without repeated casts
    const maybeRoutes = routes as OpenmrsAppRoutes;

    if (hasOwnProperty.call(routes, 'pages')) {
      if (!Boolean(maybeRoutes.pages) || !Array.isArray(maybeRoutes.pages)) {
        return false;
      }
    }

    if (hasOwnProperty.call(routes, 'extensions')) {
      if (!Boolean(maybeRoutes.extensions) || !Array.isArray(maybeRoutes.extensions)) {
        return false;
      }
    }

    if (hasOwnProperty.call(routes, 'workspaces')) {
      if (!Boolean(maybeRoutes.workspaces) || !Array.isArray(maybeRoutes.workspaces)) {
        return false;
      }
    }

    if (hasOwnProperty.call(routes, 'modals')) {
      if (!Boolean(maybeRoutes.modals) || !Array.isArray(maybeRoutes.modals)) {
        return false;
      }
    }

    // Notice that we're essentially testing for things that cannot be treated as an OpenmrsAppRoutes
    // object. This is because a completely empty object is a valid OpenmrsAppRoutes object.
    return true;
  }

  return false;
}

/**
 * Simple type-predicate to ensure that the value can be treated as an OpenmrsRoutes
 * object.
 *
 * @internal
 * @param routes the object to check to see if it is an OpenmrsRoutes object
 * @returns true if the routes value is an OpenmrsRoutes
 */
export function isOpenmrsRoutes(routes: OpenmrsRoutes | unknown): routes is OpenmrsRoutes {
  if (routes && typeof routes === 'object') {
    const maybeRoutes = routes as OpenmrsRoutes;

    return Object.entries(maybeRoutes).every(([key, value]) => typeof key === 'string' && isOpenmrsAppRoutes(value));
  }

  return false;
}
