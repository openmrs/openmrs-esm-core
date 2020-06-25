import { validator } from "./validator";

export const isString = validator(
  val => typeof val === "string",
  "must be a string"
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

export const validators = { isString, isBoolean, isUuid, isObject };
