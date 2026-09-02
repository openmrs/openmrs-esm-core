import {
  findProviderVersion,
  getFederationGlobal,
  registerFederationPlugin,
  type ModuleFederationRuntimePlugin,
  type ShareVersionMap,
} from './federation-plugins';

/**
 * openmrs-pin-framework-to-app-shell
 *
 * This is a runtime Module Federation plugin to induce Module Federation to work as we expect.
 * Specifically, e expect the version of @openmrs/esm-framework used to match the version loaded
 * by the shell regardless of the versions available elsewhere. With Module Fedderation v2's
 * default "version-first" loading strategy, the exact version of a resolution can be changed as
 * new apps are added. This runtime plugin ensures we only ever load the framework from the shell.
 */

const pluginName = 'openmrs-pin-framework-to-app-shell';

/**
 * Both keys name the same providers: the app shell shares the framework under its `/src/internal`
 * entry point, and `initializeSpa` aliases the public name onto it for frontend modules to consume.
 */
const frameworkShareKeys = new Set(['@openmrs/esm-framework', '@openmrs/esm-framework/src/internal']);

/**
 * Makes every consume of `@openmrs/esm-framework` in the page resolve to the copy the app shell
 * provides, regardless of what versions frontend modules offer or what order they registered in.
 *
 * No version check is needed on the way through: the app shell's framework is the one every module
 * in the distribution is meant to run against, so it wins unconditionally. A rule pinning to some
 * other provider could not assume that.
 *
 * Call this once, after `__webpack_init_sharing__` has run and before any frontend module is
 * loaded; later calls are ignored.
 *
 * If the app shell somehow provides no framework at all, resolution is left alone rather than
 * broken — a module falling back to its own copy is better than a module that cannot start.
 *
 * @param shareScope The `default` share scope, i.e. `__webpack_share_scopes__.default`.
 */
export function pinFrameworkToAppShell(shareScope: Record<string, unknown>) {
  if (!getFederationGlobal()) {
    return;
  }

  // Read while the app shell is the only registered provider, so this identifies the app shell
  // without hard-coding its name.
  const provided = shareScope['@openmrs/esm-framework/src/internal'] as ShareVersionMap | undefined;
  const appShellName = Object.values(provided ?? {}).find((entry) => entry?.from)?.from;

  // Paranoia
  if (!appShellName) {
    console.error(
      'The app shell has not registered @openmrs/esm-framework as a shared module, so frontend ' +
        'modules may each load their own copy of the framework. This is a bug in the app shell build.',
    );
    return;
  }

  const plugin: ModuleFederationRuntimePlugin = {
    name: pluginName,
    resolveShare(args) {
      if (!frameworkShareKeys.has(args.pkgName)) {
        return args;
      }

      const versions = args.shareScopeMap[args.scope]?.[args.pkgName];
      const version = versions && findProviderVersion(versions, appShellName);

      if (!versions || !version) {
        return args;
      }

      // The framework is not shared with tree shaking enabled, so there is no shaken variant to pick.
      args.resolver = () => ({ shared: versions[version], useTreesShaking: false });
      return args;
    },
  };

  registerFederationPlugin(plugin);
}
