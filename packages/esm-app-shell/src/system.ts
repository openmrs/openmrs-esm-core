import "import-map-overrides/dist/import-map-overrides";
import "systemjs/dist/system";
import "systemjs/dist/extras/amd";
import "systemjs/dist/extras/named-exports";
import "systemjs/dist/extras/named-register";
import "systemjs/dist/extras/use-default";
import type { ModuleResolver } from "./types";

/**
 * Loads all provided modules by their name. Performs a
 * SystemJS import.
 * @param modules The names of the modules to resolve.
 */
export function loadModules(modules: Array<string>) {
  return Promise.all(
    modules.map((name) =>
      System.import(name).then(
        (value): [string, System.Module] => [name, value],
        (error): [string, System.Module] => {
          console.error("Failed to load module", name, error);
          return [name, {}];
        }
      )
    )
  );
}

export function registerModules(modules: Record<string, ModuleResolver>) {
  Object.keys(modules).forEach((name) => registerModule(name, modules[name]));
}

export function registerModule(name: string, resolve: ModuleResolver) {
  System.register(name, [], (_exports) => ({
    execute() {
      const content = resolve();

      if (content instanceof Promise) {
        return content.then((innerContent) => _exports(innerContent));
      } else {
        _exports(content);
      }
    },
  }));
}
