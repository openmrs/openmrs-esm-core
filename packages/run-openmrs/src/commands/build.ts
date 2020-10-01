import { ImportmapDeclaration, loadConfig } from "../utils";

/* eslint-disable no-console */

export interface BuildArgs {
  target: string;
  importmap: ImportmapDeclaration;
}

export function runBuild(args: BuildArgs) {
  const webpack = require("webpack");
  const config = loadConfig({
    importmap: args.importmap,
  });

  console.log(`[OpenMRS] Running build process ...`);

  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      path: args.target,
    },
  });

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        stats.toString({
          colors: true,
        })
      );

      console.log(`[OpenMRS] Build finished.`);
    }
  });
}
