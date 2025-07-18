const { rspack } = require('@rspack/core');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { resolve } = require('node:path');

const { peerDependencies } = require('./package.json');

module.exports = (env, argv = {}) => ({
  entry: [resolve(__dirname, 'src/internal.ts')],
  output: {
    filename: 'openmrs-esm-framework.js',
    chunkFilename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  mode: argv.mode ?? process.env.NODE_ENV ?? 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          { loader: rspack.CssExtractRspackPlugin.loader },
          'css-loader',
          'builtin:lightningcss-loader',
          {
            loader: require.resolve('sass-loader'),
            options: {
              api: 'modern-compiler',
              implementation: require.resolve('sass-embedded'),
              sassOptions: { quietDeps: true },
            },
          },
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: 'swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      },
      {
        test: /\.(woff|woff2|png)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        use: 'svgo-loader',
        type: 'asset/source',
      },
      {
        test: /\.html$/,
        type: 'asset/source',
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  watch: false,
  externalsType: 'module',
  externals: Object.keys(peerDependencies || {}),
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [new rspack.SwcJsMinimizerRspackPlugin(), new rspack.LightningCssMinimizerRspackPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: env && env.analyze ? 'static' : 'disabled',
    }),
  ],
});
