import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { Readable } from 'node:stream';
import { prompt, type Question } from 'inquirer';
import { rimraf } from 'rimraf';
import axios from 'axios';
import npmRegistryFetch from 'npm-registry-fetch';
import pacote from 'pacote';
import semver from 'semver';
import merge from 'lodash/merge';
import { contentHash, logInfo, logWarn, untar } from '../utils';
import { getNpmRegistryConfiguration } from '../utils/npmConfig';

/* eslint-disable no-console */

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

      const packages = await npmRegistryFetch
        // see https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#get-v1search for what these
        // options mean; in essence, we search for anything with the keyword openmrs that has at least one
        // stable version; quality is down-scored because that metric favours smaller apps over core
        // community assets. Maintenance is boosted to de-score relatively unmaintained apps, as the framework
        // still has a fair bit of churn
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

      const questions: Array<Question> = [];

      for (const pckg of packages) {
        questions.push(
          {
            name: `include:${pckg.name}`,
            message: `Include frontend module "${pckg.name}"?`,
            default: false,
            type: 'confirm',
          },
          {
            name: `version:${pckg.name}`,
            message: `Version for "${pckg.name}"?`,
            default: pckg.version,
            type: 'string',
            when: (ans) => ans[`include:${pckg.name}`],
            validate: (input) => {
              if (typeof input !== 'string') {
                return `Expected a valid SemVer string, got ${typeof input}.`;
              }

              if (!semver.valid(input)) {
                return `${input} does not appear to be a valid semver or version range. See https://semver.npmjs.com/#syntax-examples.`;
              }

              return true;
            },
          },
        );
      }

      const answers = await prompt(questions);

      return {
        publicUrl: '.',
        frontendModules: Object.keys(answers)
          .filter((m) => answers[m])
          .reduce((prev, curr) => {
            prev[curr] = answers[curr];
            return prev;
          }, {}),
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
    const response = await axios.get<Buffer>(esmVersion);
    return response.data;
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

async function extractFiles(buffer: Buffer, targetDir: string): Promise<[string, string]> {
  const packageRoot = 'package';
  const rs = Readable.from(buffer);
  const files = await untar(rs);
  const packageJson = JSON.parse(files[`${packageRoot}/package.json`].toString('utf8'));
  const version = (packageJson.version as string) ?? '0.0.0';
  const entryModule = packageJson.browser ?? packageJson.module ?? packageJson.main;
  const fileName = basename(entryModule);
  const sourceDir = dirname(entryModule);
  let outputDir = `${targetDir}-${version}`;
  await mkdir(outputDir, { recursive: true });

  await Promise.all(
    Object.keys(files)
      .filter((m) => m.startsWith(`${packageRoot}/${sourceDir}`))
      .map(async (m) => {
        const content = files[m];
        const fileName = m.replace(`${packageRoot}/${sourceDir}/`, '');
        const targetFile = resolve(outputDir, fileName);
        await mkdir(dirname(targetFile), { recursive: true });
        await writeFile(targetFile, content);
      }),
  );

  return [fileName, version];
}

export async function runAssemble(args: AssembleArgs) {
  const npmConf = getNpmRegistryConfiguration(args.registry);
  const config = await readConfig(args.mode, args.config, npmConf);

  const importmap = {
    imports: {},
  };

  const versionManifest = {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    coreVersion: require(resolve(__dirname, '..', '..', 'package.json')).version,
    frontendModules: {},
  };

  const routes = {};

  logInfo(`Assembling dependencies and building import map and routes registry...`);

  const { frontendModules = {}, publicUrl = '.' } = config;

  if (args.fresh && existsSync(args.target)) {
    await rimraf(args.target);
  }

  await mkdir(args.target, { recursive: true });

  await Promise.all(
    Object.keys(frontendModules).map(async (esmName) => {
      const esmVersion = frontendModules[esmName];
      const tgzBuffer = await downloadPackage(esmName, esmVersion, process.cwd(), npmConf);

      const baseDirName = `${esmName}`.replace(/^@/, '').replace(/\//, '-');
      const [fileName, version] = await extractFiles(tgzBuffer, resolve(args.target, baseDirName));
      const dirName = `${baseDirName}-${version}`;

      const appRoutes = resolve(args.target, dirName, 'routes.json');
      if (existsSync(appRoutes)) {
        try {
          routes[esmName] = JSON.parse(await readFile(appRoutes, 'utf8'));
          routes[esmName]['version'] = version;
        } catch (e) {
          logWarn(`Error while processing routes for ${esmName} using ${appRoutes}: ${e}`);
        }
      } else {
        logWarn(
          `Routes file ${appRoutes} does not exist. We expect that routes file to be defined by ${esmName}. Note that this means that no pages or extensions for ${esmName} will be available.`,
        );

        if (routes.hasOwnProperty(esmName)) {
          delete routes[esmName];
        }
      }

      importmap.imports[esmName] = `${publicUrl}/${dirName}/${fileName}`;
      versionManifest.frontendModules[esmName] = version;
    }),
  );

  await writeFile(
    resolve(args.target, `importmap${args.hashFiles ? '.' + contentHash(importmap) : ''}.json`),
    JSON.stringify(importmap),
    'utf8',
  );

  if (args.buildRoutes) {
    await writeFile(
      resolve(args.target, `routes.registry${args.hashFiles ? '.' + contentHash(routes) : ''}.json`),
      JSON.stringify(routes),
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
