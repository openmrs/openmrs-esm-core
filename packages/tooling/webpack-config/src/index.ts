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
import browserslist from 'browserslist';
import { loadQueries } from 'browserslist/node';
import defaultBrowserslistQueries from 'browserslist-config-openmrs';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { browserslistToTargets, type Targets } from 'lightningcss';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// eslint-disable-next-line no-restricted-imports
import { isArray, merge, mergeWith } from 'lodash';
import { inc, parse } from 'semver';
import { ModuleFederationPlugin } from '@module-federation/enhanced/webpack';
import { CarbonCssGuardPlugin } from '@openmrs/carbon-css-guard';
import {
  BannerPlugin,
  DefinePlugin,
  ExternalsPlugin,
  type ModuleOptions,
  type RuleSetRule,
  type WebpackOptionsNormalized as WebpackConfiguration,
} from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

type OpenmrsWebpackConfig = Omit<Partial<WebpackConfiguration>, 'module' | 'output'> & {
  module: ModuleOptions;
  output: Partial<WebpackConfiguration['output']>;
};

const production = 'production';

// Read from our own pin rather than `@module-federation/enhanced/package.json`, which its `exports` map
// makes unreadable. `parse` rather than `coerce`, so that loosening the pin to a range disables the skew
// warning instead of misreporting it: `coerce` turns `2.x` and `^2` into 2.0, which would warn forever.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const moduleFederationPin: string = require('../package.json').dependencies['@module-federation/enhanced'];
const moduleFederationVersion = parse(moduleFederationPin);

/**
 * Prepended to this app's entry chunks. Without it, an app running under an app shell too old to
 * publish the runtime globals fails with a `TypeError` from inside minified runtime code. All three
 * globals are checked because `_OPENMRS_FEDERATION_ERROR_CODES` is what describes the failure, and a runtime
 * minor differing from the app shell's warns. `@openmrs/rspack-config` has a copy of this; keep them in step.
 */
function buildFederationRuntimeGuard(appName: string, expectedMinor: string | undefined) {
  const missingRuntime =
    "(function(){var g=typeof globalThis!=='undefined'?globalThis:self;" +
    "if(typeof g._FEDERATION_RUNTIME_CORE==='undefined'||typeof g._OPENMRS_FEDERATION_SDK==='undefined'||typeof g._OPENMRS_FEDERATION_ERROR_CODES==='undefined'){" +
    'throw new Error(' +
    JSON.stringify(appName) +
    " + ' cannot start: the OpenMRS app shell serving this page does not provide the Module Federation runtime. " +
    'This app was built with newer OpenMRS tooling than the app shell, so either upgrade @openmrs/esm-app-shell, ' +
    "or rebuild this app with tooling matching the app shell.');}";

  // Skipped rather than always warning if the pin couldn't be coerced to a version.
  const skew = expectedMinor
    ? 'var from=g._FEDERATION_RUNTIME_CORE_FROM;' +
      'if(from&&from.version&&String(from.version).split(".").slice(0,2).join(".")!==' +
      JSON.stringify(expectedMinor) +
      '){console.warn(' +
      JSON.stringify(appName) +
      " + ' was built against Module Federation " +
      expectedMinor +
      ".x but the app shell provides ' + from.version + '. Shared dependencies may not de-duplicate correctly.');}"
    : '';

  return missingRuntime + skew + '})();';
}

function getFrameworkVersion() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { version } = require('@openmrs/esm-framework/package.json');
    return `^${version}`;
  } catch {
    return '5.x';
  }
}

/**
 * The browserslist queries this module's output is compiled and minified against, falling back to
 * OpenMRS's shared config when the module declares none, so that frontend RFC 0003 stays the single
 * source of truth. Without any of this swc down-levels to ES5, and every supported browser pays for
 * transform helpers it doesn't need.
 *
 * Queries rather than resolved versions, and `extends` expanded here rather than left to the consumer,
 * because these are resolved by Rust ports of browserslist — swc's, and rspack's Lightning CSS — which
 * do not implement `extends` and reject version numbers newer than the browser data they bundle. swc
 * aborts the process rather than reporting an error when a query defeats it.
 *
 * @param root The directory of the module being built
 */
function browserslistQueries(root: string): Array<string> {
  const loaded = browserslist.loadConfig({ path: root });
  const configured = loaded === undefined ? [] : Array.isArray(loaded) ? loaded : [loaded];

  return expandBrowserslistExtends(configured.length > 0 ? configured : defaultBrowserslistQueries, root);
}

function expandBrowserslistExtends(queries: Array<string>, root: string, seen = new Set<string>()): Array<string> {
  return queries.flatMap((query) => {
    const extended = /^extends\s+(\S+)$/.exec(query.trim());

    if (!extended || seen.has(extended[1])) {
      return extended ? [] : [query];
    }

    seen.add(extended[1]);

    try {
      // Resolved from the module being built, so that it picks up that module's own shared config. A
      // config naming a further `extends` recurses, which is what `seen` keeps from looping.
      const resolved = loadQueries({ path: root }, extended[1]);

      return expandBrowserslistExtends(Array.isArray(resolved) ? resolved : [resolved], root, seen);
    } catch {
      // A config that can't be loaded shouldn't take the whole build — or the dev server — down over
      // which browsers it targets. Fall back to the default queries and say so.
      console.warn(
        `Could not load the browserslist config "${extended[1]}". Targeting ${defaultBrowserslistQueries.join(
          ', ',
        )} instead.`,
      );

      return defaultBrowserslistQueries;
    }
  });
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
export const overrides: Partial<OpenmrsWebpackConfig> = {};

/**
 * The keys of this object will override the top-level keys
 * of the webpack config.
 * Make sure to modify this object and not reassign it.
 */
export const additionalConfig: Partial<OpenmrsWebpackConfig> = {};

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
export const watchConfig: Partial<WebpackConfiguration['watchOptions']> = {};

/**
 * This object will be merged with the webpack optimization
 * object.
 * Make sure to modify this object and not reassign it.
 *
 * Arrays here merge by index rather than replacing, so a `minimizer` set on this object lands on top of
 * the defaults entry by entry instead of taking their place. Use `overrides.optimization` to replace
 * them outright.
 */
export const optimizationConfig: Partial<WebpackConfiguration['optimization']> = {};

export default (env: Record<string, string>, argv: Record<string, string> = {}) => {
  const root = process.cwd();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { name, version, peerDependencies, browser, main, types } = require(resolve(root, 'package.json'));
  // this typing is provably incorrect, but actually works
  const mode = (argv.mode || process.env.NODE_ENV || 'development') as WebpackConfiguration['mode'];
  const isProd = mode === production;
  const filename = basename(browser || main);
  const outDir = dirname(browser || main);
  const srcFile = resolve(root, browser ? main : types);
  const ident = makeIdent(name);
  const browserTargets = browserslistQueries(root);
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

  // These are factories rather than shared objects because `cssRuleConfig` and `scssRuleConfig` are
  // merged into the rules with lodash `merge`, which mutates: one shared entry would let an override
  // aimed at the CSS rule silently leak into the SCSS rule as well.
  const cssLoader = () => ({
    loader: require.resolve('css-loader'),
    options: {
      modules: {
        localIdentName: `${ident}__[name]__[local]___[hash:base64:5]`,
      },
    },
  });

  // Production emits real `.css` assets; development keeps `style-loader` for its better HMR story.
  // See RFC 0033. The chunk-loading runtime resolves a chunk only once its stylesheet has loaded,
  // so nothing mounts unstyled.
  const styleLoader = () =>
    isProd ? { loader: require.resolve(MiniCssExtractPlugin.loader) } : { loader: require.resolve('style-loader') };

  const baseConfig: OpenmrsWebpackConfig = {
    // The only `entry` in the application is the app shell. Everything else is
    // a Webpack Module Federation "remote." This ensures that there is always
    // only one container context--i.e., if we had an entry point per module,
    // WMF could get confused and not resolve shared dependencies correctly.
    entry: {},
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
            exclude: /node_modules/,
            use: require.resolve('swc-loader'),
          },
          scriptRuleConfig,
        ),
        merge(
          {
            test: /\.css$/,
            use: [styleLoader(), cssLoader()],
          },
          cssRuleConfig,
        ),
        merge(
          {
            test: /\.s[ac]ss$/i,
            use: [
              styleLoader(),
              cssLoader(),
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
            test: /\.(png|jpe?g|gif)$/i,
            type: 'asset/resource',
          },
          assetRuleConfig,
        ),
        merge({
          test: /\.svg$/i,
          type: 'asset/source',
        }),
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
        // `'...'` keeps webpack's default JS minifier; naming any minimizer would otherwise replace it.
        // Lightning CSS so that extracted stylesheets are minified the same way `@openmrs/rspack-config`
        // minifies them. `targets` is passed explicitly because neither bundler's default consults the
        // module's browserslist.
        minimizer: [
          '...',
          new CssMinimizerPlugin<{ targets: Targets }>({
            minify: CssMinimizerPlugin.lightningCssMinify,
            minimizerOptions: { targets: browserslistToTargets(browserslist(browserTargets)) },
          }),
        ],
      },
      optimizationConfig,
    ),
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        issue: {
          exclude: [
            {
              severity: 'error',
              code: 'TS2786',
            },
          ],
        },
      }),
      new CleanWebpackPlugin(),
      isProd &&
        new MiniCssExtractPlugin({
          // `ignoreOrder` because nearly every class here is uniquely scoped by CSS Modules, so the
          // conflicting-order warnings this would otherwise emit across chunks are almost all noise.
          ignoreOrder: true,
        }),
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
        // Building on `@module-federation/enhanced` gives webpack remotes the MF 2.0 runtime, which they
        // read from the globals the app shell publishes rather than embedding. See `@openmrs/rspack-config`.
        experiments: {
          externalRuntime: true,
        },
        // Nothing consumes an mf-manifest or federated types here, so skip both plugins.
        manifest: false,
        dts: false,
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
        new CopyWebpackPlugin({
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
      // The two runtime packages a remote can safely borrow from the app shell; see the
      // `ExternalsPlugin` block in `@openmrs/rspack-config` for why only these two are shareable,
      // what still ships per remote, and why this is a plugin rather than an `externals` entry.
      new ExternalsPlugin('global', {
        '@module-federation/sdk': '_OPENMRS_FEDERATION_SDK',
        '@module-federation/error-codes': '_OPENMRS_FEDERATION_ERROR_CODES',
      }),
      new BannerPlugin({
        raw: true,
        entryOnly: true,
        test: /\.[cm]?js$/,
        banner: buildFederationRuntimeGuard(
          name,
          moduleFederationVersion ? `${moduleFederationVersion.major}.${moduleFederationVersion.minor}` : undefined,
        ),
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
  const config = mergeWith(baseConfig, additionalConfig, mergeFunction);

  // Appended after the merge rather than listed above, because `overrides.plugins` replaces the
  // plugin array wholesale and an app doing that would drop the guard without noticing. Same
  // reasoning as the `ExternalsPlugin` block above, which avoids `externals` for the same reason.
  // Production only: under `style-loader` there are no `.css` assets to check.
  config.plugins = [...(config.plugins ?? []), ...(isProd ? [new CarbonCssGuardPlugin(name)] : [])];

  return config;
};
