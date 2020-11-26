const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const { DefinePlugin } = require("webpack");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const { removeTrailingSlash, getTimestamp } = require("./tools/helpers");
const { version } = require("./package.json");

const timestamp = getTimestamp();

const openmrsApiUrl = removeTrailingSlash(
  process.env.OMRS_API_URL || "/openmrs"
);
const openmrsPublicPath = removeTrailingSlash(
  process.env.OMRS_PUBLIC_PATH || "/openmrs/spa"
);
const openmrsProxyTarget =
  process.env.OMRS_PROXY_TARGET || "https://openmrs-spa.org/";
const openmrsFavicon = process.env.OMRS_FAVICON || "favicon.ico";
const openmrsImportmapDef = process.env.OMRS_ESM_IMPORTMAP;
const openmrsEnvironment = process.env.OMRS_ENV || process.env.NODE_ENV || "";
const openmrsImportmapUrl =
  process.env.OMRS_ESM_IMPORTMAP_URL || "importmap.json";

module.exports = {
  entry: resolve(__dirname, "src/index.ts"),
  output: {
    filename: "openmrs.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "window",
    publicPath: `${openmrsPublicPath}/`,
  },
  devServer: {
    compress: true,
    open: true,
    openPage: `${openmrsPublicPath}/`.substr(1),
    historyApiFallback: {
      rewrites: [
        {
          from: new RegExp(`^${openmrsPublicPath}/`),
          to: `${openmrsPublicPath}/index.html`,
        },
      ],
    },
    proxy: [
      {
        context: [`${openmrsApiUrl}/**`, `!${openmrsPublicPath}/**`],
        target: openmrsProxyTarget,
        changeOrigin: true,
      },
    ],
  },
  mode: process.env.NODE_ENV || "production",
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
          { loader: require.resolve(MiniCssExtractPlugin.loader) },
          { loader: require.resolve("css-loader") },
          { loader: require.resolve("postcss-loader") },
        ],
      },
      {
        test: /\.(woff|woff2|png)?$/,
        use: [{ loader: require.resolve("file-loader") }],
      },
      {
        test: /\.(svg|html)$/,
        use: [{ loader: require.resolve("raw-loader") }],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: JSON.parse(
              readFileSync(resolve(__dirname, ".babelrc"), "utf8")
            ),
          },
        ],
      },
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              allowTsInNodeModules: true,
            },
          },
        ],
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
      hash: true,
      template: resolve(__dirname, "src/index.ejs"),
      templateParameters: {
        openmrsApiUrl,
        openmrsPublicPath,
        openmrsFavicon,
        openmrsImportmapDef,
        openmrsImportmapUrl,
        openmrsEnvironment,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: resolve(__dirname, "src/assets") }],
    }),
    new MiniCssExtractPlugin({ filename: "openmrs.css" }),
    new DefinePlugin({
      "process.env.BUILD_VERSION": JSON.stringify(`${version}-${timestamp}`),
    }),
  ],
};
