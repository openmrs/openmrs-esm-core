const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { peerDependencies } = require("./package.json");

module.exports = (env) => ({
  entry: [resolve(__dirname, "src/index.ts")],
  devtool: "source-map",
  output: {
    filename: "openmrs-esm-module-config.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "system",
  },
  module: {
    rules: [
      {
        parser: {
          system: false,
        },
      },
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  externals: Object.keys(peerDependencies),
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? "static" : "disabled",
    }),
  ],
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
