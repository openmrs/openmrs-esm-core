import { basename } from "path";

export function getSharedDependencies() {
  return [
    "i18next",
    "react",
    "react-dom",
    "react-router-dom",
    "react-i18next",
    "single-spa",
    "@openmrs/esm-api",
    "@openmrs/esm-error-handling",
    "@openmrs/esm-config",
    "@openmrs/esm-module-config",
    "@openmrs/esm-extensions",
    "@openmrs/esm-extension-manager",
    "@openmrs/esm-styleguide",
    "carbon-components",
    "carbon-icons",
    "rxjs",
  ];
}

export function getMainPath(project: any) {
  return basename(project.browser || project.module || project.main);
}

export function getDependentModules(
  root: string,
  host: string,
  peerDependencies: Record<string, string> = {}
) {
  const appShellShared = getSharedDependencies();
  const mifeExpected = Object.keys(peerDependencies);
  const mifeRequired = mifeExpected.filter(
    (name) => !appShellShared.includes(name)
  );

  return mifeRequired.reduce((deps, moduleName) => {
    const project = require(`${root}/node_modules/${moduleName}/package.json`);
    const path = getMainPath(project);
    deps[moduleName] = `${host}/node_modules/${moduleName}/${path}`;
    return deps;
  }, {});
}
