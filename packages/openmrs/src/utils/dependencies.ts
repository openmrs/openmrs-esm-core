import { basename, dirname } from "path";

export function getSharedDependencies() {
  return [
    "i18next",
    "react",
    "react-dom",
    "react-router-dom",
    "react-i18next",
    "single-spa",
    "@openmrs/esm-api",
    "@openmrs/esm-config",
    "@openmrs/esm-module-config",
    "@openmrs/esm-context",
    "@openmrs/esm-devtools",
    "@openmrs/esm-error-handling",
    "@openmrs/esm-extensions",
    "@openmrs/esm-extension-manager",
    "@openmrs/esm-implementer-tools",
    "@openmrs/esm-styleguide",
    "carbon-components",
    "carbon-icons",
    "rxjs",
  ];
}

export function getMainBundle(project: any) {
  const file = project.browser || project.module || project.main;
  return {
    path: file,
    name: basename(file),
    dir: dirname(file),
  };
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
    const bundle = getMainBundle(project);
    deps[moduleName] = `${host}/node_modules/${moduleName}/${bundle.path}`;
    return deps;
  }, {});
}
