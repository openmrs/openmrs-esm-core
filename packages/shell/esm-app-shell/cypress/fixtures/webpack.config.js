const {
  container: { ModuleFederationPlugin },
} = require("webpack");
const path = require("path");

const root = process.cwd();

const { name, peerDependencies } = require(path.resolve(root, "package.json"));

module.exports = {
  entry: {
    // helloWorldPage: './src/helloWorldPage.tsx'
    [name]: "systemjs-webpack-interop/auto-public-path",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    library: {
      type: "system",
      name,
    },
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve("swc-loader"),
        },
      },
    ],
  },
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name,
      library: { type: "system", name },
      filename: "dist",
      // // remotes: ["@openmrs/esm-framework"]
      // shared: {
      //   "@openmrs/esm-framework": {
      //       import: "@openmrs/esm-framework",
      //       shareKey: "@openmrs/esm-framework",
      //       shareScope: "default",
      //       singleton: true,
      //       requiredVersion: false,
      //       eager: false
      // }}
      shared: [
        ...Object.keys(peerDependencies),
        "@openmrs/esm-framework/src/internal",
      ].reduce((obj, depName) => {
        obj[depName] = {
          requiredVersion: peerDependencies[depName] ?? false,
          singleton: true,
          import: depName,
          shareKey: depName,
          shareScope: "default",
        };
        return obj;
      }, {}),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".scss"],
    alias: {
      "@openmrs/esm-framework": "@openmrs/esm-framework/src/internal",
    },
  },
};
