#!/usr/bin/env node

import * as yargs from "yargs";
import * as commands from "./commands";

yargs.command(
  "debug",
  "Starts a new debugging session of the OpenMRS app shell.",
  (argv) =>
    argv
      .number("port")
      .default("port", 8080)
      .describe("port", "The port where the dev server should run."),
  (args) => commands.runDebug(args)
);

yargs.command(
  "build",
  "Builds a new app shell using the provided configuration.",
  (argv) =>
    argv
      .string("target")
      .default("target", "dist")
      .describe(
        "target",
        "The target directory where the build artifacts will be stored."
      ),
  (args) => commands.runBuild(args)
);

yargs
  .epilog(
    "For more information visit https://github.com/openmrs/openmrs-esm-core."
  )
  .help()
  .demandCommand()
  .strict().argv;
