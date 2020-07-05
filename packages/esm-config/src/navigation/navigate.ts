import { navigateToUrl } from "single-spa";
import { interpolateUrl } from "./interpolate-string";

function trimTrailingSlash(str: string) {
  return str.replace(/\/$/, "");
}

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
 * @category Navigation
 */
export function navigate({ to }: NavigateOptions): void {
  const openmrsSpaBase = trimTrailingSlash(window.getOpenmrsSpaBase());
  const target = interpolateUrl(to);
  const isSpaPath = target.startsWith(openmrsSpaBase);
  if (isSpaPath) {
    const spaTarget = target.replace(new RegExp("^" + openmrsSpaBase), "");
    navigateToUrl(spaTarget);
  } else {
    window.location.assign(target);
  }
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
