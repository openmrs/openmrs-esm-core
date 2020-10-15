import { ImportmapDeclaration, loadConfig, logInfo, logWarn } from "../utils";

export interface DebugArgs {
  port: number;
  backend: string;
  importmap: ImportmapDeclaration;
  spaPath: string;
  apiUrl: string;
}

export function runDebug(args: DebugArgs) {
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");

  const config = loadConfig({
    importmap: args.importmap,
    backend: args.backend,
    apiUrl: args.apiUrl,
    spaPath: args.spaPath,
    env: "development",
  });

  logInfo(`Starting the dev server ...`);

  const options = {
    ...config.devServer,
    port: args.port,
    publicPath: config.output.publicPath,
    stats: { colors: true },
  };

  const server = new WebpackDevServer(webpack(config), options);
  const port = args.port;

  server.listen(port, "localhost", (err?: Error) => {
    if (err) {
      logWarn(`Error: ${err}`);
    } else {
      logInfo(`Listening at http://localhost:${port}`);
    }
  });

  return new Promise(() => {});
}
