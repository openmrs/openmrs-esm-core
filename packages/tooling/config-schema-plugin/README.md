# @openmrs/config-schema-plugin

A webpack and rspack plugin that turns the configuration schemas a frontend module declares at runtime into a static
`config-schema.json` build artifact. `openmrs assemble` merges these artifacts into the routes registry, so the app
shell knows every module's configuration schema before loading any module.

## Usage

Modules built with `@openmrs/rspack-config` or `@openmrs/webpack-config` already use this plugin; there is nothing to
set up. To add it to some other bundler config:

```js
const { ConfigSchemaPlugin } = require('@openmrs/config-schema-plugin');

new ConfigSchemaPlugin({
  moduleName: '@openmrs/esm-example-app', // the module's package name
  root: __dirname, // the module's package root
  srcFile: resolve(__dirname, 'src/index.ts'), // the module's entry point
  timeout: 60_000, // optional: how long `startupApp()` may run, in milliseconds
});
```

The config also needs to expose `./config-validators` through Module Federation. `getConfigSchemaPaths(root)` returns
the file to expose as `configValidatorsExpose`.

## What it produces

- **`config-schema.json`**, next to `routes.json` in the build output. It holds the module's own schema under
  `configurationSchema` and its extensions' schemas under `extensionConfigurationSchemas`. A module that declares no
  configuration gets no artifact.
- **A `./config-validators` entry point**, from which the framework loads custom validators by name without loading the
  rest of the module.

Built-in validators are written as references, such as `{ "type": "oneOf", "args": [["a", "b"]] }`. Custom validators
are written as `{ "type": "custom", "export": "<name>" }`, naming an export of `./config-validators`.

## Writing a schema that can be extracted

The plugin builds the module for Node and runs its `startupApp()` against a stand-in for `@openmrs/esm-framework` that
records every `defineConfigSchema` and `defineExtensionConfigSchema` call. Schemas can therefore be assembled from
imported constants, spreads and shared sub-schemas, as long as:

- **Module-scope code and `startupApp()` finish without the network or a real DOM.** A minimal DOM is provided, but
  code that waits on a request times out and fails the build.
- **Custom validators are either named exports or self-contained.** A validator exported from
  `src/config-validators.ts` (or `.js`, etc.) is referenced by its export name. A `validator(...)` written inline in a
  schema is copied into the `./config-validators` entry point, so it may only use its own parameters and standard
  globals. One that reads anything else from the module fails the build; move it to `src/config-validators.ts`.
- **Defaults are JSON-representable:** strings, numbers, booleans, null, arrays or plain objects. A `_default:
  undefined` is left out and restored by the framework, but `undefined` inside a default, class instances such as
  `Date`, and circular references fail the build.
- **A module only declares its own schema.** Calling `defineConfigSchema` for a different module is a warning; that
  schema is not part of the artifact and only takes effect once the declaring module loads.

`process.env.NODE_ENV` and other compile-time definitions take the values of the build being run, so a default derived
from them matches the mode the module was built in.

## Writing the schema by hand

A module with a `src/config-schema.json` skips extraction: the file is copied to the build output as-is, and
`src/config-validators.ts`, if present, is exposed directly as `./config-validators`. Custom validators in a
hand-written schema refer to its named exports.

## Changes to the module's bundle

Once a schema is extracted, the plugin rewrites the entry point's declarations:
`defineConfigSchema(moduleName, schema)` becomes `requireStaticConfigSchema(moduleName)`, and likewise for extension
schemas. Unless something else references it, the schema object can then be dropped from the bundle. If the routes
registry does not have the schema the module expected, the module logs an error at startup and its configuration is
empty. Calls the plugin cannot match with
certainty are left as they are, and keep working because the configuration system prefers the registry's copy.

## Caching

Extraction results are cached in the module's `node_modules/.cache/openmrs`. The cache is keyed on the plugin version,
the module name, the build mode, and the size and modification time of every file under `src/`. Changes inside
`node_modules` are not detected, so a schema built from a dependency's constants needs that directory cleared after the
dependency is upgraded.

## How the artifact is used

- `openmrs assemble` merges each module's `config-schema.json` into the routes registry. Pass `--strict-schemas` to fail
  when an artifact cannot be read or two modules define a schema for the same extension.
- `openmrs develop` and the app shell's dev server serve the schemas of the modules being developed.
- The app shell installs every schema from the routes registry at startup, before loading any module.
