import { createRequire } from 'node:module';
import { basename, dirname, resolve } from 'node:path';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { inc } from 'semver';
import { logWarn } from './logger';
import type { PackageJson } from './types';

export function getSharedDependencies() {
  const require = createRequire(import.meta.url);
  return require('@openmrs/esm-app-shell/dependencies.json');
}

export function getMainBundle(project: PackageJson) {
  const file = project.browser || project.module || project.main;

  if (!file) {
    throw Error(
      'Could not find project to run. If you ran this outside of a directory containing an app, make sure you specify --sources.',
    );
  }

  return {
    path: file,
    name: basename(file),
    dir: dirname(file),
  };
}

export function getAppRoutes(sourceDirectory: string, project: PackageJson): Record<string, unknown> {
  const routesPath = resolve(sourceDirectory, 'src', 'routes.json');

  if (!existsSync(routesPath)) {
    return {};
  }

  const stats = statSync(routesPath);

  if (!stats.isFile()) {
    return {};
  }

  let json: unknown;

  try {
    json = JSON.parse(readFileSync(routesPath, { encoding: 'utf-8' }));
  } catch (e) {
    // `openmrs develop` re-derives this from a file watcher whose callback nothing awaits, so a
    // throw here becomes an unhandled rejection that takes the dev server down. Saving a routes
    // file mid-edit is the ordinary way to reach that.
    logWarn(`The routes file at ${routesPath} could not be read, so it was ignored: ${e}`);
    return {};
  }

  if (!isSchemaObject(json)) {
    return {};
  }

  json['version'] = project.version ? inc(project.version, 'prerelease', 'local') : undefined;

  const configSchema = readConfigSchema(sourceDirectory);

  if (configSchema) {
    mergeConfigSchema(json, configSchema, project.name ?? sourceDirectory);
  }

  return json;
}

/**
 * Copies a module's schemas into its registry entry, leaving out anything the framework would
 * reject and saying what was left out.
 *
 * Per schema rather than all or nothing, matching what `openmrs assemble` does with the same
 * input, so that a typo in one extension's schema does not silently unconfigure the rest. This is
 * what a developer sees before assemble sees it, and the two disagreeing about a file is worse
 * than either behaviour on its own.
 */
function mergeConfigSchema(json: Record<string, unknown>, configSchema: Record<string, unknown>, name: string): void {
  if (configSchema.configurationSchema !== undefined) {
    if (isSchemaObject(configSchema.configurationSchema)) {
      json['configurationSchema'] = configSchema.configurationSchema;
    } else {
      logWarn(`The configuration schema for ${name} is not an object, so it was left out of the routes registry.`);
    }
  }

  if (configSchema.extensionConfigurationSchemas === undefined) {
    return;
  }

  if (!isSchemaObject(configSchema.extensionConfigurationSchemas)) {
    logWarn(
      `The extension configuration schemas for ${name} are not an object, so none of them were left in the ` +
        `routes registry.`,
    );
    return;
  }

  const accepted: Record<string, unknown> = Object.create(null);

  for (const [extensionName, schema] of Object.entries(configSchema.extensionConfigurationSchemas)) {
    if (isSchemaObject(schema)) {
      accepted[extensionName] = schema;
    } else {
      logWarn(
        `The configuration schema ${name} defines for extension '${extensionName}' is not an object, so it ` +
          `was left out of the routes registry.`,
      );
    }
  }

  if (Object.keys(accepted).length > 0) {
    json['extensionConfigurationSchemas'] = accepted;
  }
}

/**
 * The shape the framework requires of a schema in the routes registry.
 *
 * Worth checking before copying one in, because `isOpenmrsRoutes` validates the registry as a
 * whole: an entry it rejects takes every *other* module's pages and extensions down with it, and
 * the app shell drops the map without saying anything. So nothing may go into a registry that the
 * framework would then refuse to read.
 */
export function isSchemaObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Whether a `config-schema.json` carries either of the two things the registry reads out of one. */
export function hasSchemaKey(parsed: Record<string, unknown>): boolean {
  return 'configurationSchema' in parsed || 'extensionConfigurationSchemas' in parsed;
}

/** Whether this is what the build writes for a module that declares no configuration at all. */
export function isEmptyArtifact(parsed: Record<string, unknown>): boolean {
  return Object.keys(parsed).every((key) => key === '$schema');
}

/**
 * The paths a module's configuration schema may be found at while developing, in the order they are
 * preferred.
 *
 * A hand-written `src/config-schema.json` is the schema, and the module's build does not extract
 * anything. Otherwise the schema is whatever the last build extracted, which
 * `@openmrs/config-schema-plugin` leaves in the cache directory precisely so that it can be found
 * here: `openmrs develop` never looks at a module's build output.
 */
export function getConfigSchemaPathsForDevelopment(sourceDirectory: string): Array<string> {
  return [
    resolve(sourceDirectory, 'src', 'config-schema.json'),
    resolve(sourceDirectory, 'node_modules', '.cache', 'openmrs', 'config-schema.json'),
  ];
}

function readConfigSchema(sourceDirectory: string): Record<string, unknown> | undefined {
  for (const path of getConfigSchemaPathsForDevelopment(sourceDirectory)) {
    if (!existsSync(path)) {
      continue;
    }

    try {
      const parsed = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));

      if (isSchemaObject(parsed)) {
        // The file wraps the schema under `configurationSchema`, and writing the schema straight
        // into it is the obvious thing to do instead. Nothing downstream can tell the difference
        // between that and a module with no configuration, so it is said here or not at all.
        //
        // A file holding nothing but `$schema` is what the plugin writes for a module that has no
        // configuration, which is deliberate: an empty artifact is how a schema that used to exist
        // stops being served. Saying anything about that one would mean saying it about most
        // modules in the distribution, on every rebuild, until nobody read any of these.
        if (!hasSchemaKey(parsed) && !isEmptyArtifact(parsed)) {
          logWarn(
            `The configuration schema at ${path} has neither a 'configurationSchema' nor an ` +
              `'extensionConfigurationSchemas' key, so there is nothing in it to serve. A schema goes under ` +
              `'configurationSchema'.`,
          );
        }

        return parsed;
      }

      logWarn(`The configuration schema at ${path} is not an object, so it was ignored.`);
    } catch (e) {
      // Said out loud rather than passed over: the module's build has already replaced its runtime
      // schema declaration with an assertion that the registry carries one, so a schema that
      // cannot be read leaves every one of its options undefined. Serving the app anyway is still
      // better than refusing to, but silently is how a typo here costs an afternoon.
      logWarn(`The configuration schema at ${path} could not be read, so it was ignored: ${e}`);
    }
  }

  return undefined;
}
