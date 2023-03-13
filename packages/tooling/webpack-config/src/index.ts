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
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { resolve, dirname, basename } from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { DefinePlugin, container } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { StatsWriterPlugin } from "webpack-stats-plugin";
// eslint-disable-next-line no-restricted-imports
import { merge, mergeWith, isArray } from "lodash";
import { postProcessFile } from "./optimize";
import { inc } from "semver";

const production = "production";
const { ModuleFederationPlugin } = container;

function getFrameworkVersion() {
  try {
    const { version } = require("@openmrs/esm-framework/package.json");
    return `^${version}`;
  } catch {
    return "4.x";
  }
}

function makeIdent(name: string) {
  if (name.indexOf("/") !== -1) {
    name = name.substr(name.indexOf("/"));
  }

  if (name.endsWith("-app")) {
    name = name.substr(0, name.length - 4);
  }

  return name;
}

function mergeFunction(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

function slugify(name) {
  return name.replace(/[\/\-@]/g, "_");
}

/**
 * This object will be merged into the webpack config.
 * Array values will be concatenated with the existing array.
 * Make sure to modify this object and not reassign it.
 */
export const overrides = {};

/**
 * The keys of this object will override the top-level keys
 * of the webpack config.
 * Make sure to modify this object and not reassign it.
 */
export const additionalConfig = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of JS, JSX, TS, etc. files.
 * Make sure to modify this object and not reassign it.
 */
export const scriptRuleConfig = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of CSS files.
 * Make sure to modify this object and not reassign it.
 */
export const cssRuleConfig = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of SCSS files.
 * Make sure to modify this object and not reassign it.
 */
export const scssRuleConfig = {};

/**
 * This object will be merged into the webpack rule governing
 * the loading of static asset files.
 * Make sure to modify this object and not reassign it.
 */
export const assetRuleConfig = {};

export default (
  env: Record<string, string>,
  argv: Record<string, string> = {}
) => {
  const root = process.cwd();
  const {
    name,
    version,
    peerDependencies,
    browser,
    main,
    types,
  } = require(resolve(root, "package.json"));
  const mode = argv.mode || process.env.NODE_ENV || "development";
  const filename = basename(browser || main);
  const outDir = dirname(browser || main);
  const srcFile = resolve(root, browser ? main : types);
  const ident = makeIdent(name);
  const frameworkVersion = getFrameworkVersion();

  const cssLoader = {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: `${ident}__[name]__[local]___[hash:base64:5]`,
      },
    },
  };

  const baseConfig = {
    // The only `entry` in the application is the app shell. Everything else is
    // a Webpack Module Federation "remote." This ensures that there is always
    // only one container context--i.e., if we had an entry point per module,
    // WMF could get confused and not resolve shared dependencies correctly.
    output: {
      publicPath: "auto",
      path: resolve(root, outDir),
      hashFunction: "xxhash64",
    },
    module: {
      rules: [
        merge(
          {
            test: /\.m?(js|ts|tsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: require.resolve("swc-loader"),
            },
          },
          scriptRuleConfig
        ),
        merge(
          {
            test: /\.css$/,
            use: [require.resolve("style-loader"), cssLoader],
          },
          cssRuleConfig
        ),
        merge(
          {
            test: /\.s[ac]ss$/i,
            use: [
              require.resolve("style-loader"),
              cssLoader,
              {
                loader: require.resolve("sass-loader"),
                options: { sassOptions: { quietDeps: true } },
              },
            ],
          },
          scssRuleConfig
        ),
        merge(
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: "asset/resource",
          },
          assetRuleConfig
        ),
      ],
    },
    mode,
    devtool:
      mode === production ? "hidden-nosources-source-map" : "eval-source-map",
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      devMiddleware: {
        writeToDisk: true,
      },
      static: [resolve(root, outDir)],
    },
    performance: {
      hints: mode === production && "warning",
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new CleanWebpackPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: env && env.analyze ? "server" : "disabled",
      }),
      new DefinePlugin({
        __VERSION__:
          mode === production
            ? JSON.stringify(version)
            : JSON.stringify(inc(version, "prerelease", "local")),
        "process.env.FRAMEWORK_VERSION": JSON.stringify(frameworkVersion),
      }),
      new ModuleFederationPlugin({
        // See `esm-app-shell/src/load-modules.ts` for an explanation of how modules
        // get loaded into the application.
        name,
        library: { type: "var", name: slugify(name) },
        filename,
        exposes: {
          "./start": srcFile,
        },
        shared: [
          ...Object.keys(peerDependencies),
          "@openmrs/esm-framework/src/internal",
        ].reduce((obj, depName) => {
          obj[depName] = {
            requiredVersion: peerDependencies[depName] ?? false,
            singleton: true,
            import: depName,
            shareKey: depName,
            shareScope: "default",
          };
          return obj;
        }, {}),
      }),
      new StatsWriterPlugin({
        filename: `${filename}.buildmanifest.json`,
        stats: {
          all: false,
          chunks: true,
        },
      }),
      {
        apply(compiler) {
          compiler.hooks.afterEmit.tap("PostProcessPlugin", (compilation) => {
            if (mode === "production") {
              // only post-optimize the bundle in production mode
              const fn = resolve(root, outDir, filename);
              postProcessFile(fn);
            }
          });
        },
      },
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".scss"],
      alias: {
        "@openmrs/esm-framework": "@openmrs/esm-framework/src/internal",
      },
    },
    ...overrides,
  };
  return mergeWith(baseConfig, additionalConfig, mergeFunction);
};
