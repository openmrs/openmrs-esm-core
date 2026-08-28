/* eslint-disable testing-library/render-result-naming-convention -- these tests render extensions, not components */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Parcel, ParcelConfig } from 'single-spa';

const hostParcelName = 'openmrs-extension-host';

vi.mock('single-spa', () => ({ mountRootParcel: vi.fn() }));

vi.mock('./extensions', () => ({
  getExtensionNameFromId: (extensionId: string) => extensionId,
  getExtensionRegistration: () => ({
    name: 'test-extension',
    moduleName: 'test-module',
    meta: {},
    load: () => Promise.resolve(lifecycles),
  }),
}));

vi.mock('./helpers', () => ({ checkStatus: () => true }));

vi.mock('./store', () => ({ updateInternalExtensionStore: vi.fn() }));

const lifecycles = {
  bootstrap: () => Promise.resolve(),
  mount: () => Promise.resolve(),
  unmount: () => Promise.resolve(),
};

/** A stand-in for the external parcel representation single-spa returns. */
function fakeParcel(): Parcel {
  return {
    mount: () => Promise.resolve(),
    unmount: () => Promise.resolve(),
    getStatus: () => 'MOUNTED',
    loadPromise: Promise.resolve(),
    bootstrapPromise: Promise.resolve(),
    mountPromise: Promise.resolve(),
    unmountPromise: Promise.resolve(),
  } as unknown as Parcel;
}

/**
 * Loads a fresh copy of the module under test, which caches the host parcel's mounter in module
 * scope, wired to a fake single-spa whose host parcel either mounts or fails to mount.
 */
async function loadRenderExtension({ hostMountFails = false } = {}) {
  vi.resetModules();

  const { mountRootParcel } = await import('single-spa');
  const hostMountParcel = vi.fn(() => fakeParcel());

  vi.mocked(mountRootParcel).mockImplementation(((config: ParcelConfig, props: Record<string, unknown>) => {
    if ('name' in config && config.name === hostParcelName) {
      if (hostMountFails) {
        return { ...fakeParcel(), mountPromise: Promise.reject(new Error('mount failed')) };
      }

      const mountPromise = Promise.resolve()
        .then(() => (config as { bootstrap: (props: unknown) => Promise<void> }).bootstrap(props))
        .then(() =>
          (config as { mount: (props: unknown) => Promise<void> }).mount({ ...props, mountParcel: hostMountParcel }),
        );

      return { ...fakeParcel(), mountPromise };
    }

    return fakeParcel();
  }) as typeof mountRootParcel);

  const { renderExtension } = await import('./render');

  const mountTestExtension = () =>
    renderExtension(document.createElement('div'), 'test-slot', 'slot-module', 'test-extension#instance');

  return { mountRootParcel: vi.mocked(mountRootParcel), hostMountParcel, mountTestExtension };
}

describe('renderExtension', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('mounts extensions through the host parcel rather than as root parcels', async () => {
    const { mountRootParcel, hostMountParcel, mountTestExtension } = await loadRenderExtension();

    const parcel = await mountTestExtension();

    expect(hostMountParcel).toHaveBeenCalledTimes(1);
    expect(parcel).toBe(hostMountParcel.mock.results[0].value);
    expect(mountRootParcel).toHaveBeenCalledTimes(1);
    expect(mountRootParcel).toHaveBeenCalledWith(
      expect.objectContaining({ name: hostParcelName }),
      expect.objectContaining({ domElement: expect.anything() }),
    );
  });

  it('mounts the host parcel only once, including for concurrent renders', async () => {
    const { mountRootParcel, hostMountParcel, mountTestExtension } = await loadRenderExtension();

    await Promise.all([mountTestExtension(), mountTestExtension(), mountTestExtension()]);
    await mountTestExtension();

    expect(mountRootParcel).toHaveBeenCalledTimes(1);
    expect(hostMountParcel).toHaveBeenCalledTimes(4);
  });

  it('falls back to mounting root parcels if the host parcel cannot be mounted', async () => {
    const { mountRootParcel, hostMountParcel, mountTestExtension } = await loadRenderExtension({
      hostMountFails: true,
    });

    const parcel = await mountTestExtension();

    expect(parcel).not.toBeNull();
    expect(hostMountParcel).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(mountRootParcel).toHaveBeenCalledTimes(2);
    expect(mountRootParcel).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: 'test-slot/test-extension#instance-0' }),
      expect.objectContaining({
        _extensionContext: expect.objectContaining({ extensionId: 'test-extension#instance' }),
      }),
    );

    // a second render must not retry mounting the host parcel
    await mountTestExtension();
    expect(mountRootParcel).toHaveBeenCalledTimes(3);
  });
});
