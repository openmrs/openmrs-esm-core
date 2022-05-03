import "import-map-overrides";
import "systemjs/dist/system";
import "systemjs/dist/extras/amd";
import "systemjs/dist/extras/named-exports";
import "systemjs/dist/extras/named-register";
import "systemjs/dist/extras/use-default";
import type { ModuleResolver } from "./types";

function slugify(name) {
  return name.replace(/[\/\-@]/g, "_");
}

function loadScript(url: string, resolve: (value: unknown) => void, reject: () => void) {
  if (!document.head.querySelector(`script[src="${url}"]`)) {
    const element = document.createElement("script");
    element.src = url;
    element.type = "text/javascript";
    element.async = true;
    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${url}`);
      resolve(null);
    };

    element.onerror = (ev: ErrorEvent) => {
      console.error(`Dynamic Script Error for ${url}`);
      console.error(ev);
      reject();
    };

    document.head.appendChild(element);
  } else {
    console.log("script already loaded: ", url);
    resolve(null);
  }
}

/**
 * Loads all provided modules by their name. Performs a
 * SystemJS import.
 * @param modules The names of the modules to resolve.
 */
export async function loadModules(modules: Record<string, string>) {
  return Promise.all(Object.entries(modules).map(async ([name, url]) => {
    await new Promise((resolve, reject) => {
      loadScript(url, resolve, reject);
    })
    const app: any = window[slugify(name)];
    console.log(slugify(name), app);
    app.init(__webpack_share_scopes__.default);
    const moduleExports = await app.get("./start");
    console.log(name, moduleExports);
    return [name, moduleExports]
  }));

      // window[name].init(__webpack_share_scopes__.default);
      // window[name].get("./start")  // put the script on the page
      // .then(factory => {
      //   const res = factory()
      //   console.log(res);
      //   return res;
      // });

  // return Promise.all(
  //   modules.map((name) =>
  //     System.import(name).then(
  //       async (value): Promise<[string, System.Module]> => {
  //         // first check if this is a new module-type -> then we have a remote-entry first
  //         if ("init" in value && "get" in value) {
  //           await __webpack_init_sharing__("default");
  //           await value.init(__webpack_share_scopes__.default);
  //           const factory = await value.get("app");
  //           const newValue = factory();
  //           return [name, newValue];
  //         }

  //         // otherwise we can directly return
  //         return [name, value];
  //       },
  //       (error): [string, System.Module] => {
  //         console.error("Failed to load module", name, error);
  //         return [name, {}];
  //       }
  //     )
  //   )
  // );
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
