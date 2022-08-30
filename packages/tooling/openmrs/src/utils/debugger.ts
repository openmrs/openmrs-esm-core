import { dirname } from "path";
import { logInfo, logWarn } from "./logger";

function getWebpackEnv() {
  return {
    ...process.env,
    analyze: process.env.BUNDLE_ANALYZE === "true",
    production: process.env.NODE_ENV === "production",
    development: process.env.NODE_ENV === "development",
  };
}

function loadConfig(configPath: string) {
  const content = require(configPath);
  if (typeof content === "function") {
    return content(getWebpackEnv());
  }
  return content;
}

function debug(configPath: string, port: number) {
  const Webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const config = loadConfig(configPath);

  const compiler = Webpack(config);
  const devServerOptions = {
    ...config.devServer,
    port,
    static: dirname(configPath),
  };

  const server = new WebpackDevServer(devServerOptions, compiler);

  server.startCallback(() => {
    logInfo(`Listening at http://localhost:${port}`);
  });
}

process.on("message", ({ source, port }) => debug(source, port));
