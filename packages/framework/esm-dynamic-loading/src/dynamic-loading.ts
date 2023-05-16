/** @module @category Dynamic Loading */
"use strict";
// hack to make the types defined in esm-globals available here
import type {} from "@openmrs/esm-globals";

/**
 * @internal
 *
 * Transforms an ESM module name to a valid JS identifier
 *
 * @param name the name of a module
 * @returns An opaque, equivalent JS identifier for the module
 */
export function slugify(name: string) {
  return name.replace(/[\/\-@]/g, "_");
}

/**
 * Loads the named export from a named package. This might be used like:
 *
 * ```js
 * const { someComponent } = importDynamic("@openmrs/esm-template-app")
 * ```
 *
 * @param jsPackage The package to load the export from
 * @param share Indicates the name of the shared module; this is an advanced feature if the package you are loading
 *   doesn't use the default OpenMRS shared module name "./start"
 */
export async function importDynamic<T = any>(
  jsPackage: string,
  share: string = "./start"
): Promise<T> {
  if (typeof jsPackage !== "string" || jsPackage.trim().length === 0) {
    const error =
      "Attempted to call loadDynamicExport() without supplying a package to load";
    console.error(error);
    throw new Error(error);
  }

  const jsPackageSlug = slugify(jsPackage);

  if (!window[jsPackageSlug]) {
    const importMap = await window.importMapOverrides.getCurrentPageMap();
    if (!importMap.imports.hasOwnProperty(jsPackage)) {
      const error = `Could not find the package ${jsPackage} defined in the current importmap`;
      console.error(error);
      throw new Error(error);
    }

    let url = importMap.imports[jsPackage];
    if (url.startsWith("./")) {
      url = window.spaBase + url.substring(1);
    }

    await new Promise((resolve, reject) => {
      loadScript(url, resolve, reject);
    });
  }

  const container = window[jsPackageSlug] as unknown;
  if (!isFederatedModule(container)) {
    const error = `The global variable ${jsPackageSlug}  does not refer to a federated module`;
    console.error(error);
    throw new Error(error);
  }

  container.init(__webpack_share_scopes__.default);

  const factory = await container.get(share);
  const module = factory();

  if (!(typeof module === "object") || module === null) {
    const error = `Container for ${jsPackage} did not return an ESM module as expected`;
    console.error(error);
    throw new Error(error);
  }

  return module as unknown as T;
}

interface FederatedModule {
  init: (scope: typeof __webpack_share_scopes__.default) => void;
  get: (_export: string) => Promise<() => unknown>;
}

function isFederatedModule(a: unknown): a is FederatedModule {
  return (
    typeof a === "object" &&
    a !== null &&
    "init" in a &&
    typeof a["init"] === "function" &&
    "get" in a &&
    typeof a["get"] === "function"
  );
}

// internals to track script loading
// basically, if we're already loading a script, we should wait until the script is loaded
// we use a global to track this
const OPENMRS_SCRIPT_LOADING = "__openmrs_script_loading";

/**
 * Appends a `<script>` to the DOM with the given URL.
 */
function loadScript(
  url: string,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void
) {
  const scriptElement = document.head.querySelector(`script[src="${url}"]`);
  let scriptLoading: Set<String> = window[OPENMRS_SCRIPT_LOADING];
  if (!scriptLoading) {
    scriptLoading = window[OPENMRS_SCRIPT_LOADING] = new Set([]);
  }

  if (!scriptElement) {
    scriptLoading.add(url);
    const element = document.createElement("script");
    element.src = url;
    element.type = "text/javascript";
    element.async = true;
    const loadFn = () => {
      scriptLoading.delete(url);
      element.removeEventListener("load", loadFn);
      resolve(null);
    };
    element.addEventListener("load", loadFn);

    const errFn = (ev: ErrorEvent) => {
      scriptLoading.delete(url);
      console.error(`Failed to load script from ${url}`, ev);
      element.removeEventListener("error", errFn);
      reject(ev.message);
    };
    element.addEventListener("error", errFn);

    document.head.appendChild(element);
  } else {
    if (scriptLoading.has(url)) {
      const loadFn = () => {
        scriptElement?.removeEventListener("load", loadFn);
        resolve(null);
      };
      scriptElement.addEventListener("load", loadFn);

      const errFn = (ev: ErrorEvent) => {
        console.error(`Failed to load script from ${url}`, ev);
        scriptElement?.removeEventListener("error", errFn);
        reject(ev.message);
      };
      scriptElement.addEventListener("error", errFn);
    } else {
      console.warn("Script already loaded. Not loading it again.", url);
      resolve(null);
    }
  }
}
