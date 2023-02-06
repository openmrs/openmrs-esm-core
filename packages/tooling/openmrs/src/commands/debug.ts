import {
  ImportmapDeclaration,
  loadWebpackConfig,
  logInfo,
  logWarn,
} from "../utils";

export interface DebugArgs {
  port: number;
  host: string;
  backend: string;
  importmap: ImportmapDeclaration;
  pageTitle: string;
  supportOffline?: boolean;
  spaPath: string;
  apiUrl: string;
  configUrls: Array<string>;
  addCookie: string;
}

export function runDebug(args: DebugArgs) {
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");

  const config = loadWebpackConfig({
    importmap: args.importmap,
    backend: args.backend,
    apiUrl: args.apiUrl,
    supportOffline: args.supportOffline,
    spaPath: args.spaPath,
    configUrls: args.configUrls,
    addCookie: args.addCookie,
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

  return new Promise<void>(() => {});
}
