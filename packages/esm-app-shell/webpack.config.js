const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: resolve(__dirname, "src/index.ts"),
  output: {
    filename: "openmrs.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "window",
  },
  devtool: "sourcemap",
  module: {
    rules: [
      {
        parser: {
          system: false,
        },
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: resolve(__dirname, "src/index.ejs"),
      templateParameters: {
        openmrsBaseUrlContext: process.env.OMRS_BASE_URL || "/openmrs",
        spaBaseUrlContext: process.env.OMRS_SPA_PATH || "/spa",
        openmrsImportmap:
          process.env.OMRS_ESM_IMPORTMAP || "/openmrs/frontend/import-map.json",
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};
