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

/** The `domElement` a lifecycle was handed, which is whichever props single-spa held at the time. */
function elementOf(props: unknown) {
  return (props as { domElement?: HTMLElement }).domElement;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('renderParcel against the real single-spa', () => {
  it('mounts and unmounts a well-behaved parcel', async () => {
    const parcel = await renderParcel(goodLifecycles(), { domElement: document.createElement('div') });

    await parcel.mountPromise;
    expect(parcel.getStatus()).toBe('MOUNTED');

    // single-spa leaves `update` off a parcel whose config has no update lifecycle, and `<Extension>`
    // reads it to decide whether the parcel can be updated at all.
    expect(parcel.update).toBeUndefined();

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

  it('hands the props of the latest update to the unmount that breaks the parcel', async () => {
    const mounted = document.createElement('div');
    const updated = document.createElement('div');
    const callerProps = { domElement: updated, someProp: 'updated' };
    const unmountedWith: Array<HTMLElement | undefined> = [];

    const parcel = await renderParcel(
      {
        ...goodLifecycles(),
        update: () => Promise.resolve(),
        unmount: (props) => {
          unmountedWith.push(elementOf(props));
          return Promise.reject(new Error('unmount failed'));
        },
      },
      { domElement: mounted },
    );

    await parcel.mountPromise;
    await parcel.update?.(callerProps);

    // single-spa rejects `unmountPromise` separately from the call, so both are asserted against.
    const brokeUnmount = expect(parcel.unmountPromise).rejects.toThrow(/unmount failed/);
    await expect(parcel.unmount()).rejects.toThrow(/unmount failed/);
    await brokeUnmount;

    // single-spa assigns the props of an update over the ones it holds rather than merging into
    // them, so from here on it is the updated copy that a failure has to empty, and the mount-time
    // copy that nothing is holding.
    expect(unmountedWith).toEqual([updated]);
    expect(parcel.getStatus()).toBe('SKIP_BECAUSE_BROKEN');
    expect(callerProps).toEqual({ domElement: updated, someProp: 'updated' });
  });

  it('breaks a parcel whose update lifecycle fails', async () => {
    const domElement = document.createElement('div');
    const updatedWith: Array<HTMLElement | undefined> = [];

    const parcel = await renderParcel(
      {
        ...goodLifecycles(),
        update: (props) => {
          updatedWith.push(elementOf(props));
          return Promise.reject(new Error('update failed'));
        },
      },
      { domElement },
    );

    await parcel.mountPromise;
    await expect(parcel.update?.({ domElement })).rejects.toThrow(/update failed/);

    // Nothing follows this: single-spa neither unmounts the parcel nor runs another lifecycle, so
    // the props it is left holding are the ones the failed update swapped in.
    expect(updatedWith).toEqual([domElement]);
    expect(parcel.getStatus()).toBe('SKIP_BECAUSE_BROKEN');
  });

  it('keeps the props of an update rejected on an unmounted parcel for its next mount', async () => {
    const mounted = document.createElement('div');
    const updated = document.createElement('div');
    const mountedWith: Array<HTMLElement | undefined> = [];

    const parcel = await renderParcel(
      {
        ...goodLifecycles(),
        update: () => Promise.resolve(),
        mount: (props) => {
          mountedWith.push(elementOf(props));
          return Promise.resolve();
        },
      },
      { domElement: mounted },
    );

    await parcel.mountPromise;
    await parcel.unmount();

    // single-spa swaps the props in before it checks the status, so this rejection still leaves it
    // holding them — and a parcel that is merely unmounted can be mounted again.
    await expect(parcel.update?.({ domElement: updated })).rejects.toThrow(/not mounted/);
    expect(parcel.getStatus()).toBe('NOT_MOUNTED');

    await parcel.mount();

    expect(parcel.getStatus()).toBe('MOUNTED');
    expect(mountedWith).toEqual([mounted, updated]);
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
