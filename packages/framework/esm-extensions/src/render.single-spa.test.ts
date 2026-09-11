/* eslint-disable testing-library/render-result-naming-convention -- these tests render parcels, not components */
/*
 * Unlike `render.test.ts`, these run against the real single-spa. They cover the parts of
 * `renderParcel()` whose whole purpose is to interact with single-spa's internals — the lifecycle
 * wrapping in particular, which stands between single-spa and every lifecycle it would otherwise
 * have validated itself.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { LifeCycles } from 'single-spa';
import { renderParcel } from './render';

function goodLifecycles(): LifeCycles {
  return {
    bootstrap: () => Promise.resolve(),
    mount: () => Promise.resolve(),
    unmount: () => Promise.resolve(),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('renderParcel against the real single-spa', () => {
  it('mounts and unmounts a well-behaved parcel', async () => {
    const parcel = await renderParcel(goodLifecycles(), { domElement: document.createElement('div') });

    await parcel.mountPromise;
    expect(parcel.getStatus()).toBe('MOUNTED');

    await parcel.unmount();
    expect(parcel.getStatus()).toBe('NOT_MOUNTED');
  });

  it('leaves the props intact for the unmount single-spa runs after a failed mount', async () => {
    const domElement = document.createElement('div');
    const callerProps = { domElement };
    const unmountedWith: Array<unknown> = [];

    const parcel = await renderParcel(
      {
        ...goodLifecycles(),
        mount: () => Promise.reject(new Error('mount failed')),
        unmount: (props) => {
          unmountedWith.push((props as { domElement?: HTMLElement }).domElement);
          return Promise.resolve();
        },
      },
      callerProps,
    );

    await expect(parcel.mountPromise).rejects.toThrow(/mount failed/);

    // single-spa unmounts a parcel whose mount failed so the extension can tear down whatever it
    // rendered, so the props it retains cannot be released until that unmount has had them.
    expect(unmountedWith).toEqual([domElement]);
    expect(parcel.getStatus()).toBe('SKIP_BECAUSE_BROKEN');
    expect(callerProps).toEqual({ domElement });
  });

  it('breaks a parcel whose mount does not return a promise', async () => {
    // single-spa would fail this parcel on its own; the deadline wrapper has to not paper over it.
    const lifecycles = { ...goodLifecycles(), mount: (() => undefined) as never };

    const parcel = await renderParcel(lifecycles, { domElement: document.createElement('div') });

    await expect(parcel.mountPromise).rejects.toThrow(
      /Lifecycle function mount at array index 0 for parcel .* did not return a promise/,
    );
    expect(parcel.getStatus()).toBe('SKIP_BECAUSE_BROKEN');
  });

  it('breaks a parcel one of whose array lifecycle functions does not return a promise', async () => {
    const lifecycles = {
      ...goodLifecycles(),
      mount: [() => Promise.resolve(), (() => undefined) as never],
    };

    const parcel = await renderParcel(lifecycles, { domElement: document.createElement('div') });

    await expect(parcel.mountPromise).rejects.toThrow(
      /Lifecycle function mount at array index 1 for parcel .* did not return a promise/,
    );
    expect(parcel.getStatus()).toBe('SKIP_BECAUSE_BROKEN');
  });

  it('breaks a parcel whose mount overruns its deadline', async () => {
    vi.useFakeTimers();

    try {
      const parcel = await renderParcel(
        { ...goodLifecycles(), mount: () => new Promise(() => {}) },
        { domElement: document.createElement('div') },
      );

      // Asserted against before the clock is advanced, so the rejection is never unhandled.
      const overran = expect(parcel.mountPromise).rejects.toThrow(/did not settle within 15000ms/);
      await vi.advanceTimersByTimeAsync(15_000);
      await overran;

      expect(parcel.getStatus()).toBe('SKIP_BECAUSE_BROKEN');
    } finally {
      vi.useRealTimers();
    }
  });
});
