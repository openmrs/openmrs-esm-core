import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "fs";
import { getImportmap, loadWebpackConfig, logInfo } from "../utils";
import rimraf from "rimraf";
import { basename, join, parse, resolve } from "path";

/* eslint-disable no-console */

export interface BuildArgs {
  target: string;
  registry: string;
  importmap: string;
  spaPath: string;
  fresh?: boolean;
  apiUrl: string;
  pageTitle: string;
  supportOffline?: boolean;
  configUrls: Array<string>;
  configPaths: Array<string>;
  buildConfig?: string;
}

export interface BuildConfig {
  apiUrl: string;
  configUrls: Array<string>;
  configPaths: Array<string>;
  pageTitle: string;
  supportOffline?: boolean;
  importmap: string;
  spaPath: string;
}

function loadBuildConfig(buildConfigPath?: string): BuildConfig {
  if (buildConfigPath) {
    return JSON.parse(readFileSync(buildConfigPath, "utf8"));
  } else {
    return {} as BuildConfig;
  }
}

function addConfigFilesFromPaths(
  configPaths: Array<string>,
  targetDir: string
) {
  for (let configPath of configPaths) {
    const realPath = resolve(configPath);
    copyFileSync(realPath, join(targetDir, basename(configPath)));
  }
}

export async function runBuild(args: BuildArgs) {
  const webpack = require("webpack");
  const buildConfig = loadBuildConfig(args.buildConfig);
  const configUrls = buildConfig.configUrls || args.configUrls;
  for (let configPath of buildConfig.configPaths || args.configPaths) {
    configUrls.push(basename(configPath));
  }

  const importMap = await getImportmap(buildConfig.importmap || args.importmap);
  // if we're supplying a URL importmap and the dist folder exists and the raw importmap file doesn't exist
  // we use the nearest thing. Basically, this is added to support the --hash-importmap assemble option.
  if (importMap.type === "url") {
    if (
      !/^https?:\/\//.test(importMap.value) &&
      existsSync(args.target) &&
      !existsSync(resolve(args.target, importMap.value))
    ) {
      const { name: fileName, ext: extension } = parse(importMap.value);
      const paths = readdirSync(args.target).filter(
        (entry) =>
          entry.startsWith(fileName) &&
          entry.endsWith(extension) &&
          statSync(resolve(args.target, entry)).isFile()
      );
      if (paths) {
        importMap.value = paths[0];
      }
    }
  }
  const config = loadWebpackConfig({
    importmap: importMap,
    env: "production",
    apiUrl: buildConfig.apiUrl || args.apiUrl,
    configUrls: configUrls,
    pageTitle: buildConfig.pageTitle || args.pageTitle,
    supportOffline: buildConfig.supportOffline ?? args.supportOffline,
    spaPath: buildConfig.spaPath || args.spaPath,
  });

  logInfo(`Running build process ...`);

  if (args.fresh && existsSync(args.target)) {
    await new Promise((resolve) => rimraf(args.target, resolve));
  }

  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      path: args.target,
    },
  });

  return await new Promise<void>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(
          stats.toString({
            colors: true,
          })
        );

        addConfigFilesFromPaths(
          buildConfig.configPaths || args.configPaths,
          args.target
        );

        logInfo(`Build finished.`);
        resolve();
      }
    });
  });
}
