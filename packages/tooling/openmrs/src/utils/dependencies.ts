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
    // `openmrs develop` calls this from an unawaited file-watcher callback, where a throw would take
    // the dev server down. A routes file saved mid-edit is enough to trigger it.
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
 * Copies a module's schemas into its registry entry, warning about and leaving out any the framework
 * would reject. Filters per schema, as `openmrs assemble` does, so that development and assemble agree.
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
 * The shape the framework requires of a schema in the routes registry. Check before copying one in:
 * `isOpenmrsRoutes` rejects the whole registry if any entry is malformed, silently dropping every
 * module's pages and extensions.
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
 * The paths a module's configuration schema may be found at while developing, most preferred first:
 * a hand-written `src/config-schema.json`, then the copy `@openmrs/config-schema-plugin` leaves in
 * the cache directory, since `openmrs develop` never reads a module's build output.
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
        // Most likely a schema written without its `configurationSchema` wrapper, which nothing
        // downstream can tell apart from no configuration. A `$schema`-only file is exempt: it is
        // what the plugin writes for a module with no configuration, so warning would be noise.
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
      // The build has stripped the module's runtime schema declaration, so an unreadable schema
      // leaves every option undefined; the warning is the only sign of why.
      logWarn(`The configuration schema at ${path} could not be read, so it was ignored: ${e}`);
    }
  }

  return undefined;
}
