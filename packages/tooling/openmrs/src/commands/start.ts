import { createRequire } from 'node:module';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { resolve } from 'node:path';
import { logInfo, logWarn } from '../utils';

/* eslint-disable no-console */

export interface StartArgs {
  port: number;
  host: string;
  open: boolean;
  backend: string;
  addCookie: string;
}

export function runStart(args: StartArgs, signal?: AbortSignal) {
  const { backend, host, port, open, addCookie } = args;
  const app = express();
  const require = createRequire(import.meta.url);
  const source = resolve(require.resolve('@openmrs/esm-app-shell/package.json'), '..', 'dist');
  const index = resolve(source, 'index.html');
  const spaPath = '/openmrs/spa';
  const pageUrl = `http://${host}:${port}${spaPath}`;

  app.use(spaPath, express.static(source));
  app.use(
    '/openmrs',
    createProxyMiddleware([`/openmrs/**`, `!${spaPath}/**`], {
      target: backend,
      changeOrigin: true,
      onProxyReq(proxyReq) {
        if (addCookie) {
          const origCookie = proxyReq.getHeader('cookie');
          const newCookie = `${origCookie};${addCookie}`;
          proxyReq.setHeader('cookie', newCookie);
        }
      },
    }),
  );
  app.get('/*', (_, res) => res.sendFile(index));

  const server = app.listen(port, host, async () => {
    logInfo(`Listening at http://${host}:${port}`);
    logInfo(`SPA available at ${pageUrl}`);

    if (open) {
      const { default: openUrl } = await import('open');

      openUrl(pageUrl, { wait: false }).catch(() => {
        logWarn(
          `Unable to open "${pageUrl}" in browser. If you are running in a headless environment, please do not use the --open flag.`,
        );
      });
    }
  });

  signal?.addEventListener('abort', () => server.close());

  return new Promise<void>(() => {});
}
