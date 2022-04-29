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
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const config = loadConfig(configPath);

  const options = {
    ...config.devServer,
    port,
  };

  const server = new WebpackDevServer(webpack(config), options);

  server.listen(port, "localhost", (err?: Error) => {
    if (err) {
      logWarn(`Error: ${err}`);
    } else {
      logInfo(`Listening at http://localhost:${port}`);
    }
  });
}

process.on("message", ({ source, port }) => debug(source, port));
