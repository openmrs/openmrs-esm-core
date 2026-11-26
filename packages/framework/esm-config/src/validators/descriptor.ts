/**
 * How a built-in validator describes the way to rebuild it.
 *
 * @module
 */
import type { Validator, ValidatorDescriptor } from '../types';

/**
 * The key under which a built-in validator carries its {@link ValidatorDescriptor}. Validators are
 * the only functions in a schema, so this is what lets build tooling write one out as data
 * (`{"type": "oneOf", "args": [[...]]}`) and the framework rebuild it.
 *
 * @internal
 */
export const validatorDescriptor = Symbol.for('openmrs.config.validatorDescriptor');

/**
 * Tags a validator with the name and arguments needed to reconstruct it, and returns it.
 *
 * Only for the built-in vocabulary in `validators.ts`. A validator a module builds for itself has
 * no descriptor, which is how tooling tells the two apart.
 *
 * @internal
 */
export function describeValidator(validatorToTag: Validator, type: string, args: Array<unknown> = []): Validator {
  Object.defineProperty(validatorToTag, validatorDescriptor, {
    value: { type, args } satisfies ValidatorDescriptor,
    enumerable: false,
    writable: false,
    configurable: true,
  });

  return validatorToTag;
}

/**
 * Reads the descriptor off a built-in validator, or returns `undefined` for one a module built for
 * itself.
 *
 * @internal
 */
export function getValidatorDescriptor(candidate: unknown): ValidatorDescriptor | undefined {
  if (typeof candidate !== 'function') {
    return undefined;
  }

  return (candidate as unknown as Record<symbol, ValidatorDescriptor | undefined>)[validatorDescriptor];
}

/**
 * The key under which a validator built by {@link validator} carries its `validationFunction` and
 * `message`. Build tooling writes these into the module's `./config-validators` entry point to lift
 * an inline validator out of a schema; the wrapper's own source only reads them from a closure.
 *
 * Stored as references, not source text, so tagging costs nothing at runtime.
 *
 * @internal
 */
export const validatorParts = Symbol.for('openmrs.config.validatorParts');

/** @internal */
export interface ValidatorParts {
  validationFunction: (value: any) => boolean;
  message: string | ((value: any) => string);
}

/** @internal */
export function describeValidatorParts(validatorToTag: Validator, parts: ValidatorParts): Validator {
  Object.defineProperty(validatorToTag, validatorParts, {
    value: parts,
    enumerable: false,
    writable: false,
    configurable: true,
  });

  return validatorToTag;
}

/** @internal */
export function getValidatorParts(candidate: unknown): ValidatorParts | undefined {
  if (typeof candidate !== 'function') {
    return undefined;
  }

  return (candidate as unknown as Record<symbol, ValidatorParts | undefined>)[validatorParts];
}
