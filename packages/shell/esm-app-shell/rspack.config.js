const { CssExtractRspackPlugin, CopyRspackPlugin, DefinePlugin, container } = require('@rspack/core');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { basename, dirname, resolve } = require('path');
const { readdirSync, statSync, readFileSync } = require('fs');
const semver = require('semver');
const { removeTrailingSlash, getTimestamp } = require('./tools/helpers');

const { name, version, dependencies } = require('./package.json');
const sharedDependencies = require('./dependencies.json');
const frameworkVersion = require('@openmrs/esm-framework/package.json').version;

const timestamp = getTimestamp();
const production = 'production';
const allowedSuffixes = ['-app', '-widgets'];
const { ModuleFederationPluginV1: ModuleFederationPlugin } = container;

const openmrsAddCookie = process.env.OMRS_ADD_COOKIE;
const openmrsApiUrl = removeTrailingSlash(process.env.OMRS_API_URL || '/openmrs');
const openmrsPublicPath = removeTrailingSlash(process.env.OMRS_PUBLIC_PATH || '/openmrs/spa');
const openmrsProxyTarget = process.env.OMRS_PROXY_TARGET || 'https://dev3.openmrs.org/';
const openmrsPageTitle = process.env.OMRS_PAGE_TITLE || 'OpenMRS';
const openmrsFavicon = process.env.OMRS_FAVICON || `${openmrsPublicPath}/favicon.ico`;
const openmrsEnvironment = process.env.OMRS_ENV || process.env.NODE_ENV || '';
const openmrsOffline = process.env.OMRS_OFFLINE === 'enable';
const openmrsDefaultLocale = process.env.OMRS_ESM_DEFAULT_LOCALE || 'en';
const openmrsImportmapDef = process.env.OMRS_ESM_IMPORTMAP;
const openmrsImportmapUrl = process.env.OMRS_ESM_IMPORTMAP_URL || `${openmrsPublicPath}/importmap.json`;
const openmrsRoutesDef = process.env.OMRS_ROUTES;
const openmrsRoutesUrl = process.env.OMRS_ROUTES_URL || `${openmrsPublicPath}/routes.registry.json`;
const openmrsCoreApps = process.env.OMRS_ESM_CORE_APPS_DIR || resolve(__dirname, '../../apps');
const openmrsConfigUrls = (process.env.OMRS_CONFIG_URLS || '')
  .split(';')
  .filter((url) => url.length > 0)
  .map((url) => JSON.stringify(url))
  .join(', ');
const openmrsCleanBeforeBuild =
  (() => {
    try {
      return (
        process.env.OMRS_CLEAN_BEFORE_BUILD === undefined ||
        (typeof process.env.OMRS_CLEAN_BEFORE_BUILD === 'boolean' && process.env.OMRS_CLEAN_BEFORE_BUILD) ||
        (typeof process.env.OMRS_CLEAN_BEFORE_BUILD === 'string' &&
          process.env.OMRS_CLEAN_BEFORE_BUILD.toLowerCase() !== 'false')
      );
    } catch {
      // this is intensionally a no-op
    }

    return undefined;
  })() ?? true;

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

function checkFileExists(filename) {
  if (filename) {
    try {
      return statSync(filename).isFile();
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

// taken from: https://stackoverflow.com/a/6969486
// this function is CC BY-SA 4.0
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {Record<string, string>} env
 * @param {Array<string>} argv
 * @returns {import("@rspack/core").Configuration}
 */
module.exports = (env, argv = []) => {
  const mode = argv.mode || process.env.NODE_ENV || production;
  const outDir = mode === production ? 'dist' : 'lib';
  const isProd = mode === 'production';
  const appPatterns = [];

  const coreImportmap = {
    imports: {},
  };

  const coreRoutes = {};

  if (!isProd && checkDirectoryExists(openmrsCoreApps)) {
    readdirSync(openmrsCoreApps).forEach((dir) => {
      const appDir = resolve(openmrsCoreApps, dir);
      if (checkDirectoryExists(appDir)) {
        const { name, browser } = require(resolve(appDir, 'package.json'));
        const distDir = resolve(appDir, dirname(browser));
        if (allowedSuffixes.some((suffix) => name.endsWith(suffix))) {
          if (checkDirectoryHasContents(distDir)) {
            appPatterns.push({
              from: distDir,
              to: dir,
            });

            coreImportmap.imports[name] = `./${dir}/${basename(browser)}`;

            const routesFile = resolve(distDir, 'routes.json');
            if (checkFileExists(routesFile)) {
              coreRoutes[name] = JSON.parse(readFileSync(routesFile));
            }
          } else {
            console.warn(`Not serving ${name} because couldn't find ${distDir}`);
          }
        }
      }
    });
  }

  return {
    entry: resolve(__dirname, 'src/index.ts'),
    output: {
      filename: isProd ? 'openmrs.[contenthash].js' : 'openmrs.js',
      chunkFilename: '[chunkhash].js',
      path: resolve(__dirname, outDir),
      publicPath: '',
      hashFunction: 'xxhash64',
    },
    target: 'web',
    devServer: {
      compress: true,
      open: [`${openmrsPublicPath}/`.substring(1)],
      devMiddleware: {
        publicPath: `${openmrsPublicPath}/`,
      },
      historyApiFallback: {
        rewrites: [
          {
            from: new RegExp(`^${escapeRegExp(openmrsPublicPath)}/.*(?!\\.(?!html).+$)`),
            to: `${openmrsPublicPath}/index.html`,
          },
        ],
      },
      proxy: [
        {
          /**
           * @param {String} path
           */
          context(path) {
            if (!path) {
              return false;
            }

            if (path.startsWith(openmrsPublicPath)) {
              if (basename(path).indexOf('.') >= 0) {
                return true;
              } else {
                return false;
              }
            }

            if (path.startsWith(openmrsApiUrl)) {
              return true;
            }

            return false;
          },
          target: openmrsProxyTarget,
          changeOrigin: true,
          /**
           * @param {Request} proxyReq
           */
          onProxyReq(proxyReq) {
            if (openmrsAddCookie) {
              const origCookie = proxyReq.getHeader('cookie');
              const newCookie = `${origCookie};${openmrsAddCookie}`;
              proxyReq.setHeader('cookie', newCookie);
            }
          },
          /**
           * @param {Response} proxyRes
           */
          onProxyRes(proxyRes) {
            proxyRes.headers && delete proxyRes.headers['content-security-policy'];
          },
          /**
           * @param {string} path
           * @param {Request} req
           * @returns {string}
           */
          pathRewrite(path) {
            if (path.startsWith(openmrsPublicPath)) {
              const matcher = /^.*\/([^\/]*\.(?!html|js)[^.]+)$/i.exec(path);
              if (matcher) {
                return `${openmrsPublicPath}/${matcher[1]}`;
              }
            }

            return path;
          },
        },
      ],
      static: ['src/assets'],
    },
    watchOptions: {
      ignored: ['.git', 'test-results'],
    },
    mode,
    devtool: isProd ? 'hidden-nosources-source-map' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /openmrs-esm-styleguide\.css$/,
          use: [
            isProd
              ? { loader: require.resolve(CssExtractRspackPlugin.loader) }
              : { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
          ],
        },
        {
          test: /\.css$/,
          exclude: [/openmrs-esm-styleguide\.css$/],
          use: [
            isProd
              ? { loader: require.resolve(CssExtractRspackPlugin.loader) }
              : { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            isProd
              ? { loader: require.resolve(CssExtractRspackPlugin.loader) }
              : { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
            {
              loader: require.resolve('sass-loader'),
              options: { sassOptions: { quietDeps: true } },
            },
          ],
        },
        {
          test: /\.(woff|woff2|png)?$/,
          type: 'asset/resource',
        },
        {
          test: /\.(svg|html)$/,
          type: 'asset/source',
        },
        {
          test: /\.(j|t)sx?$/,
          use: [
            {
              loader: 'builtin:swc-loader',
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        maxAsyncRequests: 3,
        maxInitialRequests: 1,
      },
    },
    resolve: {
      mainFields: ['module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
      fallback: {
        http: false,
        stream: false,
        https: false,
        zlib: false,
        url: false,
      },
      alias: {
        'lodash.debounce': 'lodash-es/debounce',
        'lodash.findlast': 'lodash-es/findLast',
        'lodash.isequal': 'lodash-es/isEqual',
        'lodash.omit': 'lodash-es/omit',
        'lodash.throttle': 'lodash-es/throttle',
        // ugly, stupid hack to support dynamic translation resolution here
        '@openmrs/esm-translations/translations': resolve(
          dirname(require.resolve('@openmrs/esm-translations/package.json')),
          'translations',
        ),
      },
    },
    plugins: [
      openmrsCleanBeforeBuild && new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: false,
        scriptLoading: 'blocking',
        publicPath: openmrsPublicPath,
        template: resolve(__dirname, 'src/index.ejs'),
        templateParameters: {
          openmrsApiUrl,
          openmrsPublicPath,
          openmrsFavicon,
          openmrsPageTitle,
          openmrsDefaultLocale,
          openmrsImportmapDef,
          openmrsImportmapUrl,
          openmrsRoutesDef,
          openmrsRoutesUrl,
          openmrsOffline,
          openmrsEnvironment,
          openmrsConfigUrls,
          openmrsCoreImportmap: appPatterns.length > 0 && JSON.stringify(coreImportmap),
          openmrsCoreRoutes: Object.keys(coreRoutes).length > 0 && JSON.stringify(coreRoutes),
        },
      }),
      new WebpackPwaManifest({
        name: openmrsPageTitle,
        short_name: openmrsPageTitle,
        publicPath: openmrsPublicPath,
        description: 'Open source Health IT by and for the entire planet, starting with the developing world.',
        background_color: '#ffffff',
        theme_color: '#005d5d',
        icons: [
          {
            src: resolve(__dirname, 'src/assets/logo-512.png'),
            sizes: [96, 128, 144, 192, 256, 384, 512],
          },
        ],
      }),
      new CopyRspackPlugin({
        patterns: [{ from: resolve(__dirname, 'src/assets') }, ...appPatterns],
      }),
      new ModuleFederationPlugin({
        name,
        shared: sharedDependencies.reduce((obj, depName) => {
          // This just attempts to align the requiredVersion with what we usually have in peerDependencies
          let version = dependencies[depName];

          if (version) {
            if (version.startsWith('^')) {
              version = `${semver.parse(version.slice(1)).major}.x`;
            } else if (version.startsWith('~')) {
              const semVer = semver.parse(version.slice(1));
              version = `${semVer.major}.${semVer.minor}.x`;
            } else if (version === 'workspace:*') {
              version = `${semver.parse(require(`${depName}/package.json`).version).major}.X`;
            }
          }

          const eager = depName === 'dayjs';

          if (depName === 'swr') {
            // SWR is annoying with Module Federation
            // See: https://github.com/webpack/webpack/issues/16125 and https://github.com/vercel/swr/issues/2356
            obj['swr/_internal'] = {
              requiredVersion: version,
              strictVersion: false,
              singleton: true,
              eager: false,
              import: 'swr/_internal',
              shareKey: 'swr/_internal',
              shareScope: 'default',
              version: require('swr/package.json').version,
            };
          } else {
            obj[depName] = {
              requiredVersion: version ?? false,
              strictVersion: false,
              singleton: true,
              eager: eager,
              import: depName,
              shareKey: depName,
              shareScope: 'default',
            };
          }
          return obj;
        }, {}),
      }),
      isProd &&
        new CssExtractRspackPlugin({
          filename: 'openmrs.[contenthash].css',
          ignoreOrder: true,
        }),
      new DefinePlugin({
        'process.env.BUILD_VERSION': JSON.stringify(`${version}-${timestamp}`),
        'process.env.FRAMEWORK_VERSION': JSON.stringify(frameworkVersion),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: env?.analyze ? 'static' : 'disabled',
      }),
    ].filter(Boolean),
    ignoreWarnings: [/.*InjectManifest has been called multiple times.*/],
  };
};
