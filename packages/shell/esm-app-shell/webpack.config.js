const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackPwaManifest = require("webpack-pwa-manifest");
const { InjectManifest } = require("workbox-webpack-plugin");
const { DefinePlugin, container } = require("webpack");
const { resolve, dirname, basename } = require("path");
const { readdirSync, statSync } = require("fs");
const { removeTrailingSlash, getTimestamp } = require("./tools/helpers");
const { name, version, dependencies } = require("./package.json");
const sharedDependencies = require("./dependencies.json");
const frameworkVersion = require("@openmrs/esm-framework/package.json").version;

const timestamp = getTimestamp();
const production = "production";
const allowedSuffixes = ["-app", "-widgets"];
const { ModuleFederationPlugin } = container;

const openmrsAddCookie = process.env.OMRS_ADD_COOKIE;
const openmrsApiUrl = removeTrailingSlash(
  process.env.OMRS_API_URL || "/openmrs"
);
const openmrsPublicPath = removeTrailingSlash(
  process.env.OMRS_PUBLIC_PATH || "/openmrs/spa"
);
const openmrsProxyTarget =
  process.env.OMRS_PROXY_TARGET || "https://dev3.openmrs.org/";
const openmrsPageTitle = process.env.OMRS_PAGE_TITLE || "OpenMRS";
const openmrsFavicon = process.env.OMRS_FAVICON || "favicon.ico";
const openmrsOffline = process.env.OMRS_OFFLINE !== "disable";
const openmrsImportmapDef = process.env.OMRS_ESM_IMPORTMAP;
const openmrsEnvironment = process.env.OMRS_ENV || process.env.NODE_ENV || "";
const openmrsImportmapUrl =
  process.env.OMRS_ESM_IMPORTMAP_URL || `${openmrsPublicPath}/importmap.json`;
const openmrsConfigUrls = (process.env.OMRS_CONFIG_URLS || "")
  .split(";")
  .filter((url) => url.length > 0)
  .map((url) => JSON.stringify(url))
  .join(", ");

function checkDirectoryExists(dirName) {
  if (dirName) {
    try {
      return statSync(dirName).isDirectory();
    } catch {
      return false;
    }
  }

  return false;
}

function checkDirectoryHasContents(dirName) {
  if (checkDirectoryExists(dirName)) {
    const contents = readdirSync(dirName);
    return contents.length > 0;
  } else {
    return false;
  }
}

module.exports = (env, argv = {}) => {
  const mode = argv.mode || process.env.NODE_ENV || production;
  const outDir = mode === production ? "dist" : "lib";
  const isProd = mode === "production";
  const appPatterns = [];

  return {
    entry: resolve(__dirname, "src/index.ts"),
    output: {
      filename: "openmrs.js",
      chunkFilename: "[chunkhash].js",
      path: resolve(__dirname, outDir),
      publicPath: "",
    },
    target: "web",
    devServer: {
      compress: true,
      open: [`${openmrsPublicPath}/`.substring(1)],
      devMiddleware: {
        publicPath: `${openmrsPublicPath}/`,
      },
      historyApiFallback: {
        rewrites: [
          {
            from: new RegExp(`^${openmrsPublicPath}/.*(?!\.(?!html?).+$)`),
            to: `${openmrsPublicPath}/index.html`,
          },
        ],
      },
      proxy: [
        {
          context: [`${openmrsApiUrl}/**`, `${openmrsPublicPath}/**`],
          target: openmrsProxyTarget,
          changeOrigin: true,
          onProxyReq(proxyReq) {
            if (openmrsAddCookie) {
              const origCookie = proxyReq.getHeader("cookie");
              const newCookie = `${origCookie};${openmrsAddCookie}`;
              proxyReq.setHeader("cookie", newCookie);
            }
          },
        },
      ],
    },
    mode,
    devtool: isProd ? false : "inline-source-map",
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            isProd
              ? { loader: require.resolve(MiniCssExtractPlugin.loader) }
              : { loader: require.resolve("style-loader") },
            { loader: require.resolve("css-loader") },
            {
              loader: require.resolve("sass-loader"),
              options: { sassOptions: { quietDeps: true } },
            },
          ],
        },
        {
          test: /\.(woff|woff2|png)?$/,
          type: "asset/resource",
        },
        {
          test: /\.(svg|html)$/,
          type: "asset/source",
        },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: require.resolve("esbuild-loader"),
              options: {
                loader: "jsx",
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: require.resolve("esbuild-loader"),
              options: {
                loader: "tsx",
              },
            },
          ],
        },
      ],
    },
    resolve: {
      mainFields: ["module", "main"],
      extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
      fallback: {
        http: false,
        stream: false,
        https: false,
        zlib: false,
        url: false,
      },
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
          openmrsPageTitle,
          openmrsImportmapDef,
          openmrsImportmapUrl,
          openmrsOffline,
          openmrsEnvironment,
          openmrsConfigUrls,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: resolve(__dirname, "src/assets") }, ...appPatterns],
      }),
      new ModuleFederationPlugin({
        name,
        shared: sharedDependencies.reduce((obj, depName) => {
          obj[depName] = {
            requiredVersion: dependencies[depName] ?? false,
            singleton: true,
            eager: true,
            import: depName,
            shareKey: depName,
            shareScope: "default",
          };
          return obj;
        }, {}),
      }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: "openmrs.css",
        }),
      new DefinePlugin({
        "process.env.BUILD_VERSION": JSON.stringify(`${version}-${timestamp}`),
        "process.env.FRAMEWORK_VERSION": JSON.stringify(frameworkVersion),
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: env?.analyze ? "static" : "disabled",
      }),
      openmrsOffline &&
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
    ignoreWarnings: [/.*InjectManifest has been called multiple times.*/],
  };
};
