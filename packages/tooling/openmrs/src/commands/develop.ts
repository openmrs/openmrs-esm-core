import { createRequire } from 'node:module';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { basename, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import {
  type ImportmapDeclaration,
  type RoutesDeclaration,
  type WatchedApp,
  logInfo,
  logWarn,
  removeTrailingSlash,
} from '../utils';
import { getAppRoutes } from '../utils/dependencies';

export interface DevelopArgs {
  port: number;
  host: string;
  backend: string;
  open: boolean;
  importmap: ImportmapDeclaration;
  routes: RoutesDeclaration;
  watchedApps: Record<string, WatchedApp>;
  spaPath: string;
  apiUrl: string;
  configUrls: Array<string>;
  configFiles: Array<string>;
  addCookie: string;
  supportOffline: boolean;
}

export async function runDevelop(args: DevelopArgs, signal?: AbortSignal) {
  const {
    backend,
    host,
    port,
    open,
    importmap,
    routes,
    watchedApps,
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

  const require = createRequire(import.meta.url);
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

  const swContent = supportOffline
    ? readFileSync(resolve(source, 'service-worker.js'), 'utf-8').replace(
        /https:\/\/dev3\.openmrs\.org\/openmrs\/spa\//g,
        `${spaPath}`,
      )
    : '';

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
    if (watchedApps && !!Object.keys(watchedApps).length) {
      // Keyed from package to app, but a watcher tells us which path changed, so invert it. A path
      // that does not exist cannot be watched, and an app's configuration schema is only written
      // once it has been built, so the set is settled here rather than when the apps were found.
      const appsByWatchedPath: Record<string, string> = {};

      for (const [appName, app] of Object.entries(watchedApps)) {
        for (const path of app.paths) {
          if (existsSync(path)) {
            appsByWatchedPath[path] = appName;
          }
        }
      }

      logInfo(`Watching routes and configuration schemas for ${Object.keys(watchedApps).join(', ')}`);

      (await import('node-watch')).default(Object.keys(appsByWatchedPath), { delay: 0 }, async (event, name) => {
        if (event === 'update') {
          const updatedApp = appsByWatchedPath[name];
          const app = updatedApp ? watchedApps[updatedApp] : undefined;

          if (app) {
            // Derived afresh from the app's directory rather than from the file that changed. An
            // entry is assembled from the routes and the configuration schema together, so reading
            // back only the one that changed would drop the other.
            const jsonRoutes = JSON.parse(stringifiedRoutes);
            jsonRoutes.routes[updatedApp] = getAppRoutes(app.sourceDirectory, app.project);
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

  // Escape the spaPath so it can be safely used in a regex
  const escapedSpaPath = spaPath.replace(/[|\\{}()[\]^$+*?.]/g, String.raw`\$&`).replace(/-/g, String.raw`\x2d`);

  // Return our custom `index.html` for all requests beginning with spaPath
  // and not ending in `.js`, `.woff`, `.woff2`, `.json`, or any two- or three-character
  // extension.
  const indexHtmlPathMatcher = new RegExp(String.raw`${escapedSpaPath}\/(?!.*\.(js|woff2?|json|.{2,3}$)).*$`);

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

  const server = app.listen(port, host, () => {
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

  signal?.addEventListener('abort', () => server.close());

  // Keep the promise pending so the runner process doesn't exit
  return new Promise<void>(() => {});
}
