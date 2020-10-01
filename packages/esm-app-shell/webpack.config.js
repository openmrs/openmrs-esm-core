const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const { resolve } = require("path");
const { readFileSync } = require("fs");
const { removeTrailingSlash } = require("./tools/helpers");

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
const openmrsImportmapUrl =
  process.env.OMRS_ESM_IMPORTMAP_URL || "importmap.json";

module.exports = {
  entry: resolve(__dirname, "src/index.ts"),
  output: {
    filename: "openmrs.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "window",
    publicPath: openmrsPublicPath,
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
            options: JSON.parse(
              readFileSync(resolve(__dirname, ".babelrc"), "utf8")
            ),
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
        openmrsPublicPath,
        openmrsFavicon,
        openmrsImportmapDef,
        openmrsImportmapUrl,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: resolve(__dirname, "src/assets") }],
    }),
    new MiniCssExtractPlugin({ filename: "openmrs.css" }),
  ],
};
