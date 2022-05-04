const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const SystemJSPublicPathWebpackPlugin = require("systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin");
const { resolve } = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (env) => ({
  entry: [resolve(__dirname, "src/index.ts")],
  output: {
    filename: "openmrs-esm-framework.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "system",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
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
    new SystemJSPublicPathWebpackPlugin(),
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
