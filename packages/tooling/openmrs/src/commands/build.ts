import { copyFileSync, existsSync, readFileSync } from "fs";
import { getImportmap, loadWebpackConfig, logInfo } from "../utils";
import rimraf from "rimraf";
import { basename, join, resolve } from "path";

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

  const config = loadWebpackConfig({
    importmap: await getImportmap(buildConfig.importmap || args.importmap),
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
