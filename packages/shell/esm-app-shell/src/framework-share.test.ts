// Reproduces the duplicate-framework bug against Module Federation's own resolver rather than a model
// of it, so the tests still mean something if Module Federation changes how it picks a provider. Each
// "without the pin" case is the bug: the resolver hands the consuming module a provider other than the
// app shell's, and taking that provider loads a second copy of the framework — a second store
// registry, a second config store, a second set of extensions, and roughly a megabyte of duplicated
// download. Nothing throws when that happens, which is why it needs a test rather than a smoke check.
import { getRegisteredShare } from '@module-federation/runtime-core';
import type { Shared, ShareScopeMap } from '@module-federation/runtime-core/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ResolvedShare } from './federation-plugins';
import { pinFrameworkToAppShell } from './framework-share';

const appShell = '@openmrs/esm-app-shell';
const frontendModule = '@openmrs/esm-ward-app';
const publicKey = '@openmrs/esm-framework';
const internalKey = '@openmrs/esm-framework/src/internal';
const pluginName = 'openmrs-pin-framework-to-app-shell';

type VersionMap = Record<string, Shared>;

function provider(version: string, from: string, { loaded = false } = {}) {
  return {
    version,
    from,
    loaded: loaded || undefined,
    loading: null,
    lib: null,
    get: () => Promise.resolve(() => ({})),
    scope: ['default'],
    strategy: 'version-first',
    useIn: [],
    deps: [],
    shareConfig: { requiredVersion: `^${version}`, singleton: true, eager: false, strictVersion: false },
  } as unknown as Shared;
}

/** What a published frontend module asks for, as its remote entry declares it. */
function consumer(pkgName = publicKey) {
  return {
    from: frontendModule,
    version: '10.0.1-pre.5263',
    scope: ['default'],
    strategy: 'version-first',
    shareConfig: { requiredVersion: '10.x', singleton: true, eager: false, strictVersion: false },
  } as unknown as Shared & { pkgName?: string };
}

function federationGlobal() {
  return globalThis.__FEDERATION__ as unknown as {
    __GLOBAL_PLUGIN__: Array<{ name: string; resolveShare?: (args: unknown) => unknown }>;
    __INSTANCES__: Array<{ registerPlugins: (plugins: Array<unknown>) => void }>;
  };
}

/**
 * Sets the page up the way `initializeSpa` does: the app shell has registered its framework and
 * nothing else has loaded yet, so this is the only moment the app shell's own entry is identifiable.
 * The two keys share one version map because `initializeSpa` aliases them onto each other.
 */
function pinWithAppShellProvider() {
  const appShellEntry = provider('10.0.0', appShell);
  const versions: VersionMap = { '10.0.0': appShellEntry };
  pinFrameworkToAppShell({ [publicKey]: versions, [internalKey]: versions });
  return { appShellEntry, versions };
}

/** Runs the real resolver, with the registered plugin tapped into `resolveShare` or not. */
function resolveShareResult(versions: VersionMap, { pinned }: { pinned: boolean }) {
  const plugin = federationGlobal().__GLOBAL_PLUGIN__.find((candidate) => candidate.name === pluginName);
  const resolveShare = pinned ? { emit: (args: unknown) => plugin?.resolveShare?.(args) } : { emit: () => undefined };
  const shareScopeMap = { default: { [publicKey]: versions, [internalKey]: versions } } as unknown as ShareScopeMap;

  return getRegisteredShare(shareScopeMap, publicKey, consumer(), resolveShare as never);
}

function resolveProvider(versions: VersionMap, options: { pinned: boolean }) {
  return resolveShareResult(versions, options)?.shared;
}

describe('pinning @openmrs/esm-framework to the app shell', () => {
  // Importing the runtime defines `__FEDERATION__` as non-configurable, so it can be reassigned but
  // not removed. Each test gets an empty one and the real value goes back afterwards.
  const runtimeFederation = globalThis.__FEDERATION__;

  beforeEach(() => {
    (globalThis as Record<string, unknown>).__FEDERATION__ = { __GLOBAL_PLUGIN__: [], __INSTANCES__: [] };
  });

  afterEach(() => {
    (globalThis as Record<string, unknown>).__FEDERATION__ = runtimeFederation;
  });

  it('leaves a healthy page alone: the app shell already wins when its copy loaded first', () => {
    // Documents why this is a latent hazard rather than a constant failure — and why a smoke test
    // would never catch it.
    const { appShellEntry, versions } = pinWithAppShellProvider();
    appShellEntry.loaded = true;
    versions['10.0.1-pre.5263'] = provider('10.0.1-pre.5263', frontendModule);

    expect(resolveProvider(versions, { pinned: false })?.from).toBe(appShell);
    expect(resolveProvider(versions, { pinned: true })?.from).toBe(appShell);
  });

  it("takes the module's own higher version while the app shell's copy is still loading", () => {
    const { appShellEntry, versions } = pinWithAppShellProvider();
    appShellEntry.loading = Promise.resolve() as never;
    versions['10.0.1-pre.5263'] = provider('10.0.1-pre.5263', frontendModule);

    // `version-first` does not count "loading" as loaded, so the higher version wins.
    expect(resolveProvider(versions, { pinned: false })?.from).toBe(frontendModule);
    expect(resolveProvider(versions, { pinned: true })?.from).toBe(appShell);
  });

  it("takes the module's own copy when it was registered first, even against a loaded app shell", () => {
    // `findVersion` seeds its reduce with the first key unconditionally and then only asks whether
    // *that* entry is loaded, so an unloaded module entry sitting first is never displaced.
    const { appShellEntry } = pinWithAppShellProvider();
    appShellEntry.loaded = true;
    const reordered: VersionMap = {
      '10.0.1-pre.5263': provider('10.0.1-pre.5263', frontendModule),
      '10.0.0': appShellEntry,
    };

    expect(resolveProvider(reordered, { pinned: false })?.from).toBe(frontendModule);
    expect(resolveProvider(reordered, { pinned: true })?.from).toBe(appShell);
  });

  it("takes the module's own copy after it takes over the app shell's slot at the same version", () => {
    // Any locally built module provides the workspace version, which is the app shell's own, so
    // `register` replaces the app shell's not-yet-loaded entry and inherits its `from`. Nothing
    // identifying the app shell is left in the scope, which is why the pin holds the entry itself.
    const { appShellEntry, versions } = pinWithAppShellProvider();
    versions['10.0.0'] = provider('10.0.0', frontendModule);

    expect(resolveProvider(versions, { pinned: false })?.from).toBe(frontendModule);

    const pinnedTo = resolveProvider(versions, { pinned: true });
    expect(pinnedTo?.from).toBe(appShell);
    expect(pinnedTo).toBe(appShellEntry);
  });

  it('pins a module whose federation instance has a share scope of its own', () => {
    // Divergent scopes hold only the module's own provider, so there is nothing to look up.
    const { appShellEntry } = pinWithAppShellProvider();
    const divergent: VersionMap = { '10.0.1-pre.5263': provider('10.0.1-pre.5263', frontendModule) };

    expect(resolveProvider(divergent, { pinned: false })?.from).toBe(frontendModule);
    expect(resolveProvider(divergent, { pinned: true })).toBe(appShellEntry);
  });

  it("prefers whichever of the app shell's providers is already backing the page", () => {
    const older = provider('10.0.0', appShell);
    const newer = provider('10.0.1', appShell, { loaded: true });
    const versions: VersionMap = { '10.0.0': older, '10.0.1': newer };
    pinFrameworkToAppShell({ [publicKey]: versions, [internalKey]: versions });

    expect(resolveProvider(versions, { pinned: true })).toBe(newer);
  });

  it('returns a provider that every Module Federation runtime generation can use', () => {
    // The plugin is registered globally, so it is also applied to the runtime embedded in a frontend
    // module built before the app shell started publishing one. Those runtimes use the resolver's
    // return value as the share entry itself and immediately reach for `get`; 2.x instead destructures
    // `{ shared, useTreesShaking }`. Returning only the newer shape kills the older modules with
    // `get is not a function`, which is the compatibility the app shell promises them.
    const { appShellEntry, versions } = pinWithAppShellProvider();
    versions['10.0.1-pre.5263'] = provider('10.0.1-pre.5263', frontendModule);

    const resolved = resolveShareResult(versions, { pinned: true }) as unknown as ResolvedShare;

    // What 2.x reads.
    expect(resolved.shared).toBe(appShellEntry);
    expect(resolved.useTreesShaking).toBe(false);

    // What an older runtime reads.
    expect(resolved).toBe(appShellEntry);
    expect(typeof resolved.get).toBe('function');

    // `setShared` copies a share entry with a rest-spread, so neither key may be enumerable or it
    // ends up stored in the share scope.
    const { version, scope, ...shareInfo } = resolved;
    expect(shareInfo).not.toHaveProperty('shared');
    expect(shareInfo).not.toHaveProperty('useTreesShaking');
  });

  it('leaves every other shared module to Module Federation', () => {
    // The plugin is applied to every federation instance in the page, so it sees every resolution.
    pinWithAppShellProvider();
    const plugin = federationGlobal().__GLOBAL_PLUGIN__.find((candidate) => candidate.name === pluginName);
    const args = { pkgName: 'react', scope: 'default', resolver: () => 'untouched' };

    expect(plugin?.resolveShare?.(args)).toBe(args);
    expect(args.resolver()).toBe('untouched');
  });

  it('reaches federation instances that already exist', () => {
    // The app shell's own instance is built by the webpack runtime before any of this code runs, so
    // the global plugin list alone would miss it.
    const registered: Array<Array<unknown>> = [];
    federationGlobal().__INSTANCES__.push({ registerPlugins: (plugins) => registered.push(plugins) });

    pinWithAppShellProvider();

    expect(registered).toHaveLength(1);
    expect((registered[0][0] as { name: string }).name).toBe(pluginName);
  });

  it('registers once, however many times it is called', () => {
    pinWithAppShellProvider();
    pinWithAppShellProvider();

    expect(federationGlobal().__GLOBAL_PLUGIN__.filter((p) => p.name === pluginName)).toHaveLength(1);
  });

  it('leaves resolution alone when the app shell provides no framework at all', () => {
    const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      pinFrameworkToAppShell({});

      expect(federationGlobal().__GLOBAL_PLUGIN__).toHaveLength(0);
      expect(consoleMock).toHaveBeenCalledOnce();
      expect(consoleMock).toHaveBeenCalledWith(
        'The app shell has not registered @openmrs/esm-framework as a shared module, so frontend modules may each load their own copy of the framework. This is a bug in the app shell build.',
      );
    } finally {
      consoleMock.mockReset();
    }
  });
});
