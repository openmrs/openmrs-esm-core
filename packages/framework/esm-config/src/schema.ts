/**
 * The parts of the configuration system that describe a schema, free of the config store, state
 * management and the browser, so build tooling such as `@openmrs/config-schema-plugin` can read
 * and write schemas. The framework itself uses the ordinary barrel.
 */
export * from './module-config/hydrate-schema';
export * from './types';
export * from './validators/descriptor';
export * from './validators/validator';
export * from './validators/validators';
