import type { OpenmrsAppRoutes, OpenmrsRoutes } from './types';

/**
 * Simple type-predicate to ensure that the value can be treated as an OpenmrsAppRoutes
 * object.
 *
 * @param routes the object to check to see if it is an OpenmrsAppRoutes object
 * @returns true if the routes value is an OpenmrsAppRoutes
 */
export function isOpenmrsAppRoutes(routes: OpenmrsAppRoutes | unknown): routes is OpenmrsAppRoutes {
  if (routes && typeof routes === 'object') {
    const maybeRoutes = routes as OpenmrsAppRoutes;

    if (Object.hasOwn(routes, 'pages')) {
      if (!Boolean(maybeRoutes.pages) || !Array.isArray(maybeRoutes.pages)) {
        return false;
      }
    }

    if (Object.hasOwn(routes, 'extensions')) {
      if (!Boolean(maybeRoutes.extensions) || !Array.isArray(maybeRoutes.extensions)) {
        return false;
      }
    }

    if (Object.hasOwn(routes, 'workspaces')) {
      if (!Boolean(maybeRoutes.workspaces) || !Array.isArray(maybeRoutes.workspaces)) {
        return false;
      }
    }

    if (Object.hasOwn(routes, 'modals')) {
      if (!Boolean(maybeRoutes.modals) || !Array.isArray(maybeRoutes.modals)) {
        return false;
      }
    }

    // A completely empty object is a valid OpenmrsAppRoutes object.
    return true;
  }

  return false;
}

/**
 * Simple type-predicate to ensure that the value can be treated as an OpenmrsRoutes
 * object.
 *
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
