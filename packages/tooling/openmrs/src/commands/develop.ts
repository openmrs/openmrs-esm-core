import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { basename, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { type ImportmapDeclaration, type RoutesDeclaration, logInfo, logWarn, removeTrailingSlash } from '../utils';

/* eslint-disable no-console */

export interface DevelopArgs {
  port: number;
  host: string;
  backend: string;
  open: boolean;
  importmap: ImportmapDeclaration;
  routes: RoutesDeclaration;
  watchedRoutesPaths: Record<string, string>;
  spaPath: string;
  apiUrl: string;
  configUrls: Array<string>;
  configFiles: Array<string>;
  addCookie: string;
  supportOffline: boolean;
}

export async function runDevelop(args: DevelopArgs) {
  const {
    backend,
    host,
    port,
    open,
    importmap,
    routes,
    watchedRoutesPaths,
    configUrls,
    configFiles,
    addCookie,
    supportOffline,
  } = args;
  const apiUrl = removeTrailingSlash(args.apiUrl);
  const spaPath = removeTrailingSlash(args.spaPath);
  const app = express();

  const localConfigUrlPrefix = '__local_config__';
  const localConfigUrls = configFiles.map((path) => `${spaPath}/${localConfigUrlPrefix}/${basename(path)}`);

  const source = resolve(require.resolve('@openmrs/esm-app-shell/package.json'), '..', 'dist');
  const index = resolve(source, 'index.html');
  const indexContent = readFileSync(index, 'utf8')
    .replace(
      /<script>initializeSpa\([\s\S\n]*<\/script>/m,
      `<script>
      initializeSpa({
        apiUrl: ${JSON.stringify(apiUrl)},
        spaPath: ${JSON.stringify(spaPath)},
        env: "development",
        offline: ${supportOffline},
        configUrls: ${JSON.stringify([...configUrls, ...localConfigUrls])},
      });
    </script>
  `,
    )
    .replace(/href="\/openmrs\/spa/g, `href="${spaPath}`)
    .replace(/src="\/openmrs\/spa/g, `src="${spaPath}`)
    .replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa\/importmap\.json/g, `${spaPath}/importmap.json`);

  const sw = resolve(source, 'service-worker.js');
  // remove any full references to dev3.openmrs.org
  const swContent = readFileSync(sw, 'utf-8').replace(/https:\/\/dev3\.openmrs\.org\/openmrs\/spa\//g, `${spaPath}`);

  const pageUrl = `http://${host}:${port}${spaPath}`;

  // Set up routes. Note that different middlewares have different rules
  // about route precedence.
  //
  // HPM/createProxyMiddleware always takes top precedence, so we must
  // explicitly exclude routes that we want to use other handlers for.
  //
  // express.static respects normal route declaration order.

  // Route for custom `importmap.json` goes above static assets
  if (importmap.type === 'inline') {
    app.get(`${spaPath}/importmap.json`, (_, res) => {
      res.contentType('application/json').send(importmap.value);
    });
  }

  if (routes.type === 'inline') {
    let stringifiedRoutes = routes.value;
    if (watchedRoutesPaths && !!Object.keys(watchedRoutesPaths).length) {
      // watchedRoutesPath is keyed from package to path, but here we need to go from
      // path to package.
      const watchedRoutesByPath = Object.fromEntries(Object.entries(watchedRoutesPaths).map(([k, v]) => [v, k]));

      logInfo(`Watching routes.json for ${Object.keys(watchedRoutesPaths).join(', ')}`);
      // setup watchers for all the discovered routes.json files which update the in-memory map
      (await import('node-watch')).default(Object.keys(watchedRoutesByPath), { delay: 0 }, async (event, name) => {
        if (event === 'update') {
          const updatedApp = watchedRoutesByPath[name];
          if (updatedApp) {
            const jsonRoutes = JSON.parse(stringifiedRoutes);
            const version = jsonRoutes[updatedApp]?.version;
            jsonRoutes[updatedApp] = {
              ...JSON.parse(await readFile(name, 'utf8')),
              version,
            };
            stringifiedRoutes = JSON.stringify(jsonRoutes);
            logInfo(`Updated routes for ${updatedApp}`);
          }
        }
      });
    }

    app.get(`${spaPath}/routes.registry.json`, (_, res) => {
      res.contentType('application/json').send(stringifiedRoutes);
    });
  }

  // Route for custom `service-worker.js` before most things
  if (supportOffline) {
    app.get(`${spaPath}/service-worker.js`, (_, res) => {
      res.contentType('js').send(swContent);
    });
  }

  configFiles.forEach((file, i) => {
    const url = localConfigUrls[i];
    app.get(url, (_, res) => {
      res.contentType('application/json').send(readFileSync(resolve(process.cwd(), file)));
    });
  });

  // Return our custom `index.html` for all requests beginning with spaPath
  // and not ending in `.js`, `.woff`, `.woff2`, `.json`, or any two- or three-character
  // extension.
  const indexHtmlPathMatcher = /\/openmrs\/spa\/(?!.*\.(js|woff2?|json|.{2,3}$)).*$/;

  // Route for custom `index.html` goes above static assets
  app.get(indexHtmlPathMatcher, (_, res) => res.contentType('text/html').send(indexContent));

  // Return static assets for any request for which we have one, except importmap.json and index.html
  app.use(spaPath, express.static(source, { index: false }));

  // Proxy requests beginning with `apiUrl` but which should not serve `index.html`.
  // This may include the JS bundles when using an import map that refers to
  // JS bundles located at the same domain as `apiUrl`.
  app.use(
    apiUrl,
    createProxyMiddleware(
      (path) => {
        return new RegExp(`${apiUrl}/.*`).test(path) && !indexHtmlPathMatcher.test(path);
      },
      {
        target: backend,
        changeOrigin: true,
        onProxyReq(proxyReq) {
          if (addCookie) {
            const origCookie = proxyReq.getHeader('cookie');
            const newCookie = `${origCookie};${addCookie}`;
            proxyReq.setHeader('cookie', newCookie);
          }
        },
      },
    ),
  );

  app.listen(port, host, () => {
    logInfo(`Listening at http://${host}:${port}`);
    logInfo(`SPA available at ${pageUrl}`);

    if (open) {
      import('open').then(({ default: open }) => {
        setTimeout(
          () =>
            open(pageUrl, { wait: false }).catch(() => {
              logWarn(
                `Unable to open "${pageUrl}" in browser. If you are running in a headless environment, please do not use the --open flag.`,
              );
            }),
          2000,
        );
      });
    }
  });

  return new Promise<void>(() => {});
}
