/**
 * The shape of a module's `config-schema.json` build artifact. Validators are the only functions in
 * a config schema; here they have been replaced by references.
 */

/**
 * A validator as it appears in the artifact: either a reference into the framework's built-in
 * vocabulary, or a reference to a named export of the module's `config-validators` entry point.
 */
export type SerializedValidator = { type: string; args?: Array<unknown> } | { type: 'custom'; export: string };

/** A config schema as it survives JSON. */
export interface SerializedConfigSchema {
  [key: string]: unknown;
  _type?: string;
  _default?: unknown;
  _description?: string;
  _validators?: Array<SerializedValidator>;
  _elements?: SerializedConfigSchema;
}

/** The contents of `config-schema.json`. */
export interface ConfigSchemaArtifact {
  $schema?: string;
  /**
   * The module's own schema. Which module it applies to is determined at assemble time from the
   * package it ships in, so the artifact does not name one.
   */
  configurationSchema?: SerializedConfigSchema;
  /** Schemas for this module's extensions, keyed by extension name. */
  extensionConfigurationSchemas?: Record<string, SerializedConfigSchema>;
}

/** What `startupApp()` declared, as captured by the recording shim. */
export interface RecordedSchemas {
  /** Schemas passed to `defineConfigSchema`, keyed by the module name given. */
  modules: Record<string, unknown>;
  /** Schemas passed to `defineExtensionConfigSchema`, keyed by extension name. */
  extensions: Record<string, unknown>;
}

/**
 * A custom validator written inline in a schema, lifted into the module's `./config-validators`
 * entry point as a named export.
 *
 * The two sources are the arguments the module passed to `validator()`, which the bundler compiles
 * like any other code. Nothing is evaluated from text at runtime.
 */
export interface TransposedValidator {
  /** The export name given to it, which the artifact refers to. */
  name: string;
  /** Source of the predicate. */
  validationFunction: string;
  /** Source of the message: a JSON string literal, or a function's source. */
  message: string;
}

export interface SerializeResult {
  artifact: ConfigSchemaArtifact;
  /** Problems that must fail the build. */
  errors: Array<string>;
  /** A place where the artifact says less than the module does, which an implementer could hit. */
  warnings: Array<string>;
  /** Inline validators lifted into the module's `./config-validators` entry point. */
  transposedValidators: Array<TransposedValidator>;
}
