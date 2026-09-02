import type { Federation, ModuleFederationRuntimePlugin } from '@module-federation/runtime-core';
import type { Shared, ShareScopeMap } from '@module-federation/runtime-core/types';

/**
 * Plumbing for Module Federation runtime plugins registered by the app shell.
 */

/** Providers of a single shared module, keyed by the version each one provides. */
export type ShareVersionMap = ShareScopeMap[string][string];

export type { ModuleFederationRuntimePlugin, Shared };

/**
 * The Module Federation runtime's global bookkeeping, or `undefined` if the runtime was never
 * published — in which case `federation-runtime.ts` has already reported it and no frontend module
 * is going to start anyway. Module Federation declares the global as always present, which is only
 * true once its runtime has loaded.
 */
export function getFederationGlobal(): Federation | undefined {
  return typeof __FEDERATION__ === 'undefined' ? undefined : __FEDERATION__;
}

function isLoaded(entry: Shared) {
  return Boolean(entry.loaded || typeof entry.lib === 'function');
}

/**
 * Picks the provider already backing the page, or the first one if none has loaded yet.
 *
 * @param providers Candidate providers of one shared module. Must not be empty.
 */
export function preferLoadedProvider(providers: Array<Shared>) {
  return providers.find(isLoaded) ?? providers[0];
}

/**
 * Registers a runtime plugin with every federation instance in the page, present and future.
 *
 * Call before any frontend module is loaded.
 *
 * @param plugin The plugin to register. Registering a name twice is a no-op.
 * @returns Whether the plugin was registered.
 */
export function registerFederationPlugin(plugin: ModuleFederationRuntimePlugin) {
  const federation = getFederationGlobal();
  const globalPlugins = federation?.__GLOBAL_PLUGIN__;

  if (!globalPlugins || globalPlugins.some((registered) => registered.name === plugin.name)) {
    return false;
  }

  globalPlugins.push(plugin);
  federation?.__INSTANCES__?.forEach((instance) => instance.registerPlugins([plugin]));
  return true;
}
