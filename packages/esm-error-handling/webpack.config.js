const { resolve } = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: [
    resolve(__dirname, "src/set-public-path.ts"),
    resolve(__dirname, "src/index.ts"),
  ],
  output: {
    filename: "openmrs-esm-error-handling.js",
    libraryTarget: "system",
    path: resolve(__dirname, "dist"),
    jsonpFunction: "webpackJsonp_openmrs_esm_error_handling",
  },
  mode: "production",
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
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devtool: "sourcemap",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    disableHostCheck: true,
  },
  externals: ["react", "react-dom", /^@openmrs\/esm/],
  plugins: [new ForkTsCheckerWebpackPlugin(), new CleanWebpackPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
};
