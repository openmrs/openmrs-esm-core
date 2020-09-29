const { resolve } = require("path");
const { readFileSync } = require("fs");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const openmrsApiUrl = process.env.OMRS_API_URL || "/openmrs";
const openmrsPublicUrl = process.env.OMRS_PUBLIC_URL || "/openmrs/spa";

module.exports = {
  entry: resolve(__dirname, "src/index.ts"),
  output: {
    filename: "openmrs.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "window",
    publicPath: openmrsPublicUrl,
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
    proxy: {
      [openmrsApiUrl]: {
        target: 'https://openmrs-spa.org/',
        changeOrigin: true,
      },
    },
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
        openmrsApiUrl,
        openmrsPublicUrl,
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
