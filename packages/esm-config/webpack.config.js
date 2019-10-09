const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/openmrs-esm-module-config.js"),
  devtool: "sourcemap",
  output: {
    filename: "openmrs-esm-module-config.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "system"
  },
  mode: "production",
  module: {
    rules: [
      {
        parser: {
          system: false
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    disableHostCheck: true
  },
  externals: ["openmrs-config"],
  plugins: []
};
