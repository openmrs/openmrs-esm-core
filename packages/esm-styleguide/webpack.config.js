const { resolve } = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: [
    resolve(__dirname, "src/set-public-path.js"),
    resolve(__dirname, "src/index.js"),
  ],
  output: {
    libraryTarget: "system",
    filename: "openmrs-esm-styleguide.js",
    chunkFilename: "[name].js",
    path: resolve(__dirname, "dist"),
    jsonpFunction: "webpackJsonp_openmrs_esm_styleguide",
  },
  mode: "production",
  devtool: "sourcemap",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
      },
      {
        test: /\.(woff|woff2|png)?$/,
        use: ["file-loader"],
      },
      {
        test: /\.(svg|html)$/,
        use: ["raw-loader"],
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  externals: [/^@openmrs\/.+$/, "react", "react-dom", "rxjs"],
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".json"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "openmrs-esm-styleguide.css" }),
  ],
};
