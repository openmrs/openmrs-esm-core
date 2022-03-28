import { validator } from "./validator";

export const isArray = validator(
  (val) => Array.isArray(val),
  "must be an array"
);

export const isBoolean = validator(
  (val) => typeof val === "boolean",
  "must be a boolean"
);

export const isNumber = validator(
  (val) => typeof val === "number",
  "must be a number"
);

export const isString = validator(
  (val) => typeof val === "string",
  "must be a string"
);

export const isObject = validator(
  (val) => typeof val === "object" && !Array.isArray(val) && val !== null,
  "must be an object (not an array or null)"
);

export const isUuid = validator(
  (val) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      val
    ) || /^[0-9a-f]{36}$/i.test(val),
  "must be a valid UUID or a 36-character hexadecimal string"
);
