import { createRequire } from 'node:module';
import merge from 'lodash/merge.js';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, basename, sep } from 'node:path';
import { Readable } from 'node:stream';
import { checkbox, input } from '@inquirer/prompts';
import npmRegistryFetch from 'npm-registry-fetch';
import pacote from 'pacote';
import semver from 'semver';
import { contentHash, logInfo, logWarn, untar } from '../utils';
import { hasSchemaKey, isSchemaObject } from '../utils/dependencies';
import { getNpmRegistryConfiguration } from '../utils/npmConfig';

export interface AssembleArgs {
  target: string;
  mode: string;
  config: Array<string>;
  registry?: string;
  configFiles: Array<string>;
  hashFiles: boolean;
  fresh: boolean;
  buildRoutes: boolean;
  manifest: boolean;
  applicationVersion?: string;
  ensureEntrypoints: boolean;
  strictSchemas: boolean;
}

interface NpmSearchResult {
  objects: Array<{
    package: {
      name: string;
      version: string;
    };
  }>;
  total: number;
}

interface AssembleConfig {
  publicUrl: string;
  frontendModules: Record<string, string>;
  frontendModuleExcludes?: Array<string>;
}

async function readConfig(
  mode: string,
  configs: Array<string>,
  fetchOptions: npmRegistryFetch.Options,
): Promise<AssembleConfig> {
  switch (mode) {
    // curly-braces are here to add a lexical scope which allows us to safely
    // declare variables
    case 'config': {
      if (configs.length === 0) {
        configs = [resolve(process.cwd(), 'spa-build-config.json')];
      }

      const results: {
        configs: Array<AssembleConfig>;
        errors: Array<Error>;
      } = {
        configs: [],
        errors: [],
      };

      for (const config of configs) {
        if (!existsSync(config)) {
          results.errors.push(new Error(`Could not find the config file "${config}".`));
          continue;
        }

        logInfo(`Reading configuration ${config} ...`);

        results.configs.push({
          ...JSON.parse(await readFile(config, 'utf8')),
        });
      }

      if (results.errors.length > 0) {
        throw new Error(
          results.errors.reduce((str, e, idx) => {
            if (idx > 0) {
              str += '\n\n';
            }

            return str + e.message;
          }, ''),
        );
      }

      return results.configs.reduce((config, newConfig) => {
        // excludes are processed for each config in turn; this ensure that modules removed in one config can
        // be added back by providing another config override
        if (Array.isArray(newConfig.frontendModuleExcludes)) {
          newConfig.frontendModuleExcludes.forEach((exclude) => {
            if (typeof exclude === 'string' && config.frontendModules[exclude]) {
              delete config.frontendModules[exclude];
            }
          });
        }

        if (newConfig.frontendModules) {
          config.frontendModules = { ...config.frontendModules, ...newConfig.frontendModules };
        }
        return config;
      });
    }
    case 'survey': {
      logInfo(`Loading available frontend modules ...`);

      // see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#get-v1search for what these
      // options mean; in essence, we search for anything with the keyword openmrs that has at least one
      // stable version; quality is down-scored because that metric favours smaller apps over core
      // community assets. Maintenance is boosted to de-score relatively unmaintained apps, as the framework
      // still has a fair bit of churn
      const packages = await npmRegistryFetch
        .json(
          `/-/v1/search?text=app%20keywords:openmrs&not:unstable&quality=0.001&maintenance=3.0&size=250`,
          fetchOptions,
        )
        .then((res) =>
          (res as unknown as NpmSearchResult).objects
            .map((m) => ({
              name: m.package.name,
              version: m.package.version,
            }))
            .filter((m) => m.name.endsWith('-app')),
        );

      const selectedPackages = await checkbox({
        message: 'Select frontend modules to include:',
        choices: packages.map((pckg) => ({
          name: pckg.name,
          value: pckg,
        })),
        pageSize: 20,
      });

      const frontendModules: Record<string, string> = {};
      for (const pckg of selectedPackages) {
        const version = await input({
          message: `Version for "${pckg.name}"?`,
          default: pckg.version,
          validate: (value) => {
            if (!semver.validRange(value)) {
              return `${value} does not appear to be a valid semver or version range. See https://semver.npmjs.com/#syntax-examples.`;
            }

            return true;
          },
        });

        frontendModules[pckg.name] = version;
      }

      return {
        publicUrl: '.',
        frontendModules,
      };
    }
  }

  return {
    frontendModules: {},
    publicUrl: '.',
  };
}

async function downloadPackage(
  esmName: string,
  esmVersion: string,
  baseDir: string,
  fetchOptions: npmRegistryFetch.Options,
): Promise<Buffer> {
  if (esmVersion && esmVersion.startsWith('file:')) {
    const source = resolve(baseDir, esmVersion.substring(5));
    return readFile(source);
  } else if (esmVersion && /^https?:\/\//.test(esmVersion)) {
    const response = await fetch(esmVersion);
    if (!response.ok) {
      throw new Error(`Failed to download package from ${esmVersion}: ${response.status} ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  } else {
    const packageName = esmVersion ? `${esmName}@${esmVersion}` : esmName;
    const tarManifest = await pacote.manifest(packageName, fetchOptions);

    if (!Boolean(tarManifest) || !Boolean(tarManifest._resolved) || !Boolean(tarManifest._integrity)) {
      throw new Error(`Failed to load manifest for ${packageName} from registry ${fetchOptions.registry}`);
    }

    return pacote.tarball(tarManifest._resolved, {
      ...fetchOptions,
      integrity: tarManifest._integrity,
    });
  }
}

/**
 * Resolves a file from inside a package tarball against the directory we extract that package into,
 * and rejects anything that lands outside it.
 *
 * @param outputDir The directory the module is being extracted into
 * @param fileName The tarball-supplied path of the file, relative to `outputDir`
 * @returns The absolute path to write the file to
 */
function resolveExtractedFile(outputDir: string, fileName: string): string {
  const root = resolve(outputDir);
  const targetFile = resolve(root, fileName);

  if (!targetFile.startsWith(root + sep)) {
    throw new Error(
      `Refusing to extract "${fileName}" to ${targetFile}, which is outside of ${root}. This package appears to be malicious.`,
    );
  }

  return targetFile;
}

/**
 * Validates the version a package declares for itself before we build paths out of it.
 *
 * @param version The version as declared in the package's package.json
 * @param packageDir The directory prefix the package is being extracted to, used for the error
 * @returns The version, safe to use as part of a path
 */
function validateVersion(version: unknown, packageDir: string): string {
  if (semver.valid(version as string) === null) {
    throw new Error(
      `The package extracted to ${packageDir} declares the version "${version}", which is not a valid semver version. ` +
        `Refusing to assemble it. This package appears to be malicious.`,
    );
  }

  return version as string;
}

async function extractFiles(buffer: Buffer, targetDir: string): Promise<[string, string]> {
  const packageRoot = 'package';
  const rs = Readable.from(buffer);
  const files = await untar(rs);
  const packageJson = JSON.parse(files[`${packageRoot}/package.json`].toString('utf8'));
  const version = validateVersion(packageJson.version ?? '0.0.0', targetDir);
  const entryModule = packageJson.browser ?? packageJson.module ?? packageJson.main;
  const fileName = basename(entryModule);
  const sourceDir = dirname(entryModule);
  const outputDir = `${targetDir}-${version}`;
  await mkdir(outputDir, { recursive: true });

  // When the entry module lives at the package root, dirname() yields '.' (or '' for an
  // empty entry). In that case the files sit directly under `package/` with no intermediate
  // directory, so the prefix must be the package root itself rather than `package/.`.
  const sourcePrefix = sourceDir === '.' || sourceDir === '' ? `${packageRoot}/` : `${packageRoot}/${sourceDir}/`;

  await Promise.all(
    Object.keys(files)
      // directory entries carry no content and are created by the mkdir() below, so writing them
      // out would only ever mean writing an empty file over a directory
      .filter((m) => m.startsWith(sourcePrefix) && !m.endsWith('/'))
      .map(async (m) => {
        const content = files[m];
        const fileName = m.replace(sourcePrefix, '');
        const targetFile = resolveExtractedFile(outputDir, fileName);
        await mkdir(dirname(targetFile), { recursive: true });
        await writeFile(targetFile, content);
      }),
  );

  return [fileName, version];
}

/**
 * Derives the directory name a frontend module is extracted into from the name it is listed under
 * in the assemble config.
 *
 * @param esmName The name the module is listed under in the assemble config
 * @returns The directory name, relative to the assembly target
 */
function toModuleDirName(esmName: string): string {
  const baseDirName = `${esmName}`.replace(/^@/, '').replace(/\//, '-');

  if (!/^[^/\\]+$/.test(baseDirName) || baseDirName === '.' || baseDirName === '..') {
    throw new Error(
      `"${esmName}" cannot be used as a frontend module name because "${baseDirName}" is not a valid directory name.`,
    );
  }

  return baseDirName;
}

export async function runAssemble(args: AssembleArgs) {
  const npmConf = getNpmRegistryConfiguration(args.registry);
  const config = await readConfig(args.mode, args.config, npmConf);

  const importmap = {
    imports: {},
  };

  const require = createRequire(import.meta.url);
  const versionManifest = {
    coreVersion: require(resolve(import.meta.dirname, '..', '..', 'package.json')).version,
    frontendModules: {},
  };

  const routes = {};

  // Keyed by names that come out of a downloaded package, like the two maps further down.
  const configSchemas: Record<string, { configurationSchema?: unknown; extensionConfigurationSchemas?: unknown }> =
    Object.create(null);

  logInfo(`Assembling dependencies and building import map and routes registry...`);

  const { frontendModules = {}, publicUrl = '.' } = config;

  if (args.fresh && existsSync(args.target)) {
    await rm(args.target, { recursive: true, force: true });
  }

  await mkdir(args.target, { recursive: true });

  // When `ensureEntrypoints` is set, a missing routes.json or code entrypoint is a fatal error rather than a
  // warning. We collect the failures across all modules so the user sees every problem in a single run instead
  // of having to fix and re-run repeatedly. The actual throw happens once the Promise.all below has settled.
  const entrypointErrors: Array<string> = [];
  const reportMissingEntrypoint = (message: string) => {
    if (args.ensureEntrypoints) {
      entrypointErrors.push(message);
    } else {
      logWarn(message);
    }
  };

  const schemaErrors: Array<string> = [];
  const reportSchemaProblem = (message: string) => {
    if (args.strictSchemas) {
      schemaErrors.push(message);
    } else {
      logWarn(message);
    }
  };

  await Promise.all(
    Object.keys(frontendModules).map(async (esmName) => {
      const esmVersion = frontendModules[esmName];
      // derived before anything is downloaded so a bad name fails the run without any network I/O
      const baseDirName = toModuleDirName(esmName);
      const tgzBuffer = await downloadPackage(esmName, esmVersion, process.cwd(), npmConf);

      const [fileName, version] = await extractFiles(tgzBuffer, resolve(args.target, baseDirName));
      const dirName = `${baseDirName}-${version}`;

      // The routes are how the framework ensures that it loads the correct module before any pages
      // or extensions; if it's missing the app won't load in the browser.
      const appRoutes = resolve(args.target, dirName, 'routes.json');
      if (existsSync(appRoutes)) {
        try {
          routes[esmName] = JSON.parse(await readFile(appRoutes, 'utf8'));
          routes[esmName]['version'] = version;
        } catch (e) {
          reportMissingEntrypoint(
            `Error while processing routes for ${esmName} using ${appRoutes}: ${e}. Note that this means that no pages or extensions for ${esmName} will be available.`,
          );
        }
      } else {
        reportMissingEntrypoint(
          `Routes file ${appRoutes} does not exist. We expect that routes file to be defined by ${esmName}. Note that this means that no pages or extensions for ${esmName} will be available.`,
        );

        if (routes.hasOwnProperty(esmName)) {
          delete routes[esmName];
        }
      }

      // if a configuration schema exists, we load it into the global configuration schemas
      // such schemas are preferable because we can load them without needing to load code
      const appConfigSchema = resolve(args.target, dirName, 'config-schema.json');
      if (existsSync(appConfigSchema)) {
        try {
          const parsed = JSON.parse(await readFile(appConfigSchema, 'utf8'));

          if (isSchemaObject(parsed)) {
            configSchemas[esmName] = parsed;

            // The file wraps the schema under `configurationSchema`, and writing the schema
            // straight into it is the obvious thing to do instead. Nothing downstream can tell
            // that apart from a module with no configuration, so it is said here or not at all.
            //
            // No exemption for an artifact holding nothing but `$schema`, unlike the development
            // path: the build does not emit one of those into a module's output, so a file here
            // with neither key was written by hand and means what this says.
            if (!hasSchemaKey(parsed)) {
              reportSchemaProblem(
                `The configuration schema for ${esmName} at ${appConfigSchema} has neither a ` +
                  `'configurationSchema' nor an 'extensionConfigurationSchemas' key, so nothing from it was ` +
                  `added to the routes registry. A schema goes under 'configurationSchema'.`,
              );
            }
          } else {
            reportSchemaProblem(
              `The configuration schema for ${esmName} at ${appConfigSchema} is not an object, so it was ignored. ` +
                `${esmName}'s configuration will not be known until it loads.`,
            );
          }
        } catch (e) {
          reportSchemaProblem(
            `Error while processing the configuration schema for ${esmName} using ${appConfigSchema}: ${e}. ` +
              `${esmName}'s configuration will not be known until it loads.`,
          );
        }
      }

      // The entrypoint named in the import map is the module's executable code; if it's missing the module
      // simply won't load in the browser, so validate it exists before we commit it to the import map.
      const entrypoint = resolve(args.target, dirName, fileName);
      if (!existsSync(entrypoint)) {
        reportMissingEntrypoint(
          `Code entrypoint ${entrypoint} for ${esmName} does not exist. This is the file referenced from the import map, so ${esmName} would fail to load.`,
        );
      }

      importmap.imports[esmName] = `${publicUrl}/${dirName}/${fileName}`;
      versionManifest.frontendModules[esmName] = version;
    }),
  );

  // Extension names are one global namespace, so two frontend modules can each define a schema for
  // the same name. The first owner in configuration order wins, which is stable: adding a module
  // never changes how an existing one is configured. Explicit conflict resolution is a separate
  // concern. Deliberately not the order of `routes`, which is filled in by a `Promise.all` and so
  // varies between runs.
  const extensionSchemaOwners: Record<string, string> = Object.create(null);

  for (const esmName of Object.keys(frontendModules)) {
    const schema = configSchemas[esmName];

    if (!schema || !routes.hasOwnProperty(esmName)) {
      continue;
    }

    if (schema.configurationSchema !== undefined) {
      if (isSchemaObject(schema.configurationSchema)) {
        routes[esmName]['configurationSchema'] = schema.configurationSchema;
      } else {
        // Left out rather than copied through. The framework validates the shape of a registry
        // entry as a whole, so a schema it rejects would cost this module its pages and extensions
        // too, and a schema we cannot read is only supposed to cost it its static configuration.
        reportSchemaProblem(
          `The configuration schema shipped by ${esmName} is not an object, so it was left out of the routes ` +
            `registry. ${esmName}'s configuration will not be known until it loads.`,
        );
      }
    }

    if (schema.extensionConfigurationSchemas !== undefined && !isSchemaObject(schema.extensionConfigurationSchemas)) {
      reportSchemaProblem(
        `The extension configuration schemas shipped by ${esmName} are not an object, so none of them were ` +
          `added to the routes registry. Those extensions will not be configured until ${esmName} loads.`,
      );
    }

    const extensionSchemas = isSchemaObject(schema.extensionConfigurationSchemas)
      ? schema.extensionConfigurationSchemas
      : {};
    const accepted: Record<string, unknown> = Object.create(null);

    for (const extensionName of Object.keys(extensionSchemas)) {
      const owner = extensionSchemaOwners[extensionName];

      if (owner) {
        reportSchemaProblem(
          `The configuration schema ${esmName} defines for extension '${extensionName}' was ignored, because ` +
            `${owner} already defines one for that name. If two frontend modules define extensions with the same ` +
            `name, one of them will be configured with the other's schema.`,
        );
        continue;
      }

      if (!isSchemaObject(extensionSchemas[extensionName])) {
        reportSchemaProblem(
          `The configuration schema ${esmName} defines for extension '${extensionName}' is not an object, so it ` +
            `was left out of the routes registry.`,
        );
        continue;
      }

      extensionSchemaOwners[extensionName] = esmName;
      accepted[extensionName] = extensionSchemas[extensionName];
    }

    if (Object.keys(accepted).length > 0) {
      routes[esmName]['extensionConfigurationSchemas'] = accepted;
    }
  }

  // Both kinds are reported together, and after the schemas have been merged, so that one run
  // names everything that has to be fixed. Failing on entrypoints first would hide every schema
  // problem behind a second run.
  if (entrypointErrors.length > 0 || schemaErrors.length > 0) {
    const reasons = [
      entrypointErrors.length > 0 &&
        `The following entrypoints could not be found or their routes could not be processed. Pass ` +
          `--no-ensure-entrypoints to downgrade these to warnings.\n\n${entrypointErrors.join('\n\n')}`,
      schemaErrors.length > 0 &&
        `The following configuration schemas could not be processed. Pass --no-strict-schemas to ` +
          `downgrade these to warnings.\n\n${schemaErrors.join('\n\n')}`,
    ].filter(Boolean);

    throw new Error(`Assemble failed.\n\n${reasons.join('\n\n')}`);
  }

  await writeFile(
    resolve(args.target, `importmap${args.hashFiles ? '.' + contentHash(importmap) : ''}.json`),
    JSON.stringify(importmap),
    'utf8',
  );

  if (args.buildRoutes) {
    const applicationVersion = args.applicationVersion;
    const routesRegistry = {
      ...(applicationVersion === undefined || applicationVersion === null || applicationVersion.trim().length === 0
        ? {}
        : { version: applicationVersion }),
      routes,
    };
    await writeFile(
      resolve(args.target, `routes.registry${args.hashFiles ? '.' + contentHash(routesRegistry) : ''}.json`),
      JSON.stringify(routesRegistry),
      'utf-8',
    );
  }

  if (args.configFiles && args.configFiles.length > 0) {
    const assembledConfig = args.configFiles.reduce((merged, file) => {
      try {
        const config = JSON.parse(readFileSync(file, 'utf8'));
        return merge(merged, config);
      } catch (e) {
        logWarn(`Error while processing config file ${file}: ${e}`);
      }

      return merged;
    }, {});

    await writeFile(
      resolve(args.target, `openmrs-config${args.hashFiles ? '.' + contentHash(assembledConfig) : ''}.json`),
      JSON.stringify(assembledConfig),
      'utf8',
    );
  }

  if (args.manifest) {
    await writeFile(resolve(args.target, 'spa-assemble-config.json'), JSON.stringify(versionManifest), 'utf8');
  }

  logInfo(`Finished assembling frontend distribution`);
}
