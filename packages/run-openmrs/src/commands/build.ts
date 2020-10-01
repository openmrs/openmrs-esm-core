import { resolve } from "path";

/* eslint-disable no-console */

export interface BuildArgs {
  target: string;
}

export function runBuild(args: BuildArgs) {
  const webpack = require("webpack");
  const config = require("@openmrs/esm-app-shell/webpack.config.js");
  const target = resolve(process.cwd(), args.target);

  console.log(`[OpenMRS] Running build process ...`);

  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      path: target,
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
