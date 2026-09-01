import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Parcel } from 'single-spa';

vi.mock('@openmrs/esm-extensions', () => ({
  getModalRegistration: vi.fn(),
  renderParcel: vi.fn(),
}));

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

/** Lets the `.then()` chains inside the modal store's subscriber run. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('modals', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.mocked(getModalRegistration).mockReturnValue({ load: () => Promise.resolve(lifecycle) } as never);
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

    const container = document.createElement('div');
    document.body.append(container);
    setupModals(container);

    const close = showModal('a-modal');
    await flush();

    close();
    await flush();

    expect(consoleError).toHaveBeenCalledWith("The modal 'a-modal' failed to unmount", unmountError);
    consoleError.mockRestore();
  });

  it('tears the modal down even though unmounting failed', async () => {
    vi.mocked(renderParcel).mockResolvedValue(fakeParcel(() => Promise.reject(new Error('parcel not mounted'))));

    const container = document.createElement('div');
    document.body.append(container);
    setupModals(container);

    const close = showModal('another-modal');
    await flush();

    expect(container.childElementCount).toBe(1);

    close();
    await flush();

    expect(container.childElementCount).toBe(0);
  });
});
