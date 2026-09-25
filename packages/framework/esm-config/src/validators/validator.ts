/** @module @category Config Validation */
import type { Validator, ValidatorFunction } from '../types';
import { describeValidatorParts } from './descriptor';

/**
 * Constructs a custom validator.
 *
 * ### Example
 *
 * ```typescript
 * {
 *   foo: {
 *     _default: 0,
 *     _validators: [
 *       validator(val => val >= 0, "Must not be negative.")
 *     ]
 *   }
 * }
 * ```
 * @param validationFunction Takes the configured value as input. Returns true
 *    if it is valid, false otherwise.
 * @param message A string message that explains why the value is invalid. Can
 *    also be a function that takes the value as input and returns a string.
 * @returns A validator ready for use in a config schema
 */
export function validator(
  validationFunction: ValidatorFunction,
  message: string | ((value: any) => string),
): Validator {
  const built: Validator = (value) => {
    if (!validationFunction(value)) {
      if (typeof message === 'function') {
        return message(value);
      } else {
        return message;
      }
    }
  };

  // Lets build tooling lift an inline validator into `./config-validators`: the wrapper can't be
  // written out on its own, but what it closes over can.
  return describeValidatorParts(built, { validationFunction, message });
}
