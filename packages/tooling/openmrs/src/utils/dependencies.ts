import { basename, dirname } from "path";

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
