/**
 * The parts of the configuration system that describe a schema, separated from the parts that
 * resolve one.
 *
 * Everything reachable from here is free of dependencies on the config store, on state management
 * and on the browser, so build tooling can import it to read and write schemas without pulling in
 * a running configuration system. `@openmrs/config-schema-plugin` is the reason this entry point
 * exists; the framework itself uses the ordinary barrel.
 */
export * from './module-config/hydrate-schema';
export * from './types';
export * from './validators/descriptor';
export * from './validators/validator';
export * from './validators/validators';
