import { generateFileSizeReport } from "@jsenv/file-size-impact";
import { promises } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packagesDir = resolve(currentDir, "..", "packages");
const manifestConfig = {};
const trackingConfig = {};

async function setPackages(subDir) {
  const dir = resolve(packagesDir, subDir);
  const names = await promises.readdir(dir);

  await Promise.all(
    names.map(async (name) => {
      const p = resolve(dir, name);
      const stat = await promises.stat(p);

      if (stat.isDirectory()) {
        const pj = resolve(p, "package.json");
        const content = await promises.readFile(pj, "utf8");
        const packageName = JSON.parse(content).name;
        manifestConfig[
          `./packages/${subDir}/${name}/dist/*.buildmanifest.json`
        ] = true;
        trackingConfig[packageName] = {
          [`./packages/${subDir}/${name}/dist/*.js`]: true,
          [`./packages/${subDir}/${name}/dist/*.css`]: true,
          [`./packages/${subDir}/${name}/dist/*.map`]: false,
          [`./packages/${subDir}/${name}/dist/*.json`]: false,
        };
      }
    })
  );
}

await setPackages("apps");
await setPackages("shell");

export const fileSizeReport = await generateFileSizeReport({
  log: process.argv.includes("--log"),
  rootDirectoryUrl: new URL("../", import.meta.url),
  manifestConfig,
  trackingConfig,
});
