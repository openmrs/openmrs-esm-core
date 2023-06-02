import { basename, dirname, resolve } from "path";
import { existsSync, readFileSync, statSync } from "fs";
import { inc } from "semver";

export function getSharedDependencies() {
  return require("@openmrs/esm-app-shell/dependencies.json");
}

export function getMainBundle(project: any) {
  const file = project.browser || project.module || project.main;

  if (!Boolean(file)) {
    throw Error(
      "Could not find project to run. If you ran this outside of a directory containing an app, make sure you specify --sources."
    );
  }

  return {
    path: file,
    name: basename(file),
    dir: dirname(file),
  };
}

export function getAppRoutes(
  sourceDirectory: string,
  project: any
): Record<string, unknown> {
  const routesPath = resolve(sourceDirectory, "src", "routes.json");

  if (!existsSync(routesPath)) {
    return {};
  }

  const stats = statSync(routesPath);

  if (!stats.isFile()) {
    return {};
  }

  const json = JSON.parse(readFileSync(routesPath, { encoding: "utf-8" }));

  if (!(typeof json === "object")) {
    return {};
  }

  json["version"] = project.version
    ? inc(project.version, "prerelease", "local")
    : undefined;

  return json;
}
