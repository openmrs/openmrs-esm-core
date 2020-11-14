import { validator } from "./validator";
import matchAll from "string.prototype.matchall";

/**
 * Verifies that the value is between the provided minimum and maximum
 *
 * @param min Minimum acceptable value
 * @param max Maximum acceptable value
 */
export const inRange = (min: number, max: number) => {
  return validator(
    (val) => min <= val && val <= max,
    `must be between ${min} and ${max}`
  );
};

/**
 * Verifies that a string contains only the default URL template
 * parameters, plus any specified in `allowedTemplateParameters`.
 *
 * @param allowedTemplateParameters To be added to `openmrsBase` and `openmrsSpaBase`
 * @category Navigation
 */
export const isUrlWithTemplateParameters = (
  allowedTemplateParameters: string[]
) => {
  const allowedParams = allowedTemplateParameters.concat([
    "openmrsBase",
    "openmrsSpaBase",
  ]);
  return validator((val) => {
    if (!val || typeof val != "string") {
      return false;
    }

    const matches = matchAll(val, /\${(.*?)}/g);
    for (let match of Array.from(matches)) {
      if (!allowedParams.includes(match[1])) {
        return false;
      }
    }
    return true;
  }, "should be a URL or path. The allowed template parameters are " + allowedParams.map((p) => "${" + p + "}").join(", "));
};

/**
 * Verifies that a string contains only the default URL template parameters.
 *
 * @category Navigation
 */
export const isUrl = isUrlWithTemplateParameters([]);

export const validators = {
  inRange,
  isUrl,
  isUrlWithTemplateParameters,
};
