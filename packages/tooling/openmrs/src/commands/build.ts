import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { getImportmap, loadWebpackConfig, logInfo, untar } from "../utils";
import rimraf from "rimraf";
import { basename, resolve } from "path";
import { execSync } from "child_process";

/* eslint-disable no-console */

export interface BuildArgs {
  target: string;
  registry: string;
  importmap: string;
  spaPath: string;
  fresh?: boolean;
  apiUrl: string;
  pageTitle: string;
  supportOffline?: boolean;
  downloadCoreapps: boolean;
  configUrls: Array<string>;
  configPaths: Array<string>;
  buildConfig?: string;
}

export interface BuildConfig {
  apiUrl: string;
  configUrls: Array<string>;
  configPaths: Array<string>;
  pageTitle: string;
  supportOffline?: boolean;
  importmap: string;
  spaPath: string;
}

function loadBuildConfig(buildConfigPath?: string): BuildConfig {
  if (buildConfigPath) {
    return JSON.parse(readFileSync(buildConfigPath, "utf8"));
  } else {
    return {} as BuildConfig;
  }
}

async function extractFiles(sourceFile: string, targetDir: string) {
  const packageRoot = "package/";
  const rs = createReadStream(sourceFile);
  const files = await untar(rs);
  const packageJson = JSON.parse(
    files[`${packageRoot}package.json`].toString("utf8")
  );
  const entryModule =
    packageJson.browser ?? packageJson.module ?? packageJson.main;

  Object.keys(files)
    .filter(
      (f) =>
        f === "package/package.json" ||
        f.substr(packageRoot.length) === entryModule
    )
    .forEach((f) => {
      const content = files[f];
      const fileName = f.replace(packageRoot, "");
      const targetFile = resolve(targetDir, fileName);
      writeFileSync(targetFile, content);
    });

  unlinkSync(sourceFile);
}

function loadCoreApps(registry: string) {
  /*
   * if the user specified a OMRS_ESM_CORE_APPS_DIR, we assume this has
   * the necessary coreapps; otherwise, we check if there are any coreapps
   * available in the places the webpack configuration will check; if there
   * aren't, we download the apps specified in the app-shell devDependencies
   */
  const appsPath =
    process.env.OMRS_ESM_CORE_APPS_DIR ??
    resolve(require.resolve("@openmrs/esm-app-shell"), "..", "..", "apps");

  let hasApp = false;
  if (existsSync(appsPath) && statSync(appsPath).isDirectory()) {
    hasApp = readdirSync(appsPath).some((entry) => {
      if (statSync(entry).isDirectory()) {
        const packageJson = resolve(entry, "package.json");
        if (existsSync(packageJson) && statSync(packageJson).isFile()) {
          return require(packageJson).name?.endsWith("-app");
        }
      }
    });
  }

  if (!hasApp) {
    logInfo("Fetching core apps...");
    const devDependencies: Record<string, string> =
      require("@openmrs/esm-app-shell/package.json").devDependencies;

    const apps = Object.keys(devDependencies)
      .filter((dep) => dep.endsWith("-app"))
      .map((dep) => [dep, devDependencies[dep]]);

    if (apps.length > 0) {
      const cacheDir = resolve(process.cwd(), ".cache");
      if (!existsSync(cacheDir)) {
        mkdirSync(cacheDir, { recursive: true });
      }
      const coreAppsDir =
        process.env.OMRS_ESM_CORE_APPS_DIR ??
        resolve(process.cwd(), ".cache", "apps");
      rimraf.sync(coreAppsDir);
      mkdirSync(coreAppsDir, { recursive: true });

      apps.forEach(async ([name, version]) => {
        const packageName = `${name}@${version}`;
        const command = `npm pack ${packageName} --registry ${registry}`;
        const result = execSync(command, {
          cwd: cacheDir,
        });

        const tgzFile =
          result.toString("utf8").split("\n").filter(Boolean).pop() ?? "";
        const appDirName = tgzFile.replace(".tgz", "");
        await extractFiles(
          resolve(cacheDir, tgzFile),
          resolve(coreAppsDir, appDirName)
        );
      });

      return coreAppsDir;
    }
  }
}

function addConfigFilesFromPaths(
  configPaths: Array<string>,
  targetDir: string
) {
  for (let configPath of configPaths) {
    const realPath = resolve(configPath);
    copyFileSync(realPath, targetDir + "/" + basename(configPath));
  }
}

export async function runBuild(args: BuildArgs) {
  const webpack = require("webpack");
  const buildConfig = loadBuildConfig(args.buildConfig);
  const configUrls = buildConfig.configUrls || args.configUrls;
  for (let configPath of buildConfig.configPaths || args.configPaths) {
    configUrls.push(basename(configPath));
  }
  const coreAppsDir = args.downloadCoreapps
    ? loadCoreApps(args.registry)
    : undefined;
  const config = loadWebpackConfig({
    importmap: await getImportmap(buildConfig.importmap || args.importmap),
    env: "production",
    apiUrl: buildConfig.apiUrl || args.apiUrl,
    configUrls: configUrls,
    pageTitle: buildConfig.pageTitle || args.pageTitle,
    supportOffline: buildConfig.supportOffline ?? args.supportOffline,
    spaPath: buildConfig.spaPath || args.spaPath,
    coreAppsDir,
  });

  logInfo(`Running build process ...`);

  if (args.fresh && existsSync(args.target)) {
    await new Promise((resolve) => rimraf(args.target, resolve));
  }

  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      path: args.target,
    },
  });

  return await new Promise<void>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(
          stats.toString({
            colors: true,
          })
        );

        addConfigFilesFromPaths(
          buildConfig.configPaths || args.configPaths,
          args.target
        );

        logInfo(`Build finished.`);
        resolve();
      }
    });
  });
}
