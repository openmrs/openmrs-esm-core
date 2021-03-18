import { navigateToUrl } from "single-spa";
import { interpolateUrl } from "./interpolate-string";
import type {} from "@openmrs/esm-framework/src/types";

function trimTrailingSlash(str: string) {
  return str.replace(/\/$/, "");
}

export interface NavigateOptions {
  to: string;
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
    navigateToUrl(target);
  } else {
    window.location.assign(target);
  }
}
