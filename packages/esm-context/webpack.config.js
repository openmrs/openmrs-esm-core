const { resolve } = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: [resolve(__dirname, "src/index.ts")],
  output: {
    filename: "openmrs-esm-context.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "system",
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
        test: /\.m?(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    modules: ["node_modules", resolve(__dirname, "node_modules")],
  },
  plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
  externals: ["react", "react-dom", /^@openmrs\/esm/, "single-spa", "i18next"],
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
