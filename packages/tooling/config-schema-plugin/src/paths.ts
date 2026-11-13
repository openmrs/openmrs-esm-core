import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Where a module's configuration lives on disk, and what the bundler config should do about it.
 *
 * The bundler factories call this while building their configuration object, before any
 * compilation runs. That timing is the reason it answers from the filesystem alone: Module
 * Federation's `exposes` are fixed at that point, so what `./config-validators` points at cannot
 * depend on anything extraction later discovers.
 *
 * @module
 */

/** Extensions a `config-validators` file may have, in resolution order. */
const validatorExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

export interface ConfigSchemaPaths {
  /**
   * A hand-written `src/config-schema.json`. When present it is the schema, and nothing is
   * extracted: the module has opted out of having its schema derived from its code.
   */
  handWrittenSchema?: string;
  /** A hand-written `src/config-validators.*`, whose named exports custom validators refer to. */
  authoredValidators?: string;
  /** Where the generated `./config-validators` entry point goes. */
  generatedValidators: string;
  /**
   * What `./config-validators` should be exposed as.
   *
   * On the extraction path this is always the generated file, even for a module that turns out to
   * have no custom validators at all: what extraction finds is not known yet at the point the
   * exposes are decided, so the target has to exist either way and may simply be empty.
   *
   * On the hand-written path it is the authored file directly, since nothing generates a wrapper
   * around it, and `undefined` when there is no authored file, which is the only case where a
   * module gets no expose.
   */
  configValidatorsExpose?: string;
}

export function getConfigSchemaPaths(root: string): ConfigSchemaPaths {
  const handWrittenSchemaPath = resolve(root, 'src', 'config-schema.json');
  const handWrittenSchema = existsSync(handWrittenSchemaPath) ? handWrittenSchemaPath : undefined;

  const authoredValidators = validatorExtensions
    .map((extension) => resolve(root, 'src', `config-validators${extension}`))
    .find((candidate) => existsSync(candidate));

  const generatedValidators = join(root, 'node_modules', '.cache', 'openmrs', 'config-validators.generated.js');

  return {
    handWrittenSchema,
    authoredValidators,
    generatedValidators,
    // Without extraction there is no generated wrapper, so the authored file is exposed directly,
    // which is what lets a hand-written config-schema.json still reference custom validators.
    configValidatorsExpose: handWrittenSchema ? authoredValidators : generatedValidators,
  };
}
