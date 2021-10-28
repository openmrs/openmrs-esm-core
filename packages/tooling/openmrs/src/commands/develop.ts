import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
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
  const indexContent = readFileSync(index, "utf8")
    .replace(
      RegExp("<script>[\\s\\S]+</script>"),
      `
    <script>
        initializeSpa({
          apiUrl: ${JSON.stringify(apiUrl)},
          spaPath: ${JSON.stringify(spaPath)},
          env: "development",
          offline: true,
          configUrls: ${JSON.stringify(configUrls)},
        });
    </script>
  `
    )
    .replace(/href="\/openmrs\/spa/g, `href="${spaPath}`)
    .replace(/src="\/openmrs\/spa/g, `src="${spaPath}`);

  const pageUrl = `http://${host}:${port}${spaPath}/`;

  // Always intercept importmap.json
  app.get(`${spaPath}/importmap.json`, (_, res) => {
    if (importmap.type === "inline") {
      res.contentType("application/json").send(importmap.value);
    } else {
      res.redirect(importmap.value);
    }
  });

  // Return static assets for any request for which we have one, except importmap.json
  app.use(spaPath, express.static(source, { index: false }));

  // If it's not importmap.json and there's no appropriate static asset, then
  // return our custom `index.html` for all requests beginning with spaPath
  // and not ending in `.js` or `.woff` or `.woff2`.
  app.get(new RegExp(`^${spaPath}/(?!.*\.js$)(?!.*\.woff2?).*$`), (_, res) =>
    res.contentType("text/html").send(indexContent)
  );

  // For all other requests beginning with `apiUrl`, proxy to the backend.
  app.use(
    apiUrl,
    createProxyMiddleware(`${apiUrl}/*`, {
      target: backend,
      changeOrigin: true,
    })
  );

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
