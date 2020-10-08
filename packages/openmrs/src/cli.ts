#!/usr/bin/env node

import * as yargs from "yargs";
import { fork } from "child_process";
import { resolve } from "path";
import { getImportmap, trimEnd } from "./utils";

import type * as commands from "./commands";

const runner = resolve(__dirname, `runner.js`);
const root = resolve(__dirname, "..");

type Commands = typeof commands;
type CommandNames = keyof Commands;

function runCommand<T extends CommandNames>(
  type: T,
  args: Parameters<Commands[T]>[0]
) {
  const ps = fork(runner, [], { cwd: root });

  ps.send({
    type,
    args,
  });
}

yargs.command(
  "debug",
  "Starts a new debugging session of the OpenMRS app shell. This uses Webpack as a debug server with proxy middleware.",
  (argv) =>
    argv
      .number("port")
      .default("port", 8080)
      .describe("port", "The port where the dev server should run.")
      .string("backend")
      .default("backend", "https://openmrs-spa.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .string("importmap")
      .default("importmap", "importmap.json")
      .describe(
        "importmap",
        "The import map to use. Can be a path to a valid import map to be taken literally, an URL, or a fixed JSON object. Alternatively, use the string `@` to debug the current microfrontend."
      ),
  (args) =>
    runCommand("runDebug", {
      ...args,
      importmap: getImportmap(args.importmap, args.port),
    })
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
      )
      .string("importmap")
      .default("importmap", "importmap.json")
      .describe(
        "importmap",
        "The import map to use. Can be a path to a valid import map to be taken literally, an URL, or a fixed JSON object."
      ),
  (args) =>
    runCommand("runBuild", {
      ...args,
      importmap: getImportmap(args.importmap),
      target: resolve(process.cwd(), args.target),
    })
);

yargs.command(
  "assemble",
  "Assembles an import map incl. all required resources.",
  (argv) =>
    argv
      .string("target")
      .default("target", "dist")
      .describe(
        "target",
        "The target directory where the gathered artifacts will be stored."
      )
      .string("registry")
      .default("registry", "https://registry.npmjs.org/")
      .describe("registry", "The NPM registry used for getting the packages.")
      .string("config")
      .default("config", "microfrontends.json")
      .describe(
        "config",
        "The configuration for gathering the list of microfrontends to include."
      )
      .choices("mode", ["config", "survey"])
      .default("mode", "survey")
      .describe(
        "mode",
        "The source of the microfrontends to assemble. `config` uses a configuration file specified via `--config`. `survey` starts an interactive command-line survey."
      ),
  (args) =>
    runCommand("runAssemble", {
      ...args,
      registry: trimEnd(args.registry, "/"),
      config: resolve(process.cwd(), args.config),
      target: resolve(process.cwd(), args.target),
    })
);

yargs.command(
  ["start", "$0"],
  "Starts the app shell using the provided configuration. This uses express for serving static files with some proxy middleware.",
  (argv) =>
    argv
      .number("port")
      .default("port", 8080)
      .describe("port", "The port where the dev server should run.")
      .string("backend")
      .default("backend", "https://openmrs-spa.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .string("importmap")
      .default("importmap", "importmap.json")
      .describe(
        "importmap",
        "The import map to use. Can be a path to a valid import map to be taken literally, an URL, or a fixed JSON object."
      ),
  (args) => runCommand("runStart", { ...args })
);

yargs
  .epilog(
    "For more information visit https://github.com/openmrs/openmrs-esm-core."
  )
  .help()
  .demandCommand()
  .strict().argv;
