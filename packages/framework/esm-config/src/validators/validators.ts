/** @module @category Config Validation */
import { validator } from "./validator";

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

    const rx = /\${(.*?)}/g;
    let match = rx.exec(val);

    while (match) {
      if (!allowedParams.includes(match[1])) {
        return false;
      }

      match = rx.exec(val);
    }

    return true;
  }, "Should be a URL or path. The allowed template parameters are " + allowedParams.map((p) => "${" + p + "}").join(", "));
};

/**
 * Verifies that a string contains only the default URL template parameters.
 *
 * @category Navigation
 */
export const isUrl = isUrlWithTemplateParameters([]);

/**
 * Verifies that the value is one of the allowed options.
 * @param allowedValues The list of allowable values
 */
export const oneOf = (allowedValues: Array<any>) => {
  return validator(
    (val) => allowedValues.includes(val),
    `Must be one of the following: '${allowedValues.join("', '")}'.`
  );
};

export const validators = {
  inRange,
  isUrl,
  isUrlWithTemplateParameters,
  oneOf,
};
