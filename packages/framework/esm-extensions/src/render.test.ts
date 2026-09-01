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

vi.mock('./store', () => ({
  registerExtensionRendering: vi.fn(),
  unregisterExtensionRendering: vi.fn(),
}));

const lifecycles = {
  bootstrap: () => Promise.resolve(),
  mount: () => Promise.resolve(),
  unmount: () => Promise.resolve(),
};

/**
 * A stand-in for the external parcel representation single-spa returns. single-spa only provides
 * `update()` for a config that has an update lifecycle, so `hasUpdate` allows omitting it.
 */
function fakeParcel({ hasUpdate = true } = {}): Parcel {
  return {
    mount: vi.fn(() => Promise.resolve()),
    unmount: vi.fn(() => Promise.resolve()),
    ...(hasUpdate ? { update: vi.fn(() => Promise.resolve()) } : {}),
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
async function loadRenderModule({ hostMountFails = false } = {}) {
  vi.resetModules();

  const { mountRootParcel } = await import('single-spa');
  const { registerExtensionRendering, unregisterExtensionRendering } = await import('./store');
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

  const { createParcelMounter, renderExtension, renderParcel } = await import('./render');

  const mountTestExtension = () =>
    renderExtension(document.createElement('div'), 'test-slot', 'slot-module', 'test-extension#instance');

  return {
    mountRootParcel: vi.mocked(mountRootParcel),
    hostMountParcel,
    registerExtensionRendering: vi.mocked(registerExtensionRendering),
    unregisterExtensionRendering: vi.mocked(unregisterExtensionRendering),
    mountTestExtension,
    renderParcel,
    createParcelMounter,
  };
}

describe('renderExtension', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('mounts extensions through the host parcel rather than as root parcels', async () => {
    const { mountRootParcel, hostMountParcel, registerExtensionRendering, mountTestExtension } =
      await loadRenderModule();

    const parcel = await mountTestExtension();

    expect(registerExtensionRendering).toHaveBeenCalledWith({
      renderingId: 'test-slot/test-extension#instance-0',
      extensionName: 'test-extension#instance',
      extensionModuleName: 'test-module',
      id: 'test-extension#instance',
      slotName: 'test-slot',
      slotModuleName: 'slot-module',
    });
    expect(hostMountParcel).toHaveBeenCalledTimes(1);
    expect(parcel).toBe(hostMountParcel.mock.results[0].value);
    expect(mountRootParcel).toHaveBeenCalledTimes(1);
    expect(mountRootParcel).toHaveBeenCalledWith(
      expect.objectContaining({ name: hostParcelName }),
      expect.objectContaining({ domElement: expect.anything() }),
    );
  });

  it('releases the rendering record after the hosted parcel unmounts', async () => {
    const { hostMountParcel, registerExtensionRendering, unregisterExtensionRendering, mountTestExtension } =
      await loadRenderModule();
    let resolveUnmount: () => void;
    const unmountPromise = new Promise<void>((resolve) => {
      resolveUnmount = resolve;
    });

    hostMountParcel.mockImplementationOnce(() => ({ ...fakeParcel(), unmountPromise }) as unknown as Parcel);

    await mountTestExtension();

    expect(registerExtensionRendering).toHaveBeenCalledTimes(1);
    expect(unregisterExtensionRendering).not.toHaveBeenCalled();

    resolveUnmount!();
    await unmountPromise;
    await Promise.resolve();

    expect(unregisterExtensionRendering).toHaveBeenCalledWith('test-slot/test-extension#instance-0');
  });

  it('contains cleanup failures after the hosted parcel fails to mount', async () => {
    const { hostMountParcel, unregisterExtensionRendering, mountTestExtension } = await loadRenderModule();
    const mountError = new Error('extension mount failed');
    const cleanupError = new Error('configuration recomputation failed');

    hostMountParcel.mockImplementationOnce(
      () => ({ ...fakeParcel(), mountPromise: Promise.reject(mountError) }) as unknown as Parcel,
    );
    unregisterExtensionRendering.mockImplementationOnce(() => {
      throw cleanupError;
    });

    const parcel = await mountTestExtension();

    await expect(parcel!.mountPromise).rejects.toBe(mountError);
    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith(
      "Recomputing configuration after 'test-extension#instance' failed to mount also failed",
      cleanupError,
    );
  });

  it('contains cleanup failures after the hosted parcel unmounts', async () => {
    const { hostMountParcel, unregisterExtensionRendering, mountTestExtension } = await loadRenderModule();
    const cleanupError = new Error('configuration recomputation failed');
    let resolveUnmount: () => void;
    const unmountPromise = new Promise<void>((resolve) => {
      resolveUnmount = resolve;
    });

    hostMountParcel.mockImplementationOnce(() => ({ ...fakeParcel(), unmountPromise }) as unknown as Parcel);
    unregisterExtensionRendering.mockImplementationOnce(() => {
      throw cleanupError;
    });

    await mountTestExtension();
    resolveUnmount!();
    await unmountPromise;
    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith(
      "Recomputing configuration after unmounting 'test-extension#instance' failed",
      cleanupError,
    );
  });

  it('mounts the host parcel only once, including for concurrent renders', async () => {
    const { mountRootParcel, hostMountParcel, mountTestExtension } = await loadRenderModule();

    await Promise.all([mountTestExtension(), mountTestExtension(), mountTestExtension()]);
    await mountTestExtension();

    expect(mountRootParcel).toHaveBeenCalledTimes(1);
    expect(hostMountParcel).toHaveBeenCalledTimes(4);
  });

  it('falls back to mounting root parcels if the host parcel cannot be mounted', async () => {
    const { mountRootParcel, hostMountParcel, mountTestExtension } = await loadRenderModule({
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

describe('renderParcel', () => {
  it('mounts the parcel through the host parcel', async () => {
    const { mountRootParcel, hostMountParcel, renderParcel } = await loadRenderModule();
    const domElement = document.createElement('div');

    const parcel = await renderParcel(lifecycles, { domElement, someProp: 'value' });

    expect(hostMountParcel).toHaveBeenCalledWith(lifecycles, { domElement, someProp: 'value' });
    expect(parcel).toBe(hostMountParcel.mock.results[0].value);
    expect(mountRootParcel).toHaveBeenCalledTimes(1);
    expect(mountRootParcel).toHaveBeenCalledWith(expect.objectContaining({ name: hostParcelName }), expect.anything());
  });
});

describe('createParcelMounter', () => {
  it('returns the parcel synchronously and forwards to the real parcel once it has mounted', async () => {
    const { hostMountParcel, createParcelMounter } = await loadRenderModule();
    const domElement = document.createElement('div');

    const parcel = createParcelMounter()(lifecycles, { domElement });

    // the host parcel's mounter is only resolved asynchronously, so nothing is mounted yet
    expect(hostMountParcel).not.toHaveBeenCalled();
    expect(parcel.getStatus()).toBe('LOADING_SOURCE_CODE');

    await parcel.mountPromise;

    expect(hostMountParcel).toHaveBeenCalledWith(lifecycles, { domElement });
    expect(parcel.getStatus()).toBe('MOUNTED');
  });

  it('forwards update and unmount to the real parcel', async () => {
    const { hostMountParcel, createParcelMounter } = await loadRenderModule();
    const domElement = document.createElement('div');

    const parcel = createParcelMounter()(lifecycles, { domElement });
    await parcel.mountPromise;
    await parcel.update?.({ domElement, someProp: 'value' });
    await parcel.unmount();

    const realParcel = hostMountParcel.mock.results[0].value;
    expect(realParcel.update).toHaveBeenCalledWith({ domElement, someProp: 'value' });
    expect(realParcel.unmount).toHaveBeenCalledTimes(1);
    await expect(parcel.unmountPromise).resolves.toBeUndefined();
  });

  it('resolves update as a no-op if the real parcel has no update lifecycle', async () => {
    const { hostMountParcel, createParcelMounter } = await loadRenderModule();
    hostMountParcel.mockImplementationOnce(() => fakeParcel({ hasUpdate: false }));
    const domElement = document.createElement('div');

    const parcel = createParcelMounter()(lifecycles, { domElement });
    await parcel.mountPromise;

    await expect(parcel.update?.({ domElement })).resolves.toBeUndefined();
  });

  it('reports a failure to mount on mountPromise rather than throwing synchronously', async () => {
    const { hostMountParcel, createParcelMounter } = await loadRenderModule();
    hostMountParcel.mockImplementationOnce(() => {
      throw new Error('parcel cannot be mounted without a domElement');
    });

    const parcel = createParcelMounter()(lifecycles, { domElement: document.createElement('div') });

    await expect(parcel.mountPromise).rejects.toThrow('parcel cannot be mounted without a domElement');
    // callers unmount only a MOUNTED parcel, so a parcel that never mounted must not claim to be
    expect(parcel.getStatus()).not.toBe('MOUNTED');
  });

  it('mounts through the same host parcel as renderParcel', async () => {
    const { mountRootParcel, hostMountParcel, renderParcel, createParcelMounter } = await loadRenderModule();
    const domElement = document.createElement('div');

    await Promise.all([
      renderParcel(lifecycles, { domElement }),
      createParcelMounter()(lifecycles, { domElement }).mountPromise,
    ]);

    expect(mountRootParcel).toHaveBeenCalledTimes(1);
    expect(hostMountParcel).toHaveBeenCalledTimes(2);
  });
});
