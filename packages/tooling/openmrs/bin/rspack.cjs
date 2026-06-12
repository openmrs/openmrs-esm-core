#!/usr/bin/env node

// Re-export the rspack CLI so that packages depending on
// openmrs get the `rspack` command without needing a direct
// dependency on @rspack/cli.
const { RspackCLI } = require('@rspack/cli');

const cli = new RspackCLI();
cli.run(process.argv);
