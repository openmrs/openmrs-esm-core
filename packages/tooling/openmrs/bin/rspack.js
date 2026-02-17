#!/usr/bin/env node

// Re-export the rspack CLI so that packages depending on
// openmrs get the `rspack` command without needing a direct
// dependency on @rspack/cli.
const { RspackCLI } = require("@rspack/cli");

async function main() {
  const cli = new RspackCLI();
  await cli.run(process.argv);
}

main();
