const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");
const { InjectManifest } = require("workbox-webpack-plugin");
const { DefinePlugin } = require("webpack");
const { resolve } = require("path");
const { readFileSync } = require("fs");
const { removeTrailingSlash, getTimestamp } = require("./tools/helpers");
const { version } = require("./package.json");

const timestamp = getTimestamp();
const production = "production";

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
  process.env.OMRS_ESM_IMPORTMAP_URL || `${openmrsPublicPath}/importmap.json`;
const openmrsConfigUrls = (process.env.OMRS_CONFIG_URLS || "")
  .split(";")
  .filter((url) => url.length > 0)
  .map((url) => JSON.stringify(url))
  .join(", ");

module.exports = (env, argv = {}) => {
  const mode = argv.mode || process.env.NODE_ENV || production;
  const outDir = mode === production ? "dist" : "lib";
  const styleLoader =
    mode === "production"
      ? { loader: require.resolve(MiniCssExtractPlugin.loader) }
      : { loader: require.resolve("style-loader") };
  const cssLoader = { loader: require.resolve("css-loader") };

  return {
    entry: resolve(__dirname, "src/index.ts"),
    output: {
      filename: "openmrs.js",
      chunkFilename: "[chunkhash].js",
      path: resolve(__dirname, outDir),
    },
    target: "web",
    devServer: {
      compress: true,
      open: [`${openmrsPublicPath}/`.substr(1)],
      devMiddleware: {
        publicPath: `${openmrsPublicPath}/`,
      },
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
    mode,
    devtool: mode === "production" ? "source-map" : "inline-source-map",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [styleLoader, cssLoader],
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
      fallback: { http: false, stream: false, https: false, zlib: false },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new WebpackPwaManifest({
        name: "OpenMRS",
        short_name: "OpenMRS",
        description:
          "Open source Health IT by and for the entire planet, starting with the developing world.",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: resolve(__dirname, "src/assets/logo-512.png"),
            sizes: [96, 128, 144, 192, 256, 384, 512],
          },
        ],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        scriptLoading: "blocking",
        publicPath: openmrsPublicPath,
        template: resolve(__dirname, "src/index.ejs"),
        templateParameters: {
          openmrsApiUrl,
          openmrsPublicPath,
          openmrsFavicon,
          openmrsImportmapDef,
          openmrsImportmapUrl,
          openmrsEnvironment,
          openmrsConfigUrls,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: resolve(__dirname, "src/assets") }],
      }),
      mode === "production" &&
        new MiniCssExtractPlugin({
          filename: "openmrs.css",
        }),
      new DefinePlugin({
        "process.env.BUILD_VERSION": JSON.stringify(`${version}-${timestamp}`),
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: env && env.analyze ? "static" : "disabled",
      }),
      new InjectManifest({
        swSrc: resolve(__dirname, "./src/service-worker/index.ts"),
        swDest: "service-worker.js",
        maximumFileSizeToCacheInBytes:
          mode === production ? undefined : Number.MAX_SAFE_INTEGER,
        additionalManifestEntries: [
          { url: openmrsImportmapUrl, revision: null },
        ],
      }),
    ].filter(Boolean),
  };
};
