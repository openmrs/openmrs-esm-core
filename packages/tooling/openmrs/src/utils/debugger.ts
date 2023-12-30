import { dirname } from 'node:path';
import { logInfo } from './logger';
import type { Configuration } from 'webpack';

function getWebpackEnv() {
  return {
    ...process.env,
    analyze: process.env.BUNDLE_ANALYZE === 'true',
    production: process.env.NODE_ENV === 'production',
    development: process.env.NODE_ENV === 'development',
  };
}

function loadConfig(configPath: string) {
  const content: Configuration | ((env: unknown) => Configuration) = require(configPath);
  if (typeof content === 'function') {
    return content(getWebpackEnv());
  }
  return content;
}

function debug(configPath: string, port: number) {
  const Webpack = require('webpack');
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const WebpackDevServer: typeof import('webpack-dev-server') = require('webpack-dev-server');
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

process.on('message', ({ source, port }: { source: string; port: number }) => debug(source, port));
