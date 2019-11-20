import { validator } from "./validator";

export const isString = validator(
  val => typeof val === "string",
  "must be a string"
);

export const isBoolean = validator(
  val => typeof val === "boolean",
  "must be a boolean"
);
