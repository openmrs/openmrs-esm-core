/**
 * How a built-in validator describes the way to rebuild it.
 *
 * @module
 */
import type { Validator, ValidatorDescriptor } from '../types';

/**
 * The key under which a built-in validator carries the description of how to reconstruct it.
 *
 * A config schema is otherwise entirely JSON-representable, so validators, the only functions in
 * a schema, are what stops it from being shipped as data. A built-in validator carries this tag
 * so that build tooling can write it out as a reference (`{"type": "oneOf", "args": [[...]]}`)
 * rather than as source, and the framework can reconstruct it from that reference.
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
 * The key under which a module's own validator carries the pieces it was built from.
 *
 * A validator written inline in a schema has no export to refer to, so build tooling lifts it into
 * the module's `./config-validators` entry point by writing its source there. What `_validators`
 * holds is the wrapper {@link validator} returns, whose source reads `validationFunction` and
 * `message` from a closure and so is useless on its own, so the pieces are kept separately.
 *
 * References rather than source text, so that tagging costs nothing at runtime: only the build ever
 * calls `toString` on them.
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
