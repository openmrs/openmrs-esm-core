/** @module @category Config Validation */
import type { Validator } from '../types';
import { describeValidator } from './descriptor';
import { validator } from './validator';

/**
 * Verifies that the value is between the provided minimum and maximum
 *
 * @param min Minimum acceptable value
 * @param max Maximum acceptable value
 * @returns A validator function that checks if a value is within the specified range.
 */
export const inRange = (min: number, max: number) => {
  return describeValidator(
    validator((val) => min <= val && val <= max, `must be between ${min} and ${max}`),
    'inRange',
    [min, max],
  );
};

/**
 * Verifies that a string contains only the default URL template
 * parameters, plus any specified in `allowedTemplateParameters`.
 *
 * @param allowedTemplateParameters To be added to `openmrsBase` and `openmrsSpaBase`
 * @returns A validator function that checks if a URL contains only allowed template parameters.
 * @category Navigation
 */
export const isUrlWithTemplateParameters = (allowedTemplateParameters: Array<string> | readonly string[]) => {
  const allowedParams = allowedTemplateParameters.concat(['openmrsBase', 'openmrsSpaBase']);
  return describeValidator(
    validator(
      (val) => {
        if (!val || typeof val != 'string') {
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
      },
      'Should be a URL or path. The allowed template parameters are ' +
        allowedParams.map((p) => '${' + p + '}').join(', '),
    ),
    'isUrlWithTemplateParameters',
    // The arguments as given, not `allowedParams`: reconstructing from the descriptor calls this
    // same factory, which adds the defaults again.
    [[...allowedTemplateParameters]],
  );
};

/**
 * Verifies that a string contains only the default URL template parameters.
 *
 * @category Navigation
 */
export const isUrl = describeValidator(isUrlWithTemplateParameters([]), 'isUrl');

/**
 * Verifies that the value is one of the allowed options.
 *
 * @param allowedValues The list of allowable values
 * @returns A validator function that checks if a value is in the allowed list.
 */
export const oneOf = (allowedValues: Array<any> | readonly any[]) => {
  return describeValidator(
    validator((val) => allowedValues.includes(val), `Must be one of the following: '${allowedValues.join("', '")}'.`),
    'oneOf',
    [[...allowedValues]],
  );
};

/**
 * Verifies that the value is a number greater than the provided minimum.
 *
 * @param min The value must exceed this; `greaterThan(0)` rejects zero.
 * @returns A validator function that checks if a value exceeds the minimum.
 */
export const greaterThan = (min: number) => {
  return describeValidator(
    validator((val) => typeof val === 'number' && val > min, `must be greater than ${min}`),
    'greaterThan',
    [min],
  );
};

/**
 * Verifies that the value is an array with at least the given number of entries.
 *
 * @param min The fewest entries the array may have
 * @returns A validator function that checks the length of an array.
 */
export const minArrayLength = (min: number) => {
  return describeValidator(
    validator(
      (val) => Array.isArray(val) && val.length >= min,
      `must contain at least ${min} ${min === 1 ? 'item' : 'items'}`,
    ),
    'minArrayLength',
    [min],
  );
};

/**
 * Verifies that the value is a string with at least one non-whitespace character.
 */
export const nonEmptyString: Validator = describeValidator(
  validator((val) => typeof val === 'string' && val.trim().length > 0, 'must not be empty'),
  'nonEmptyString',
);

/**
 * Verifies that the value is a whole number greater than zero.
 */
export const positiveInteger: Validator = describeValidator(
  validator((val) => typeof val === 'number' && Number.isInteger(val) && val > 0, 'must be a positive integer'),
  'positiveInteger',
);

export const validators = {
  greaterThan,
  inRange,
  isUrl,
  isUrlWithTemplateParameters,
  minArrayLength,
  nonEmptyString,
  oneOf,
  positiveInteger,
};
