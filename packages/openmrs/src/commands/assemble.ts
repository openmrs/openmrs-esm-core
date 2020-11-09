import {
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  mkdirSync,
  createReadStream,
  copyFileSync,
} from "fs";
import { resolve, dirname, basename } from "path";
import { execSync } from "child_process";
import { prompt, Question } from "inquirer";
import { logInfo, untar } from "../utils";
import rimraf from "rimraf";
import axios from "axios";

export interface AssembleArgs {
  target: string;
  mode: string;
  config: string;
  registry: string;
  fresh: boolean;
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
  microfrontends: Record<string, string>;
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
        ...JSON.parse(readFileSync(config, "utf8")),
      };
    case "survey":
      logInfo(`Loading available microfrontends ...`);

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
            message: `Include microfrontend "${pckg.name}"?`,
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
        microfrontends: Object.keys(answers)
          .filter((m) => answers[m])
          .reduce((prev, curr) => {
            prev[curr] = answers[curr];
            return prev;
          }, {}),
      };
  }

  return {
    baseDir: process.cwd(),
    microfrontends: {},
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
    copyFileSync(source, target);
    return file;
  } else if (/^https?:\/\//.test(esmVersion)) {
    const response = await axios.get<Buffer>(esmVersion);
    const content = response.data;
    const file = esmName.replace("@", "").replace(/\//g, "-") + ".tgz";
    writeFileSync(resolve(cacheDir, file), content);
    return file;
  } else {
    const packageName = `${esmName}@${esmVersion}`;
    const command = `npm pack ${packageName} --registry ${registry}`;
    mkdirSync(cacheDir, { recursive: true });
    const result = execSync(command, {
      cwd: cacheDir,
    });
    return result.toString("utf8").split("\n").filter(Boolean).pop() ?? "";
  }
}

async function extractFiles(sourceFile: string, targetDir: string) {
  mkdirSync(targetDir, { recursive: true });
  const packageRoot = "package";
  const rs = createReadStream(sourceFile);
  const files = await untar(rs);
  const packageJson = JSON.parse(
    files[`${packageRoot}/package.json`].toString("utf8")
  );
  const entryModule =
    packageJson.browser ?? packageJson.module ?? packageJson.main;
  const fileName = basename(entryModule);
  const sourceDir = dirname(entryModule);

  Object.keys(files)
    .filter((m) => m.startsWith(`${packageRoot}/${sourceDir}`))
    .forEach((m) => {
      const content = files[m];
      const fileName = m.replace(`${packageRoot}/${sourceDir}/`, "");
      const targetFile = resolve(targetDir, fileName);
      mkdirSync(dirname(targetFile), { recursive: true });
      writeFileSync(targetFile, content);
    });

  unlinkSync(sourceFile);
  return fileName;
}

export async function runAssemble(args: AssembleArgs) {
  const config = await readConfig(args.mode, args.config, args.registry);
  const importmap = {
    imports: {},
  };

  logInfo(`Assembling the importmap ...`);

  const { microfrontends = {}, publicUrl = "." } = config;
  const cacheDir = resolve(process.cwd(), ".cache");

  if (args.fresh && existsSync(args.target)) {
    await new Promise((resolve) => rimraf(args.target, resolve));
  }

  mkdirSync(args.target, { recursive: true });

  await Promise.all(
    Object.keys(microfrontends).map(async (esmName) => {
      const esmVersion = microfrontends[esmName];
      const tgzFileName = await downloadPackage(
        cacheDir,
        esmName,
        esmVersion,
        config.baseDir,
        args.registry
      );
      const dirName = tgzFileName.replace(".tgz", "");
      const fileName = await extractFiles(
        resolve(cacheDir, tgzFileName),
        resolve(args.target, dirName)
      );
      importmap.imports[esmName] = `${publicUrl}/${dirName}/${fileName}`;
    })
  );

  writeFileSync(
    resolve(args.target, "importmap.json"),
    JSON.stringify(importmap, undefined, 2),
    "utf8"
  );
}
