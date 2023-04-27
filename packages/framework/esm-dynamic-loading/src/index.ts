/** @module @category Dynamic Loading */
"use strict";
// hack to make the types defined in esm-globals available here
import type {} from "@openmrs/esm-globals";

/**
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
 * const someComponent = loadDynamicExport("@openmrs/esm-template-app", "someComponent")
 * ```
 *
 * This will fetch the named export from the named package and return it, if it exists.
 *
 * @param jsPackage The package to load the export from
 * @param exportName The name of the export (from `index.ts`) to load
 * @param share Indicates the name of the shared module; this is an advanced feature if the package you are loading
 *   doesn't use the default OpenMRS shared module name "./start"
 */
export async function loadDynamicExport<T = any>(
  jsPackage: string,
  exportName: string = "default",
  share: string = "./start"
): Promise<T> {
  if (typeof jsPackage !== "string" || jsPackage.trim().length === 0) {
    const error =
      "Attempted to call loadDynamicExport() without supplying a package to load";
    console.error(error);
    throw new Error(error);
  }

  const jsPackageSlug = slugify(jsPackage);

  if (!window.hasOwnProperty(jsPackageSlug)) {
    const importMap = await window.importMapOverrides.getCurrentPageMap();
    if (!importMap.imports.hasOwnProperty(jsPackage)) {
      const error = `Could not find the package ${jsPackage} defined in the current importmap`;
      console.error(error);
      throw new Error(error);
    }

    await new Promise((resolve, reject) => {
      loadScript(jsPackage, importMap.imports[jsPackage], resolve, reject);
    });
  }

  const container = window[jsPackageSlug] as unknown;
  if (!isFederatedModule(container)) {
    const error = `The global variable ${jsPackageSlug}  does not refer to a federated module`;
    console.error(error);
    throw new Error(error);
  }

  await __webpack_init_sharing__("default");
  container.init(__webpack_share_scopes__.default);

  const factory = await container.get(share);
  const module = factory();

  if (!(typeof module === "object") || module === null) {
    const error = `Container for ${jsPackage} did not return an ESM module as expected`;
    console.error(error);
    throw new Error(error);
  }

  if (!module.hasOwnProperty(exportName)) {
    const error = `The package ${jsPackage} does not have an export named ${exportName}`;
    console.error(error);
    throw new Error(error);
  }

  return module[exportName] as T;
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

/**
 * Appends a `<script>` to the DOM with the given URL.
 */
function loadScript(
  name: string,
  url: string,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void
) {
  if (!document.head.querySelector(`script[src="${url}"]`)) {
    const element = document.createElement("script");
    // Webpack uses this attribute to check whether a module has already
    // been loaded into the application.
    element.setAttribute("data-webpack", slugify(name));
    element.src = url;
    element.type = "text/javascript";
    element.async = true;
    element.onload = () => {
      resolve(null);
    };

    element.onerror = (ev: ErrorEvent) => {
      console.error(`Failed to load script from ${url}`, ev);
      reject(ev.message);
    };

    document.head.appendChild(element);
  } else {
    console.warn("Script already loaded. Not loading it again.", url);
    resolve(null);
  }
}
