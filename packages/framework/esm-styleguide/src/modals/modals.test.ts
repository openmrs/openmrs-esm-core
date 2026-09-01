import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Parcel } from 'single-spa';

vi.mock('@openmrs/esm-extensions', () => ({
  getModalRegistration: vi.fn(),
  renderParcel: vi.fn(),
}));

vi.mock('@openmrs/esm-error-handling', () => ({
  reportError: vi.fn(),
}));

import { reportError } from '@openmrs/esm-error-handling';
import { getModalRegistration, renderParcel } from '@openmrs/esm-extensions';
import { setupModals, showModal } from './index';

const lifecycle = {
  bootstrap: () => Promise.resolve(),
  mount: () => Promise.resolve(),
  unmount: () => Promise.resolve(),
};

function fakeParcel(unmount: () => Promise<void>) {
  return { unmount: vi.fn(unmount) } as unknown as Parcel;
}

/**
 * Registers `loads` by modal name, falling back to a modal that loads immediately. Naming them
 * apart is what lets one modal be held in flight while another mounts.
 */
function registerModals(loads: Record<string, () => Promise<typeof lifecycle>> = {}) {
  vi.mocked(getModalRegistration).mockImplementation(
    (modalName: string) => ({ load: loads[modalName] ?? (() => Promise.resolve(lifecycle)) }) as never,
  );
}

/** A load that stays in flight until `release()`, which is the window each race below opens in. */
function gatedLoad() {
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  return {
    release,
    load: vi.fn(async () => {
      await gate;
      return lifecycle;
    }),
  };
}

/** Lets the `.then()` chains inside the modal store's subscriber run. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function setUpModalContainer() {
  const container = document.createElement('div');
  document.body.append(container);
  setupModals(container);

  return container;
}

describe('modals', () => {
  const openModals: Array<() => void> = [];

  /** Records the handle so that {@link afterEach} can close whatever a test leaves open. */
  function open(...args: Parameters<typeof showModal>) {
    const close = showModal(...args);
    openModals.push(close);

    return close;
  }

  beforeEach(() => {
    document.body.innerHTML = '';
    registerModals();
  });

  // The modal store is global, so a modal still on the stack belongs to the next test as well —
  // which, among other things, holds the overlay open over it.
  afterEach(async () => {
    openModals.splice(0).forEach((close) => close());
    await flush();
    await flush();
  });

  /*
   * `unmountThisParcel()` rejects for any status but `MOUNTED` — a modal closed while it is still
   * mounting, or one single-spa has hard-failed — and nothing is chained to this call, so without a
   * handler the failure is only ever an unhandled rejection.
   */
  it('logs a modal that fails to unmount', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unmountError = new Error('parcel not mounted');
    vi.mocked(renderParcel).mockResolvedValue(fakeParcel(() => Promise.reject(unmountError)));

    const container = setUpModalContainer();

    const close = open('a-modal');
    await flush();

    close();
    await flush();

    expect(consoleError).toHaveBeenCalledWith("The modal 'a-modal' failed to unmount", unmountError);
    consoleError.mockRestore();
  });

  it('tears the modal down even though unmounting failed', async () => {
    vi.mocked(renderParcel).mockResolvedValue(fakeParcel(() => Promise.reject(new Error('parcel not mounted'))));

    const container = setUpModalContainer();

    const close = open('another-modal');
    await flush();

    expect(container.childElementCount).toBe(1);

    close();
    await flush();

    expect(container.childElementCount).toBe(0);
  });

  it('does not mount a second copy when another modal opens while the first is still loading', async () => {
    const { release, load } = gatedLoad();
    registerModals({ 'slow-modal': load });
    vi.mocked(renderParcel).mockResolvedValue(fakeParcel(() => Promise.resolve()));

    const container = setUpModalContainer();

    open('slow-modal');
    await flush();

    open('quick-modal');
    await flush();

    release();
    await flush();

    expect(load).toHaveBeenCalledTimes(1);
    expect(vi.mocked(renderParcel)).toHaveBeenCalledTimes(2);
    expect(container.childElementCount).toBe(2);
  });

  it('hides a modal that finishes loading after another has opened on top of it', async () => {
    const { release, load } = gatedLoad();
    registerModals({ 'slow-modal': load });
    vi.mocked(renderParcel).mockResolvedValue(fakeParcel(() => Promise.resolve()));

    const container = setUpModalContainer();

    open('slow-modal');
    await flush();

    open('quick-modal');
    await flush();

    release();
    await flush();

    // Each frame is prepended as it mounts, so the slow one — which mounted last — is first.
    const [slowFrame, quickFrame] = Array.from(container.children);
    expect(slowFrame).toHaveStyle({ visibility: 'hidden' });
    expect(quickFrame).not.toHaveStyle({ visibility: 'hidden' });
  });

  it('unmounts a modal closed while it was still loading, and never shows it', async () => {
    const { release, load } = gatedLoad();
    const unmount = vi.fn(() => Promise.resolve());
    registerModals({ 'slow-modal': load });
    vi.mocked(renderParcel).mockResolvedValue(fakeParcel(unmount));

    const container = setUpModalContainer();

    const close = open('slow-modal');
    await flush();

    close();
    await flush();

    release();
    await flush();

    expect(container.childElementCount).toBe(0);
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('tears a modal down once even if another opens before it leaves the stack', async () => {
    vi.mocked(renderParcel).mockResolvedValue(fakeParcel(() => Promise.resolve()));

    setUpModalContainer();

    const onClose = vi.fn();
    const close = open('a-modal', {}, onClose);
    await flush();

    // Synchronous, so the second modal lands while the first is still awaiting its removal.
    close();
    open('b-modal');
    await flush();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('reports a modal that fails to load and takes it off the stack, closing the overlay', async () => {
    const loadError = new Error('bundle is missing');
    registerModals({ 'broken-modal': () => Promise.reject(loadError) });

    const container = setUpModalContainer();

    const onClose = vi.fn();
    open('broken-modal', {}, onClose);
    await flush();
    await flush();

    expect(reportError).toHaveBeenCalledWith(loadError);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.childElementCount).toBe(0);
    // An instance left on the stack holds the overlay over a page the user can no longer scroll.
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });
});
