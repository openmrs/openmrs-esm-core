import { loadConfig } from "./_utils";

/* eslint-disable no-console */

export interface DebugArgs {
  port: number;
  backend: string;
}

export function runDebug(args: DebugArgs) {
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");

  const config = loadConfig({
    OMRS_PROXY_TARGET: args.backend,
  });

  console.log(`[OpenMRS] Starting the dev server ...`);

  const options = {
    ...config.devServer,
    publicPath: config.output.publicPath,
    stats: { colors: true },
  };

  const server = new WebpackDevServer(webpack(config), options);
  const port = args.port;

  server.listen(port, "localhost", function (err) {
    if (err) {
      console.warn(`[OpenMRS] Error: ${err}`);
    }

    console.log(`[OpenMRS] Listening at http://localhost:${port}`);
  });
}
