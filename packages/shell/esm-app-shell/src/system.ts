/// <reference path="../../../../node_modules/webpack/module.d.ts" />
import "import-map-overrides";
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
        async (value): Promise<[string, System.Module]> => {
          // first check if this is a new module-type -> then we have a remote-entry first
          if ("init" in value && "get" in value) {
            await __webpack_init_sharing__("default");
            await value.init(__webpack_share_scopes__.default);
            const factory = await value.get("app");
            const newValue = factory();
            return [name, newValue];
          }

          // otherwise we can directly return
          return [name, value];
        },
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

        if (typeof content === "function") {
          _exports("__esModule", true);
          _exports("default", content);
        } else if (typeof content === "object") {
          if (!("default" in content)) {
            _exports("default", content);
          }
        }
      }
    },
  }));
}
