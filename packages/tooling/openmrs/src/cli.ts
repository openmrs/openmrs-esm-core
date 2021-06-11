#!/usr/bin/env node

import * as yargs from "yargs";
import { fork } from "child_process";
import { resolve } from "path";
import { getImportmap, mergeImportmap, runProject, trimEnd } from "./utils";

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

  ps.on("exit", (code) => process.exit(code || 0));
}

yargs.command(
  "debug",
  "Starts a new debugging session of the OpenMRS app shell. This uses Webpack as a debug server with proxy middleware.",
  (argv) =>
    argv
      .number("port")
      .default("port", 8080)
      .describe("port", "The port where the dev server should run.")
      .number("host")
      .default("host", "localhost")
      .describe("host", "The host name or IP for the server to use.")
      .string("backend")
      .default("backend", "https://openmrs-spa.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .string("spa-path")
      .default("spa-path", "/openmrs/spa/")
      .describe("spa-path", "The path of the application on the target server.")
      .string("api-url")
      .default("api-url", "/openmrs/")
      .describe(
        "api-url",
        "The URL of the API. Can be a path if the API is on the same target server."
      )
      .array("config-url")
      .default("config-url", [])
      .describe(
        "config-url",
        "The URL to a valid frontend configuration. Can be used multiple times."
      )
      .boolean("run-project")
      .default("run-project", false)
      .describe(
        "run-project",
        "Runs the project in the current directory fusing it with the specified import map."
      )
      .string("sources")
      .default("sources", ".")
      .describe(
        "sources",
        "Runs the projects from the provided source directories."
      )
      .array("shared-dependencies")
      .default("shared-dependencies", [])
      .describe(
        "shared-dependencies",
        "The additional shared dependencies besides the ones from the app shell."
      )
      .string("importmap")
      .default("importmap", "importmap.json")
      .describe(
        "importmap",
        "The import map to use. Can be a path to a valid import map to be taken literally, an URL, or a fixed JSON object."
      ),
  async (args) =>
    runCommand("runDebug", {
      apiUrl: args["api-url"],
      spaPath: args["spa-path"],
      configUrls: args["config-url"],
      ...args,
      importmap: await mergeImportmap(
        await getImportmap(args.importmap, args.port),
        (args["run-project"] || (args.runProject as boolean)) &&
          (await runProject(
            args.port,
            args["shared-dependencies"],
            args.sources
          ))
      ),
    })
);

yargs.command(
  "develop",
  "Starts a new microfrontend development session with the OpenMRS app shell.",
  (argv) =>
    argv
      .number("port")
      .default("port", 8080)
      .describe("port", "The port where the dev server should run.")
      .number("host")
      .default("host", "localhost")
      .describe("host", "The host name or IP for the server to use.")
      .string("backend")
      .default("backend", "https://openmrs-spa.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .string("spa-path")
      .default("spa-path", "/openmrs/spa/")
      .describe("spa-path", "The path of the application on the target server.")
      .string("api-url")
      .default("api-url", "/openmrs/")
      .describe(
        "api-url",
        "The URL of the API. Can be a path if the API is on the same target server."
      )
      .boolean("open")
      .default("open", true)
      .describe("open", "Immediately opens the SPA page URL in the browser.")
      .array("config-url")
      .default("config-url", [])
      .describe(
        "config-url",
        "The URL to a valid frontend configuration. Can be used multiple times."
      )
      .string("sources")
      .default("sources", ".")
      .describe(
        "sources",
        "Runs the projects from the provided source directories."
      )
      .array("shared-dependencies")
      .default("shared-dependencies", [])
      .describe(
        "shared-dependencies",
        "The additional shared dependencies besides the ones from the app shell."
      )
      .string("importmap")
      .default("importmap", "importmap.json")
      .describe(
        "importmap",
        "The import map to use. Can be a path to a valid import map to be taken literally, an URL, or a fixed JSON object."
      ),
  async (args) =>
    runCommand("runDevelop", {
      apiUrl: args["api-url"],
      spaPath: args["spa-path"],
      configUrls: args["config-url"],
      ...args,
      importmap: await mergeImportmap(
        await getImportmap(args.importmap, args.port),
        await runProject(args.port, args["shared-dependencies"], args.sources)
      ),
    })
);

yargs.command(
  "build",
  "Builds a new app shell.",
  (argv) =>
    argv
      .string("target")
      .default("target", "dist")
      .describe(
        "target",
        "The target directory where the build artifacts will be stored."
      )
      .boolean("fresh")
      .describe(
        "fresh",
        "Determines if the output directory should be cleaned before the run."
      )
      .default("fresh", false)
      .string("build-config")
      .describe("build-config", "Path to a frontend build/assemble config JSON")
      .string("spa-path")
      .default("spa-path", "/openmrs/spa/")
      .describe("spa-path", "The path of the application on the target server.")
      .string("api-url")
      .default("api-url", "/openmrs/spa/")
      .describe(
        "api-url",
        "The URL of the API. Can be a path if the API is on the same target server."
      )
      .array("config-url")
      .default("config-url", [])
      .describe(
        "config-url",
        "The URL to a frontend configuration. Can be used multiple times. Resolved by the client during initialization."
      )
      .string("importmap")
      .default("importmap", "importmap.json")
      .describe(
        "importmap",
        "The import map to use. Can be a path to an import map to be taken literally, an URL, or a fixed JSON object."
      ),
  async (args) =>
    runCommand("runBuild", {
      apiUrl: args["api-url"],
      spaPath: args["spa-path"],
      configUrls: args["config-url"],
      buildConfig: args["build-config"],
      ...args,
      importmap: args.importmap,
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
      .default("config", "frontend.json")
      .describe(
        "config",
        "Path to a frontend build/assemble config JSON."
      )
      .boolean("fresh")
      .describe(
        "fresh",
        "Determines if the output directory should be cleaned before the run."
      )
      .default("fresh", false)
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
      .number("host")
      .default("host", "localhost")
      .describe("host", "The host name or IP for the server to use.")
      .string("backend")
      .default("backend", "https://openmrs-spa.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .boolean("open")
      .default("open", false)
      .describe("open", "Immediately opens the SPA page URL in the browser.")
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
    "The frontend build/assemble config JSON is a JSON file, typically `frontend.json`, which defines parameters for the `build` and `assemble` " +
    "commands. The keys used by `build` are `apiUrl`, `spaPath`, `configUrls`, and `importmap`, each of " +
    "which is equivalent to the corresponding command line argument. The keys used by `assemble` are:\n" +
    "  microfrontends  \tAn object which specifies which microfrontends to include. It should have package names " +
    "for keys and versions for values.\n" +
    "  publicUrl  \tThe URL at which the microfrontends will be made available. Can be relative to the importmap. " +
    "Defaults to `.` (which means they will be colocated with the import map).\n\n" +
    "For more information visit https://github.com/openmrs/openmrs-esm-core."
  )
  .help()
  .demandCommand()
  .strict().argv;
