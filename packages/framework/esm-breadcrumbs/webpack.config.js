const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { peerDependencies } = require("./package.json");

module.exports = (env) => ({
  entry: [resolve(__dirname, "src/index.ts")],
  output: {
    filename: "openmrs-esm-breadcrumbs.js",
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
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? "static" : "disabled",
    }),
  ],
  externals: Object.keys(peerDependencies || {}),
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
