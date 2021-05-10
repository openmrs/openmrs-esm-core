import { existsSync } from "fs";
import { ImportmapDeclaration, loadConfig, logInfo } from "../utils";
import rimraf from "rimraf";

/* eslint-disable no-console */

export interface BuildArgs {
  target: string;
  importmap: ImportmapDeclaration;
  spaPath: string;
  fresh: boolean;
  apiUrl: string;
  configUrls: Array<string>;
}

export async function runBuild(args: BuildArgs) {
  const webpack = require("webpack");
  const config = loadConfig({
    importmap: args.importmap,
    env: "production",
    apiUrl: args.apiUrl,
    configUrls: args.configUrls,
    spaPath: args.spaPath,
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
