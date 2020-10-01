/* eslint-disable no-console */

export interface DebugArgs {
  port: number;
}

export function runDebug(args: DebugArgs) {
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const config = require("@openmrs/esm-app-shell/webpack.config.js");
  const port = args.port;

  console.log(`[OpenMRS] Starting the dev server ...`);

  const options = {
    ...config.devServer,
    publicPath: config.output.publicPath,
    stats: { colors: true },
  };

  const server = new WebpackDevServer(webpack(config), options);

  server.listen(port, "localhost", function (err) {
    if (err) {
      console.warn(`[OpenMRS] Error: ${err}`);
    }

    console.log(`[OpenMRS] Listening at http://localhost:${port}`);
  });
}
