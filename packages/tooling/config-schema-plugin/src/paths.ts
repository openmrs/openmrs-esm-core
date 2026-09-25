import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Where a module's configuration lives on disk, and what the bundler config should do about it.
 *
 * Answers from the filesystem alone, because the bundler configs call it before any compilation,
 * when Module Federation's `exposes` are fixed.
 *
 * @module
 */

/** Extensions a `config-validators` file may have, in resolution order. */
const validatorExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

export interface ConfigSchemaPaths {
  /** A hand-written `src/config-schema.json`. When present it is the schema, and nothing is extracted. */
  handWrittenSchema?: string;
  /** A hand-written `src/config-validators.*`, whose named exports custom validators refer to. */
  authoredValidators?: string;
  /** Where the generated `./config-validators` entry point goes. */
  generatedValidators: string;
  /**
   * What `./config-validators` should be exposed as: the generated file when extracting, even if it
   * turns out empty; otherwise the authored file, or `undefined` if there is none.
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
