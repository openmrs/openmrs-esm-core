/** @module @category Config Validation */
import { Validator, ValidatorFunction } from "../types";

export function validator(
  validationFunction: ValidatorFunction,
  message: string
): Validator {
  return (value) => {
    if (!validationFunction(value)) {
      return message;
    }
  };
}
