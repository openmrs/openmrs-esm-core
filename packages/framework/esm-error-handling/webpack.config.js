const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { peerDependencies } = require("./package.json");

module.exports = (env) => ({
  entry: [resolve(__dirname, "src/index.ts")],
  output: {
    filename: "openmrs-esm-error-handling.js",
    path: resolve(__dirname, "dist"),
    library: { type: "var", name: "_openmrs_esm_error_handling" },
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "@swc-node/loader",
        },
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    disableHostCheck: true,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? "static" : "disabled",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
});
