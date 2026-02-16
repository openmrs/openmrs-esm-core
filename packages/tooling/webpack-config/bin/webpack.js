#!/usr/bin/env node

// Re-export the webpack CLI so that workspaces depending on
// @openmrs/webpack-config get the `webpack` command without needing
// direct dependencies on webpack and webpack-cli.
require("webpack/bin/webpack");
