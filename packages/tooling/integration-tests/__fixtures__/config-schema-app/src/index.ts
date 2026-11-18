// A module whose configuration is declared the ordinary way, in `startupApp()`.
//
// The awkward parts are deliberate; extraction has to survive each in real modules: webpack-only
// `require.context`, a stylesheet import, a schema built from an imported constant, a DOM event at
// module scope, and an async `startupApp` that declares its schemas after an await.
import { defineConfigSchema, defineExtensionConfigSchema, validator, validators, Type } from '@openmrs/esm-framework';
import { validateGreeting } from './config-validators';
import './styles.scss';

const moduleName = '@openmrs/esm-config-schema-fixture-app';

const sharedLabel = {
  _type: Type.String,
  _default: 'hello',
  _description: 'A label',
  _validators: [validators.nonEmptyString],
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

// Dispatched at module scope, so extraction has to run this. Node and happy-dom each define an
// `Event`, and dispatching one against a window built from the other throws.
window.dispatchEvent(new CustomEvent('fixture-app-loaded', { detail: { moduleName } }));

export async function startupApp() {
  // A timer rather than a resolved promise, so extraction must really wait.
  await new Promise((resolve) => setTimeout(resolve, 0));

  defineConfigSchema(moduleName, {
    label: sharedLabel,
    // Both of these are replaced at compile time, so extraction records whatever the build defines
    // them as. The build under test is a production one, and `process.env.FRAMEWORK_VERSION` comes
    // from a `DefinePlugin` the real bundler config adds.
    environment: { _type: Type.String, _default: process.env.NODE_ENV ?? 'undefined' },
    frameworkVersion: { _type: Type.String, _default: process.env.FRAMEWORK_VERSION ?? 'undefined' },
    count: { _type: Type.Number, _default: 2, _validators: [validators.greaterThan(0)] },
    nested: {
      mode: { _type: Type.String, _default: 'a', _validators: [validators.oneOf(['a', 'b'])] },
    },
    _validators: [validateGreeting],
  });

  defineExtensionConfigSchema('fixture-extension', {
    size: {
      _type: Type.Number,
      _default: 1,
      _validators: [validator((value: unknown) => typeof value === 'number', 'must be a number')],
    },
  });
}
