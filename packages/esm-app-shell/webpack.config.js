const { resolve } = require("path");
const { readFileSync } = require("fs");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(woff|woff2|png)?$/,
        use: ["file-loader"],
      },
      {
        test: /\.(svg|html)$/,
        use: ["raw-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: JSON.parse(readFileSync("./.babelrc", "utf8")),
          },
        ],
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /(node_modules|bower_components)/,
        use: ["ts-loader"],
      },
    ],
  },
  resolve: {
    mainFields: ["module", "main"],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: resolve(__dirname, "src/index.ejs"),
      templateParameters: {
        openmrsBaseUrlContext: process.env.OMRS_BASE_URL || "/openmrs",
        spaBaseUrlContext: process.env.OMRS_SPA_PATH || "/spa",
        openmrsFavicon: process.env.OMRS_FAVICON || "favicon.ico",
        openmrsImportmap: process.env.OMRS_ESM_IMPORTMAP || "importmap.json",
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/assets" }],
    }),
    new MiniCssExtractPlugin({ filename: "openmrs.css" }),
  ],
};
