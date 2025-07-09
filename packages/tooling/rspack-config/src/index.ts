/**
 * This is the base webpack config for all OpenMRS 3.x modules.
 *
 * ## Usage
 *
 * You can use it as simply as
 *
 * ```ts
 * module.exports = require('openmrs/default-webpack-config');
 * ```
 *
 * or you can customize the configuration using merges and overrides
 * like
 *
 * ```ts
 * const config = require('openmrs/default-webpack-config');
 * config.cssRuleConfig.rules = [myCustomRule];
 * module.exports = config;
 * ```
 *
 * ## Development
 *
 * Advice for working on this file:
 *
 * Don't use `yarn link` or symlinks to work on it.
 *
 * After you `yarn build --watch`, do something like
 * `watch "cp -R dist /path/to/packages/esm-patient-chart-app/webpack"`
 * and then change the webpack line from
 * `module.exports = require('openmrs/default-webpack-config');`
 * to
 * `module.exports = require('./webpack');`
 *
 * This is because Webpack has unpredictable behavior when working with
 * symlinked files, **even when using absolute paths**. You read that right.
 * Telling Webpack to use `/a/b/c`? If the Webpack config is symlinked
 * from `/d/e/`, then it *might* in *some cases* try to import `/d/e/c`.
 */
import { existsSync, statSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
// eslint-disable-next-line no-restricted-imports
import { isArray, merge, mergeWith } from 'lodash';
import { inc } from 'semver';
import rspack, {
  container,
  CopyRspackPlugin,
  DefinePlugin,
  type ModuleOptions,
  type RuleSetRule,
  type RspackOptionsNormalized as RspackConfiguration,
} from '@rspack/core';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

type OpenmrsRspackConfig = Omit<Partial<RspackConfiguration>, 'module'> & {
  module: ModuleOptions;
};

const production = 'production';
const { ModuleFederationPlugin } = container;

function getFrameworkVersion() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { version } = require('@openmrs/esm-framework/package.json');
    return `^${version}`;
  } catch {
    return '5.x';
  }
}

function makeIdent(name: string): string {
  if (name.includes('/')) {
    name = name.slice(name.indexOf('/'));
  }
  if (name.endsWith('-app')) {
    name = name.slice(0, -4);
  }
  return name;
}

function mergeFunction(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

function slugify(name: string) {
  return name.replace(/[\/\-@]/g, '_');
}

function fileExistsSync(name: string) {
  return existsSync(name) && statSync(name).isFile();
}

/**
 * This object will be merged into the webpack config.
 * Array values will be concatenated with the existing array.
 * Make sure to modify this object and not reassign it.
 */
export const overrides: Partial<OpenmrsRspackConfig> = {};

/**
 * The keys of this object will override the top-level keys
 * of the webpack config.
 * Make sure to modify this object and not reassign it.
 */
export const additionalConfig: Partial<OpenmrsRspackConfig> = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of JS, JSX, TS, etc. files.
 * Make sure to modify this object and not reassign it.
 */
export const scriptRuleConfig: Partial<RuleSetRule> = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of CSS files.
 * Make sure to modify this object and not reassign it.
 */
export const cssRuleConfig: Partial<RuleSetRule> = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of SCSS files.
 * Make sure to modify this object and not reassign it.
 */
export const scssRuleConfig: Partial<RuleSetRule> = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of static asset files.
 * Make sure to modify this object and not reassign it.
 */
export const assetRuleConfig: Partial<RuleSetRule> = {};

/**
 * This object will be merged into the webpack rule governing
 * the watch options.
 * Make sure to modify this object and not reassign it.
 */
export const watchConfig: Partial<OpenmrsRspackConfig['watchOptions']> = {};

/**
 * This object will be merged with the webpack optimization
 * object.
 * Make sure to modify this object and not reassign it.
 */
export const optimizationConfig: Partial<OpenmrsRspackConfig['optimization']> = {};

export default (env: Record<string, string>, argv: Record<string, string> = {}) => {
  const root = process.cwd();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { name, version, peerDependencies, browser, main, types } = require(resolve(root, 'package.json'));
  // this typing is provably incorrect, but actually works
  const mode = (argv.mode || process.env.NODE_ENV || 'development') as OpenmrsRspackConfig['mode'];
  const filename = basename(browser || main);
  const outDir = dirname(browser || main);
  const srcFile = resolve(root, browser ? main : types);
  const ident = makeIdent(name);
  const frameworkVersion = getFrameworkVersion();
  const routes = resolve(root, 'src', 'routes.json');
  const hasRoutesDefined = fileExistsSync(routes);

  if (!hasRoutesDefined) {
    console.error(
      'This app does not define a routes.json. This file is required for this app to be used by the OpenMRS 3 App Shell.',
    );
    // key-smash error code
    // so this (hopefully) doesn't interfere with Webpack-specific exit codes
    process.exit(9819023573289);
  }

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      modules: {
        localIdentName: `${ident}__[name]__[local]___[hash:base64:5]`,
      },
    },
  };

  const baseConfig: OpenmrsRspackConfig = {
    // The only `entry` in the application is the app shell. Everything else is
    // a Webpack Module Federation "remote." This ensures that there is always
    // only one container context--i.e., if we had an entry point per module,
    // WMF could get confused and not resolve shared dependencies correctly.
    output: {
      publicPath: 'auto',
      path: resolve(root, outDir),
      hashFunction: 'xxhash64',
    },
    module: {
      rules: [
        merge(
          {
            test: /\.m?(js|ts|tsx)$/,
            exclude: /node_modules(?![\/\\]@openmrs)/,
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
              },
            },
          },
          scriptRuleConfig,
        ),
        merge(
          {
            test: /\.css$/,
            use: [require.resolve('style-loader'), cssLoader],
          },
          cssRuleConfig,
        ),
        merge(
          {
            test: /\.s[ac]ss$/i,
            use: [
              require.resolve('style-loader'),
              cssLoader,
              {
                loader: require.resolve('sass-loader'),
                options: {
                  api: 'modern-compiler',
                  implementation: require.resolve('sass-embedded'),
                  sassOptions: { quietDeps: true },
                },
              },
            ],
          },
          scssRuleConfig,
        ),
        merge(
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource',
          },
          assetRuleConfig,
        ),
      ],
    },
    mode,
    devtool: mode === production ? 'hidden-nosources-source-map' : 'source-map',
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      devMiddleware: {
        writeToDisk: true,
      },
      static: [resolve(root, outDir)],
    },
    watchOptions: merge(
      {
        ignored: ['.git', 'test-results'],
      },
      watchConfig,
    ),
    performance: {
      hints: mode === production && 'warning',
    },
    optimization: merge(
      {
        // The defaults for both of these are 30; however, due to the modular nature of
        // the frontend, we want each app to produce substantially
        splitChunks: {
          maxAsyncRequests: 3,
          maxInitialRequests: 1,
        },
        minimizer: [new rspack.SwcJsMinimizerRspackPlugin(), new rspack.LightningCssMinimizerRspackPlugin()],
      },
      optimizationConfig,
    ),
    plugins: [
      new TsCheckerRspackPlugin(),
      new CleanWebpackPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: env && env.analyze ? 'server' : 'disabled',
      }),
      new DefinePlugin({
        'process.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
      }),
      new ModuleFederationPlugin({
        // Look in the `esm-dynamic-loading` framework package for an explanation of how modules
        // get loaded into the application.
        name,
        library: { type: 'var', name: slugify(name) },
        filename,
        exposes: {
          './start': srcFile,
        },
        shared: [...Object.keys(peerDependencies), '@openmrs/esm-framework/src/internal'].reduce((obj, depName) => {
          if (depName === 'swr') {
            // SWR is annoying with Module Federation
            // See: https://github.com/webpack/webpack/issues/16125 and https://github.com/vercel/swr/issues/2356
            obj['swr/'] = {
              requiredVersion: peerDependencies['swr'] ?? false,
              strictVersion: false,
              singleton: true,
              import: 'swr/',
              shareKey: 'swr/',
              shareScope: 'default',
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              version: require('swr/package.json').version,
            };
          } else {
            obj[depName] = {
              requiredVersion: peerDependencies[depName] ?? false,
              strictVersion: false,
              singleton: true,
              import: depName,
              shareKey: depName,
              shareScope: 'default',
            };
          }

          return obj;
        }, {}),
      }),
      hasRoutesDefined &&
        new CopyRspackPlugin({
          patterns: [
            {
              from: routes,
              transform: {
                transformer: (content) =>
                  JSON.stringify(
                    Object.assign({}, JSON.parse(content.toString()), {
                      version: mode === production ? version : inc(version, 'prerelease', 'local'),
                    }),
                  ),
              },
            },
          ],
        }),
      new StatsWriterPlugin({
        filename: `${filename}.buildmanifest.json`,
        stats: {
          all: false,
          chunks: true,
        },
      }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.json'],
      alias: {
        '@openmrs/esm-framework': '@openmrs/esm-framework/src/internal',
        'lodash.debounce': 'lodash-es/debounce',
        'lodash.findlast': 'lodash-es/findLast',
        'lodash.omit': 'lodash-es/omit',
        'lodash.throttle': 'lodash-es/throttle',
      },
    },
    ...overrides,
  };
  return mergeWith(baseConfig, additionalConfig, mergeFunction);
};
