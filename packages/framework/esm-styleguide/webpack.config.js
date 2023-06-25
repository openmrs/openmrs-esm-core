const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { resolve } = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const { peerDependencies } = require("./package.json");

module.exports = (env) => ({
  entry: [
    resolve(__dirname, "src/index.ts"),
    resolve(__dirname, "src/_all.scss"),
  ],
  output: {
    filename: "openmrs-esm-styleguide.js",
    chunkFilename: "[name].js",
    path: resolve(__dirname, "dist"),
    library: { type: "system" },
  },
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          { loader: require.resolve("postcss-loader") },
          "sass-loader",
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: "swc-loader",
      },
      {
        test: /\.(woff|woff2|png)?$/,
        type: "asset/resource",
      },
      {
        test: /\.(svg|html)$/,
        type: "asset/source",
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  externals: Object.keys(peerDependencies || {}),
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), "..."],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "openmrs-esm-styleguide.css",
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? "static" : "disabled",
    }),
  ],
});
