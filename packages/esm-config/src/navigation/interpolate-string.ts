function trimTrailingSlash(str: string) {
  return str.replace(/\/$/, "");
}

/**
 * @internal
 * Interpolates a string with openmrsBase and openmrsSpaBase
 *
 * @param template A string to interpolate
 */
export function interpolateUrl(template: string): string {
  const openmrsSpaBase = trimTrailingSlash(window.getOpenmrsSpaBase());
  return interpolateString(template, {
    openmrsBase: window.openmrsBase,
    openmrsSpaBase: openmrsSpaBase
  }).replace(/^\/\//, "/"); // remove extra initial slash if present
}

/**
 * Interpolates values of `params` into the `template` string.
 *
 * Useful for additional template parameters in URLs.
 *
 * Example usage:
 * ```js
 * navigate({
 *  to: interpolateString(
 *    config.links.patientChart,
 *    { patientUuid: patient.uuid }
 *  )
 * });
 * ```
 *
 * @param template With optional params wrapped in `${ }`
 * @param params Values to interpolate into the string template
 * @category Navigation
 */
export function interpolateString(template: string, params: object): string {
  const names = Object.keys(params);
  return names.reduce(
    (prev, curr) => prev.split("${" + curr + "}").join(params[curr]),
    template
  );
}
