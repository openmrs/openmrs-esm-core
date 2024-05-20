import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { Readable } from 'stream';
import { prompt, type Question } from 'inquirer';
import rimraf from 'rimraf';
import axios from 'axios';
import npmRegistryFetch from 'npm-registry-fetch';
import pacote from 'pacote';
import { contentHash, logInfo, logWarn, untar } from '../utils';
import { getNpmRegistryConfiguration } from '../utils/npmConfig';

/* eslint-disable no-console */

export interface AssembleArgs {
  target: string;
  mode: string;
  config: Array<string>;
  registry?: string;
  hashImportmap: boolean;
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
            typeof exclude === 'string' && config.frontendModules[exclude] && delete config.frontendModules[exclude];
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
        .json('/-/v1/search?text=keywords:openmrs&size=500', fetchOptions)
        .then((res) => res as unknown as NpmSearchResult)
        .then((res) =>
          res.objects
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
            name: pckg.name,
            message: `Include frontend module "${pckg.name}"?`,
            default: false,
            type: 'confirm',
          },
          {
            name: pckg.name,
            askAnswered: true,
            message: `Version for "${pckg.name}"?`,
            default: pckg.version,
            type: 'string',
            when(ans) {
              return ans[pckg.name];
            },
          } as Question,
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
  cacheDir: string,
  esmName: string,
  esmVersion: string,
  baseDir: string,
  fetchOptions: npmRegistryFetch.Options,
): Promise<Buffer> {
  if (!existsSync(cacheDir)) {
    await mkdir(cacheDir, { recursive: true });
  }

  if (esmVersion.startsWith('file:')) {
    const source = resolve(baseDir, esmVersion.substring(5));
    return readFile(source);
  } else if (/^https?:\/\//.test(esmVersion)) {
    const response = await axios.get<Buffer>(esmVersion);
    return response.data;
  } else {
    const packageName = `${esmName}@${esmVersion}`;
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
    coreVersion: require(resolve(__dirname, '..', '..', 'package.json')).version,
    frontendModules: {},
  };

  const routes = {};

  logInfo(`Assembling dependencies and building import map and routes registry...`);

  const { frontendModules = {}, publicUrl = '.' } = config;
  const cacheDir = resolve(process.cwd(), '.cache');

  if (args.fresh && existsSync(args.target)) {
    await new Promise((resolve) => rimraf(args.target, resolve));
  }

  await mkdir(args.target, { recursive: true });

  await Promise.all(
    Object.keys(frontendModules).map(async (esmName) => {
      const esmVersion = frontendModules[esmName];
      const tgzBuffer = await downloadPackage(cacheDir, esmName, esmVersion, process.cwd(), npmConf);

      const baseDirName = `${esmName}`.replace(/^@/, '').replace(/\//, '-');
      const [fileName, version] = await extractFiles(tgzBuffer, resolve(args.target, baseDirName));
      const dirName = `${baseDirName}-${version}`;

      const appRoutes = resolve(args.target, dirName, 'routes.json');
      if (existsSync(appRoutes)) {
        try {
          routes[esmName] = JSON.parse((await readFile(appRoutes)).toString());
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
    resolve(args.target, `importmap${args.hashImportmap ? '.' + contentHash(importmap) : ''}.json`),
    JSON.stringify(importmap),
    'utf8',
  );

  if (args.buildRoutes) {
    await writeFile(
      resolve(args.target, `routes.registry${args.hashImportmap ? '.' + contentHash(routes) : ''}.json`),
      JSON.stringify(routes),
      'utf-8',
    );
  }

  if (args.manifest) {
    await writeFile(resolve(args.target, 'spa-assemble-config.json'), JSON.stringify(versionManifest), 'utf8');
  }

  logInfo(`Finished assembling frontend distribution`);
}
