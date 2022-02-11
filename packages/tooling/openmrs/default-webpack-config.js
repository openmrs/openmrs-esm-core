const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { resolve, dirname, basename } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin, container } = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const { mergeWith, isArray } = require("lodash");
const { postProcessFile } = require('./dist/utils/optimize');

const production = "production";
const { ModuleFederationPlugin } = container;

function getFrameworkVersion() {
  try {
    const { version } = require("@openmrs/esm-framework/package.json");
    return `^${version}`;
  } catch {
    return "3.x";
  }
}

function makeIdent(name) {
  if (name.indexOf("/") !== -1) {
    name = name.substr(name.indexOf("/"));
  }

  if (name.endsWith("-app")) {
    name = name.substr(0, name.length - 4);
  }

  return name;
}

const overrides = {};
const additionalConfig = {};

module.exports = (env, argv = {}) => {
  const root = process.cwd();
  const { name, peerDependencies, browser, main, types } = require(resolve(
    root,
    "package.json"
  ));
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
    entry: {
      [name]: "systemjs-webpack-interop/auto-public-path",
    },
    output: {
      libraryTarget: "system",
      publicPath: "",
      path: resolve(root, outDir),
    },
    target: "web",
    module: {
      rules: [
        {
          test: /\.m?(js|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: require.resolve("babel-loader"),
          },
        },
        {
          test: /\.css$/,
          use: [require.resolve("style-loader"), cssLoader],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            require.resolve("style-loader"),
            cssLoader,
            { loader: require.resolve("sass-loader") },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
        },
      ],
    },
    mode,
    devtool: mode === production ? "source-map" : "inline-source-map",
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
        "process.env.FRAMEWORK_VERSION": JSON.stringify(frameworkVersion),
      }),
      new ModuleFederationPlugin({
        name,
        library: { type: "system", name },
        filename,
        exposes: {
          app: srcFile,
        },
        shared: Object.keys(peerDependencies).reduce((obj, depName) => {
          obj[depName] = {
            requiredVersion: peerDependencies[depName],
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
          compiler.hooks.afterEmit.tap('PostProcessPlugin', compilation => {
            const fn = resolve(root, outDir, filename);
            postProcessFile(fn);
          });
        },
      },
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".scss"],
    },
    ...overrides,
  };
  return mergeWith(baseConfig, additionalConfig, mergeFunction);
};

function mergeFunction(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/**
 * This object will be merged into the webpack config.
 * Array values will be concatenated with the existing array.
 * Make sure to modify this object and not reassign it.
 */
module.exports.additionalConfig = additionalConfig;

/**
 * The keys of this object will override the top-level keys
 * of the webpack config.
 * Make sure to modify this object and not reassign it.
 */
module.exports.overrides = overrides;
