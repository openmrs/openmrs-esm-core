import { ImportmapDeclaration, loadConfig, logInfo, logWarn } from "../utils";

export interface DebugArgs {
  port: number;
  host: string;
  backend: string;
  importmap: ImportmapDeclaration;
  spaPath: string;
  apiUrl: string;
  configUrls: Array<string>;
}

export function runDebug(args: DebugArgs) {
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");

  const config = loadConfig({
    importmap: args.importmap,
    backend: args.backend,
    apiUrl: args.apiUrl,
    spaPath: args.spaPath,
    configUrls: args.configUrls,
    env: "development",
  });

  logInfo(`Starting the dev server ...`);

  const { host, port } = args;
  const options = {
    ...config.devServer,
    port,
    host,
    publicPath: args.spaPath,
    stats: { colors: true },
  };

  const server = new WebpackDevServer(webpack(config), options);

  server.listen(port, host, (err?: Error) => {
    if (err) {
      logWarn(`Error: ${err}`);
    } else {
      logInfo(`Listening at http://${host}:${port}`);
    }
  });

  return new Promise(() => {});
}
