/**
 * Remote entries built by `@openmrs/rspack-config` or `@openmrs/webpack-config` read the Module
 * Federation runtime from globals instead of embedding a copy each, so the app shell has to publish it.
 *
 * `@module-federation/runtime-core` is published by Module Federation itself, via the runtime plugin
 * that `experiments.provideExternalRuntime` injects. Because it is this build's copy, its compiled-in
 * build identifier and `experiments.optimization` settings are the ones every app's federation instance
 * ends up with. The two helpers below are published here because that doesn't cover them; they hold no
 * cross-build state. `@module-federation/runtime` and `webpack-bundler-runtime` are deliberately not
 * published — they cache a federation instance at module scope, so a remote using the app shell's copy
 * dies with RUNTIME-010.
 */
import * as errorCodes from '@module-federation/error-codes';
import * as sdk from '@module-federation/sdk';

declare global {
  // `var` is what declares a property on `globalThis`; `let`/`const` do not.
   
  var _OPENMRS_FEDERATION_ERROR_CODES: typeof errorCodes;
   
  var _OPENMRS_FEDERATION_SDK: typeof sdk;
   
  var _FEDERATION_RUNTIME_CORE: unknown;
}

/**
 * A function rather than a module side effect so the call can't be tree-shaken away if the app shell
 * ever declares `sideEffects: false`.
 */
export function publishFederationRuntime() {
  globalThis._OPENMRS_FEDERATION_ERROR_CODES = errorCodes;
  globalThis._OPENMRS_FEDERATION_SDK = sdk;

  // Reporting this here means a mis-built app shell says so itself, rather than every app in the
  // distribution claiming the app shell is too old.
  if (typeof globalThis._FEDERATION_RUNTIME_CORE === 'undefined') {
    console.error(
      'The app shell did not publish the Module Federation runtime, so no frontend module will be able ' +
        'to start. This is a bug in the app shell build (see `experiments.provideExternalRuntime`).',
    );
  }
}
