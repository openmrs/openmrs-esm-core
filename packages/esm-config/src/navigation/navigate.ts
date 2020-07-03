import { navigateToUrl } from "single-spa";

/**
 * Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths
 *
 * Example usage:
 * ```js
 * const config = getConfig();
 * const submitHandler = () => {
 *   navigate({ to: config.links.submitSuccess });
 * };
 * ```
 *
 * @param to The target path or URL. Supports templating with 'openmrsBase' and 'openmrsSpaBase'.
 * For example, `${openmrsSpaBase}/home` will resolve to `/openmrs/spa/home`
 * for implementations using the standard OpenMRS and SPA base paths.
 */
export function navigate({ to }: NavigateOptions): void {
  const target = interpolateUrl(to);
  const isSpaPath = target.startsWith(window.getOpenmrsSpaBase());
  if (isSpaPath) {
    const spaTarget = target.replace(
      new RegExp("^" + window.getOpenmrsSpaBase()),
      ""
    );
    navigateToUrl(spaTarget);
  } else {
    window.location.assign(target);
  }
}

/**
 * @internal
 * Interpolates a string with openmrsBase and openmrsSpaBase
 *
 * @param template A string to interpolate
 */
export function interpolateUrl(template: string): string {
  return interpolateString(template, {
    openmrsBase: window.openmrsBase,
    openmrsSpaBase: window.getOpenmrsSpaBase()
  }).replace(/^\/\//, "/"); // remove extra initial slash if present
}

function interpolateString(template: string, params: object): string {
  const names = Object.keys(params);
  return names.reduce(
    (prev, curr) => prev.split("${" + curr + "}").join(params[curr]),
    template
  );
}

type NavigateOptions = {
  to: string;
};

declare global {
  interface Window {
    spaBase: string;
    openmrsBase: string;
    getOpenmrsSpaBase: () => string;
  }
}
