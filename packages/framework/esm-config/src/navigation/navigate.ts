/** @module @category Navigation */
import { navigateToUrl } from "single-spa";
import { interpolateUrl } from "./interpolate-string";
import type {} from "@openmrs/esm-globals";

function trimTrailingSlash(str: string) {
  return str.replace(/\/$/, "");
}

export type TemplateParams = { [key: string]: string };

export interface NavigateOptions {
  to: string;
  templateParams?: TemplateParams;
}

/**
 * Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths
 *
 * Example usage:
 * ```js
 * const config = useConfig();
 * const submitHandler = () => {
 *   navigate({ to: config.links.submitSuccess });
 * };
 * ```
 *
 * @param to The target path or URL. Supports templating with 'openmrsBase', 'openmrsSpaBase',
 * and any additional template parameters defined in `templateParams`.
 * For example, `${openmrsSpaBase}/home` will resolve to `/openmrs/spa/home`
 * for implementations using the standard OpenMRS and SPA base paths.
 * If `templateParams` contains `{ foo: "bar" }`, then the URL `${openmrsBase}/${foo}`
 * will become `/openmrs/bar`.
 */
export function navigate({ to, templateParams }: NavigateOptions): void {
  const openmrsSpaBase = trimTrailingSlash(window.getOpenmrsSpaBase());
  const target = interpolateUrl(to, templateParams);
  const isSpaPath = target.startsWith(openmrsSpaBase);

  if (isSpaPath) {
    navigateToUrl(target);
  } else {
    window.location.assign(target);
  }
}
