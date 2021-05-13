import express from "express";
import proxy from "http-proxy-middleware";
import { resolve } from "path";
import { readFileSync } from "fs";
import {
  ImportmapDeclaration,
  logInfo,
  logWarn,
  removeTrailingSlash,
} from "../utils";

/* eslint-disable no-console */

export interface DevelopArgs {
  port: number;
  host: string;
  backend: string;
  open: boolean;
  importmap: ImportmapDeclaration;
  spaPath: string;
  apiUrl: string;
  configUrls: Array<string>;
}

export function runDevelop(args: DevelopArgs) {
  const { backend, host, port, open, importmap, configUrls } = args;
  const apiUrl = removeTrailingSlash(args.apiUrl);
  const spaPath = removeTrailingSlash(args.spaPath);
  const app = express();
  const source = resolve(
    require.resolve("@openmrs/esm-app-shell/package.json"),
    "..",
    "lib"
  );
  const index = resolve(source, "index.html");
  const indexContent = readFileSync(index, "utf8").replace(
    `<script>.*</script>`,
    `
    <script>
        initializeSpa({
        apiUrl: ${JSON.stringify(apiUrl)},
        spaPath: ${JSON.stringify(spaPath)},
        env: "development",
        configUrls: ${JSON.stringify(configUrls)},
        });
    </script>
  `
  );
  const pageUrl = `http://${host}:${port}${spaPath}/`;

  app.get(`${spaPath}/importmap.json`, (_, res) => {
    if (importmap.type === "inline") {
      res.contentType("application/json").send(importmap.value);
    } else {
      res.redirect(importmap.value);
    }
  });
  app.use(spaPath, express.static(source));
  app.use(
    apiUrl,
    proxy([`${apiUrl}/**`, `!${spaPath}/**`], {
      target: backend,
      changeOrigin: true,
    })
  );
  app.get("/*", (_, res) => res.contentType("text/html").send(indexContent));

  app.listen(port, host, () => {
    logInfo(`Listening at http://${host}:${port}`);
    logInfo(`SPA available at ${pageUrl}`);

    if (open) {
      const open = require("open");

      open(pageUrl, { wait: false }).catch(() => {
        logWarn(
          `Unable to open "${pageUrl}" in browser. If you are running in a headless environment, please do not use the --open flag.`
        );
      });
    }
  });

  return new Promise(() => {});
}
