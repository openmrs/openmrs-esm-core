import express from "express";
import proxy from "http-proxy-middleware";
import { resolve } from "path";
import { logInfo, logWarn } from "../utils";

/* eslint-disable no-console */

export interface StartArgs {
  port: number;
  open: boolean;
  backend: string;
}

export function runStart(args: StartArgs) {
  const app = express();
  const source = resolve(
    require.resolve("@openmrs/esm-app-shell/package.json"),
    "..",
    "dist"
  );
  const index = resolve(source, "index.html");
  const spaPath = "/openmrs/spa";
  const pageUrl = `http://localhost:${args.port}${spaPath}`;

  app.use("/openmrs/spa", express.static(source));
  app.use(
    "/openmrs",
    proxy([`/openmrs/**`, `!${spaPath}/**`], {
      target: args.backend,
      changeOrigin: true,
    })
  );
  app.get("/*", (req, res) => res.sendFile(index));

  app.listen(args.port, () => {
    logInfo(`Listening at http://localhost:${args.port}`);
    logInfo(`SPA available at ${pageUrl}`);

    if (args.open) {
      const open = require("opn");

      open(pageUrl, { wait: false }).catch(() => {
        logWarn(
          `Unable to open "${pageUrl}" in browser. If you are running in a headless environment, please do not use the --open flag.`
        );
      });
    }
  });

  return new Promise(() => {});
}
