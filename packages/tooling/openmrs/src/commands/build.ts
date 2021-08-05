import { existsSync, readFileSync } from "fs";
import { getImportmap, loadWebpackConfig, logInfo } from "../utils";
import rimraf from "rimraf";

/* eslint-disable no-console */

export interface BuildArgs {
  target: string;
  importmap: string;
  spaPath: string;
  fresh?: boolean;
  apiUrl: string;
  pageTitle: string;
  supportOffline?: boolean;
  configUrls: Array<string>;
  buildConfig?: string;
}

export interface BuildConfig {
  apiUrl: string;
  configUrls: Array<string>;
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

export async function runBuild(args: BuildArgs) {
  const webpack = require("webpack");
  const buildConfig = loadBuildConfig(args.buildConfig);
  const config = loadWebpackConfig({
    importmap: await getImportmap(buildConfig.importmap || args.importmap),
    env: "production",
    apiUrl: buildConfig.apiUrl || args.apiUrl,
    configUrls: buildConfig.configUrls || args.configUrls,
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

        logInfo(`Build finished.`);
        resolve();
      }
    });
  });
}
