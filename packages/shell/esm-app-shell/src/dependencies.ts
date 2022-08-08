// THIS IS A SHIM TO SUPPORT LOADING esm-form-app ONLY IT SHOULD BE REMOVED
// WHEN esm-form-app IS ABLE TO BE LOADED AS A STANDARD MODULE

// Load @openmrs/esm-framework/src/internal because it is a superset
// of @openmrs/esm-framework. There's no point loading both.
import * as openmrsEsmFrameworkInternal from "@openmrs/esm-framework/src/internal";
import * as rxjs from "rxjs";

export const sharedDependencies = {
  "@openmrs/esm-framework": openmrsEsmFrameworkInternal,
  rxjs,
};

export function registerModules(modules: Record<string, any>) {
  Object.keys(modules).forEach((name) => registerModule(name, modules[name]));
}

function registerModule(name: string, module: any) {
  System.register(name, [], (_exports) => ({
    execute() {
      if (module instanceof Promise) {
        return module.then((innerContent) => _exports(innerContent));
      } else {
        _exports(module);

        if (typeof module === "function") {
          _exports("__esModule", true);
          _exports("default", module);
        } else if (typeof module === "object") {
          if (!("default" in module)) {
            _exports("default", module);
          }
        }
      }
    },
  }));
}
