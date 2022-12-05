#!/usr/bin/env node

import yargs from "yargs";
import { fork } from "child_process";
import { resolve } from "path";
import {
  getImportmap,
  mergeImportmap,
  proxyImportmap,
  runProject,
  trimEnd,
} from "./utils";

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
      .default("backend", "https://dev3.openmrs.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .string("add-cookie")
      .default("add-cookie", "")
      .describe("add-cookie", "Additional cookies to provide when proxying.")
      .boolean("support-offline")
      .describe(
        "support-offline",
        "Determines if a service worker should be installed for offline support."
      )
      .default("support-offline", true)
      .string("spa-path")
      .default("spa-path", "/openmrs/spa/")
      .describe("spa-path", "The path of the application on the target server.")
      .string("api-url")
      .default("api-url", "/openmrs/")
      .describe(
        "api-url",
        "The URL of the API. Can be a path if the API is on the same target server."
      )
      .string("page-title")
      .default("page-title", "OpenMRS")
      .describe(
        "page-title",
        "The title of the web app usually displayed in the browser tab."
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
      .array("sources")
      .default("sources", ["."])
      .describe(
        "sources",
        "Runs the projects from the provided source directories. Can be used multiple times."
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
      configUrls: args["config-url"],
      ...args,
      importmap: proxyImportmap(
        await mergeImportmap(
          await getImportmap(args.importmap, args.port),
          (args["run-project"] || (args.runProject as boolean)) &&
            (await runProject(
              args.port,
              args["shared-dependencies"],
              args.sources
            ))
        ),
        args.backend,
        args.host,
        args.port
      ),
    })
);

yargs.command(
  "develop",
  "Starts a new frontend module development session with the OpenMRS app shell.",
  (argv) =>
    argv
      .number("port")
      .default("port", 8080)
      .describe("port", "The port where the dev server should run.")
      .number("host")
      .default("host", "localhost")
      .describe("host", "The host name or IP for the server to use.")
      .string("backend")
      .default("backend", "https://dev3.openmrs.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .string("add-cookie")
      .default("add-cookie", "")
      .describe("add-cookie", "Additional cookies to provide when proxying.")
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
      .array("sources")
      .default("sources", ["."])
      .describe(
        "sources",
        "Runs the projects from the provided source directories. Can be used multiple times."
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
      configUrls: args["config-url"],
      ...args,
      importmap: proxyImportmap(
        await mergeImportmap(
          await getImportmap(args.importmap, args.port),
          (args.sources[0] as string | boolean) !== false &&
            (await runProject(
              args.port,
              args["shared-dependencies"],
              args.sources
            )),
          args.backend,
          args.spaPath
        ),
        args.backend,
        args.host,
        args.port
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
      .string("registry")
      .default("registry", "https://registry.npmjs.org/")
      .describe("registry", "The NPM registry used for getting the packages.")
      .boolean("fresh")
      .describe(
        "fresh",
        "Determines if the output directory should be cleaned before the run."
      )
      .boolean("support-offline")
      .describe(
        "support-offline",
        "Determines if a service worker should be installed for offline support."
      )
      .default("support-offline", true)
      .string("build-config")
      .describe("build-config", "Path to a SPA build config JSON")
      .string("spa-path")
      .default("spa-path", "/openmrs/spa/")
      .describe("spa-path", "The path of the application on the target server.")
      .string("page-title")
      .default("page-title", "OpenMRS")
      .describe(
        "page-title",
        "The title of the web app usually displayed in the browser tab."
      )
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
        "The URL to a frontend configuration. Can be used multiple times. Resolved by the client during initialization."
      )
      .array("config-path")
      .default("config-path", [])
      .describe(
        "config-path",
        "The path to a frontend configuration file. Can be used multiple times. The file is copied directly into the build directory."
      )
      .string("importmap")
      .default("importmap", "importmap.json")
      .describe(
        "importmap",
        "The import map to use. Can be a path to an import map to be taken literally, an URL, or a fixed JSON object."
      )
      .boolean("download-coreapps")
      .default("download-coreapps", false)
      .describe(
        "download-coreapps",
        "Downloads and bundles the core apps. For cases where the core apps are not in the import map."
      ),
  async (args) =>
    runCommand("runBuild", {
      configUrls: args["config-url"],
      configPaths: args["config-path"].map((p) => resolve(process.cwd(), p)),
      ...args,
      importmap: args.importmap,
      buildConfig:
        args["build-config"] && resolve(process.cwd(), args["build-config"]),
      target: resolve(process.cwd(), args.target),
    })
);

yargs.command(
  "assemble",
  "Assembles an import map incl. all required resources.",
  (argv) =>
    argv
      .option("target", {
        default: "dist",
        description:
          "The target directory where the gathered artifacts will be stored.",
        type: "string",
        coerce: (arg) => resolve(process.cwd(), arg),
      })
      .option("registry", {
        default: "https://registry.npmjs.org/",
        description: "The NPM registry used for getting the packages.",
        type: "string",
        coerce: (arg) => trimEnd(arg, "/"),
      })
      .option("config", {
        default: "spa-build-config.json",
        description: "Path to a SPA build config JSON.",
        type: "string",
        coerce: (arg) => resolve(process.cwd(), arg),
      })
      .option("fresh", {
        default: false,
        description:
          "Determines if the output directory should be cleaned before the run.",
        type: "boolean",
      })
      .option("manifest", {
        default: false,
        description: "Whether to output a manifest",
        type: "boolean",
      })
      .option("mode", {
        choices: ["config", "survey"],
        default: "survey",
        description:
          "The source of the frontend modules to assemble. `config` uses a configuration file specified via `--config`. `survey` starts an interactive command-line survey.",
        type: "string",
      }),
  (args) => runCommand("runAssemble", args)
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
      .default("backend", "https://dev3.openmrs.org/")
      .describe("backend", "The backend to proxy API requests to.")
      .string("add-cookie")
      .default("add-cookie", "")
      .describe("add-cookie", "Additional cookies to provide when proxying.")
      .boolean("open")
      .default("open", false)
      .describe("open", "Immediately opens the SPA page URL in the browser."),
  (args) =>
    runCommand("runStart", {
      ...args,
    })
);

yargs
  .epilog(
    "The SPA build config JSON is a JSON file, typically `frontend.json`, which defines parameters for the `build` and `assemble` " +
      "commands. The keys used by `build` are:\n" +
      "  `apiUrl`, `spaPath`, `configPaths`, `configUrls`, `importmap`, `pageTitle`, and `supportOffline`;\n" +
      "each of which is equivalent to the corresponding command line argument (see `openmrs build --help`). " +
      "Multiple values provided to `configPaths` and `configUrls` shoud be comma-separated.\n" +
      "The keys used by `assemble` are:\n" +
      "  frontendModules  \tAn object which specifies which frontend modules to include. It should have package names " +
      "for keys and versions for values.\n" +
      "  publicUrl  \tThe URL at which the frontend modules will be made available. Can be relative to the importmap. " +
      "Defaults to `.` (which means they will be colocated with the import map).\n\n" +
      "For more information visit https://github.com/openmrs/openmrs-esm-core."
  )
  .help()
  .demandCommand()
  .strict().argv;
