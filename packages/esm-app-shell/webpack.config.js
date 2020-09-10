const { resolve } = require("path");

module.exports = {
  entry: resolve(__dirname, "src/index.ts"),
  output: {
    filename: "openmrs.js",
    path: resolve(__dirname, "dist"),
    libraryTarget: "window",
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
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
