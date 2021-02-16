const { resolve } = require("path");

const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const { peerDependencies } = require("./package.json");

module.exports = {
  entry: [
    resolve(__dirname, "src/set-public-path.js"),
    resolve(__dirname, "src/index.ts"),
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
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: require("./postcss.config"),
            },
          },
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
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
  externals: Object.keys(peerDependencies),
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "openmrs-esm-styleguide.css",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    }),
  ],
};
