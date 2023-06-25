const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { resolve, basename } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ModuleFederationPlugin } = require("webpack").container;

const { name, browser, main, peerDependencies } = require("./package.json");

/**
 * @param {*} env
 * @returns {import("webpack/types").Configuration}
 */
module.exports = (env) => ({
  entry: [resolve(__dirname, "src/index.ts")],
  output: {
    filename: "openmrs-esm-framework.js",
    path: resolve(__dirname, "dist"),
    library: { type: "system" },
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: "swc-loader",
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: require.resolve("style-loader") },
          { loader: require.resolve("css-loader") },
          { loader: require.resolve("sass-loader") },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx", ".scss"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? "static" : "disabled",
    }),
    new ModuleFederationPlugin({
      // See `esm-app-shell/src/load-modules.ts` for an explanation of how modules
      // get loaded into the application.
      name,
      library: { type: "var", name: "_openmrs_esm_framework" },
      filename: basename(browser || main),
      shared: [...Object.keys(peerDependencies)].reduce((obj, depName) => {
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
  ],
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
