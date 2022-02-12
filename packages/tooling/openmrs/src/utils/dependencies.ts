import { basename, dirname } from "path";

export function getSharedDependencies() {
  return require("@openmrs/esm-app-shell/dependencies.json");
}

export function getMainBundle(project: any) {
  const file = project.browser || project.module || project.main;
  return {
    path: file,
    name: basename(file),
    dir: dirname(file),
  };
}
