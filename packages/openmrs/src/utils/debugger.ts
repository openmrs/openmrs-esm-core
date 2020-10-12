import { dirname } from "path";
import { logInfo, logWarn } from "./logger";

function debug(configPath: string, port: number) {
  const webpack = require("webpack");
  const WebpackDevServer = require("webpack-dev-server");
  const config = require(configPath);

  const options = {
    ...config.devServer,
    port,
    contentBase: dirname(configPath),
    stats: { colors: true },
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
