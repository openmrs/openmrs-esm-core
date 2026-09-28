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

    // Config schemas reach the configuration system from here, and this predicate also guards the
    // route overrides a developer can hand-write into local storage, so a malformed one is caught
    // before it becomes a module's configuration.
    //
    // Rejecting here is not cheap: `isOpenmrsRoutes` accepts a registry only if every entry in it
    // passes, so one bad schema costs every *other* module its routes as well. Whatever writes a
    // registry has to check schemas to at least this depth before putting them in one.
    if (Object.hasOwn(routes, 'configurationSchema')) {
      if (!isSchemaObject(maybeRoutes.configurationSchema)) {
        return false;
      }
    }

    if (Object.hasOwn(routes, 'extensionConfigurationSchemas')) {
      const schemas = maybeRoutes.extensionConfigurationSchemas;

      if (!isSchemaObject(schemas) || !Object.values(schemas).every(isSchemaObject)) {
        return false;
      }
    }

    // A completely empty object is a valid OpenmrsAppRoutes object.
    return true;
  }

  return false;
}

function isSchemaObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Simple type-predicate to ensure that the value can be treated as an OpenmrsRoutes
 * object.
 *
 * @param routes the object to check to see if it is an OpenmrsRoutes object
 * @returns true if the routes value is an OpenmrsRoutes
 */
export function isOpenmrsRoutes(routes: OpenmrsRoutes | unknown): routes is OpenmrsRoutes {
  if (
    routes &&
    typeof routes === 'object' &&
    'routes' in routes &&
    routes['routes'] &&
    typeof routes['routes'] === 'object'
  ) {
    const maybeRoutes = routes as OpenmrsRoutes;

    return Object.entries(maybeRoutes.routes).every(
      ([key, value]) => typeof key === 'string' && isOpenmrsAppRoutes(value),
    );
  }

  return false;
}
