import {
  rspack,
  type Configuration as RspackConfiguration,
  type DevServer as RspackDevServerConfiguration,
} from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';
import { dirname } from 'node:path';
import webpack, { type Configuration as WebpackConfiguration } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { logInfo } from './logger';

function getWebpackEnv() {
  return {
    ...process.env,
    analyze: process.env.BUNDLE_ANALYZE === 'true',
    production: process.env.NODE_ENV === 'production',
    development: process.env.NODE_ENV === 'development',
  };
}

function loadConfig(configPath: string): WebpackConfiguration | RspackConfiguration {
  const content:
    | WebpackConfiguration
    | RspackConfiguration
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    | ((env: Record<string, unknown>) => WebpackConfiguration | RspackConfiguration) = require(configPath);
  if (typeof content === 'function') {
    return content(getWebpackEnv());
  }
  return content;
}

function startDevServer(configPath: string, port: number, useRspack: boolean = false) {
  const config = loadConfig(configPath);

  const devServerOptions = {
    ...config.devServer,
    port,
    static: dirname(configPath),
  };

  let server: WebpackDevServer | RspackDevServer;
  if (!useRspack) {
    const compiler = webpack(config as WebpackConfiguration);

    server = new WebpackDevServer(devServerOptions as WebpackDevServer.Configuration, compiler);
  } else {
    const compiler = rspack(config as RspackConfiguration);

    server = new RspackDevServer(devServerOptions as RspackDevServerConfiguration, compiler);
  }

  server.startCallback(() => {
    logInfo(`Listening at http://localhost:${port}`);
  });
}

process.on('message', ({ source, port, useRspack }: { source: string; port: number; useRspack: boolean }) =>
  startDevServer(source, port, useRspack),
);
