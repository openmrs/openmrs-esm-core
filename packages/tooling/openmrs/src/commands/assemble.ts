import { copyFile, mkdir, readFile, unlink, writeFile } from "fs/promises";
import { resolve, dirname, basename } from "path";
import { prompt, Question } from "inquirer";
import rimraf from "rimraf";
import axios from "axios";
import pacote from "pacote";
import { logInfo, untar } from "../utils";
import { createReadStream, existsSync } from "fs";

export interface AssembleArgs {
  target: string;
  mode: string;
  config: string;
  registry: string;
  fresh: boolean;
  manifest: boolean;
}

interface NpmSearchResult {
  objects: Array<{
    package: {
      name: string;
      version: string;
    };
  }>;
}

interface AssembleConfig {
  baseDir: string;
  publicUrl: string;
  frontendModules: Record<string, string>;
}

async function readConfig(
  mode: string,
  config: string,
  registry: string
): Promise<AssembleConfig> {
  switch (mode) {
    case "config":
      if (!existsSync(config)) {
        throw new Error(`Could not find the config file "${config}".`);
      }

      logInfo(`Reading configuration ...`);

      return {
        baseDir: dirname(config),
        ...JSON.parse(await readFile(config, "utf8")),
      };
    case "survey":
      logInfo(`Loading available frontend modules ...`);

      const packages = await axios
        .get<NpmSearchResult>(
          `${registry}/-/v1/search?text=keywords:openmrs&size=250`
        )
        .then((res) => res.data)
        .then((res) =>
          res.objects
            .map((m) => ({
              name: m.package.name,
              version: m.package.version,
            }))
            .filter((m) => m.name.endsWith("-app"))
        );
      const questions: Array<Question> = [];

      for (const pckg of packages) {
        questions.push(
          {
            name: pckg.name,
            message: `Include frontend module "${pckg.name}"?`,
            default: false,
            type: "confirm",
          },
          {
            name: pckg.name,
            askAnswered: true,
            message: `Version for "${pckg.name}"?`,
            default: pckg.version,
            type: "string",
            when(ans) {
              return ans[pckg.name];
            },
          } as Question
        );
      }

      const answers = await prompt(questions);

      return {
        baseDir: process.cwd(),
        publicUrl: ".",
        frontendModules: Object.keys(answers)
          .filter((m) => answers[m])
          .reduce((prev, curr) => {
            prev[curr] = answers[curr];
            return prev;
          }, {}),
      };
  }

  return {
    baseDir: process.cwd(),
    frontendModules: {},
    publicUrl: ".",
  };
}

async function downloadPackage(
  cacheDir: string,
  esmName: string,
  esmVersion: string,
  baseDir: string,
  registry: string
) {
  if (esmVersion.startsWith("file:")) {
    const source = resolve(baseDir, esmVersion.substr(5));
    const file = basename(source);
    const target = resolve(cacheDir, file);
    await copyFile(source, target);
    return file;
  } else if (/^https?:\/\//.test(esmVersion)) {
    const response = await axios.get<Buffer>(esmVersion);
    const content = response.data;
    const file = esmName.replace("@", "").replace(/\//g, "-") + ".tgz";
    await writeFile(resolve(cacheDir, file), content);
    return file;
  } else {
    const packageName = `${esmName}@${esmVersion}`;
    const tarManifest = await pacote.manifest(packageName, { registry });
    const tarball = await pacote.tarball(tarManifest._resolved, {
      registry,
      integrity: tarManifest._integrity,
    });

    const filename = `${tarManifest.name}-${tarManifest.version}.tgz`
      .replace(/^@/, "")
      .replace(/\//, "-");

    await mkdir(cacheDir, { recursive: true });
    await writeFile(resolve(cacheDir, filename), tarball);

    return filename;
  }
}

async function extractFiles(sourceFile: string, targetDir: string) {
  await mkdir(targetDir, { recursive: true });
  const packageRoot = "package";
  const rs = createReadStream(sourceFile);
  const files = await untar(rs);
  const packageJson = JSON.parse(
    files[`${packageRoot}/package.json`].toString("utf8")
  );
  const version = packageJson.version ?? "0.0.0";
  const entryModule =
    packageJson.browser ?? packageJson.module ?? packageJson.main;
  const fileName = basename(entryModule);
  const sourceDir = dirname(entryModule);

  Object.keys(files)
    .filter((m) => m.startsWith(`${packageRoot}/${sourceDir}`))
    .filter((m) => !m.endsWith(".map"))
    .forEach(async (m) => {
      const content = files[m];
      const fileName = m.replace(`${packageRoot}/${sourceDir}/`, "");
      const targetFile = resolve(targetDir, fileName);
      await mkdir(dirname(targetFile), { recursive: true });
      await writeFile(targetFile, content);
    });

  await unlink(sourceFile);
  return [fileName, version];
}

export async function runAssemble(args: AssembleArgs) {
  const config = await readConfig(args.mode, args.config, args.registry);
  const importmap = {
    imports: {},
  };
  const versionManifest = {
    frontendModules: {},
  };

  logInfo(`Assembling the importmap ...`);

  const { frontendModules = {}, publicUrl = "." } = config;
  const cacheDir = resolve(process.cwd(), ".cache");

  if (args.fresh && existsSync(args.target)) {
    await new Promise((resolve) => rimraf(args.target, resolve));
  }

  await mkdir(args.target, { recursive: true });

  await Promise.all(
    Object.keys(frontendModules).map(async (esmName) => {
      const esmVersion = frontendModules[esmName];
      const tgzFileName = await downloadPackage(
        cacheDir,
        esmName,
        esmVersion,
        config.baseDir,
        args.registry
      );
      const dirName = tgzFileName.replace(".tgz", "");
      const [fileName, version] = await extractFiles(
        resolve(cacheDir, tgzFileName),
        resolve(args.target, dirName)
      );
      importmap.imports[esmName] = `${publicUrl}/${dirName}/${fileName}`;
      versionManifest.frontendModules[esmName] = version;
    })
  );

  await writeFile(
    resolve(args.target, "importmap.json"),
    JSON.stringify(importmap, undefined, 2),
    "utf8"
  );

  if (args.manifest) {
    await writeFile(
      resolve(args.target, "spa-module-versions.json"),
      JSON.stringify(versionManifest, undefined, 2),
      "utf8"
    );
  }
}
