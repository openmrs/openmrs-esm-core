import { validator } from "./validator";

export const isString = validator(
  val => typeof val === "string",
  "must be a string"
);

export const isNumber = validator(
  val => typeof val === "number",
  "must be a number"
);

export const isBoolean = validator(
  val => typeof val === "boolean",
  "must be a boolean"
);

export const isUuid = validator(
  val =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      val
    ) || /^[0-9a-f]{36}$/i.test(val),
  "must be a valid UUID or a 36-character hexadecimal string"
);

export const isObject = validator(
  val => typeof val === "object" && !Array.isArray(val) && val !== null,
  "must be an object (not an array or null)"
);

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
    "openmrsSpaBase"
  ]);
  return validator(val => {
    const matches = val.matchAll(/\${(.*?)}/g);
    for (let match of matches) {
      if (!allowedParams.includes(match[1])) {
        return false;
      }
    }
    return true;
  }, "the allowed template parameters are " + allowedParams.map(p => "${" + p + "}").join(", "));
};

/**
 * Verifies that a string contains only the default URL template parameters.
 *
 * @category Navigation
 */
export const isUrl = isUrlWithTemplateParameters([]);

export const validators = {
  isString,
  isNumber,
  isBoolean,
  isUuid,
  isObject,
  isUrl,
  isUrlWithTemplateParameters
};
