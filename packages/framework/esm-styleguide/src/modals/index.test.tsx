import { setupModals, showModal } from './index';
import { getModalRegistration } from '@openmrs/esm-extensions';
import { mountRootParcel } from 'single-spa';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportError } from '@openmrs/esm-error-handling';

vi.mock('@openmrs/esm-extensions', () => ({
  getModalRegistration: vi.fn(),
}));

vi.mock('single-spa', () => ({
  mountRootParcel: vi.fn(),
}));

vi.mock('@openmrs/esm-error-handling', () => ({
  reportError: vi.fn(),
}));

function flushMicrotasks() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function pressEscape() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
}

describe('showModal close disposer idempotency', () => {
  let container: HTMLElement;
  let unmountSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    container = document.createElement('div');
    setupModals(container);

    unmountSpy = vi.fn().mockResolvedValue(undefined);

    (getModalRegistration as ReturnType<typeof vi.fn>).mockReturnValue({
      load: () => Promise.resolve({ bootstrap: vi.fn(), mount: vi.fn(), unmount: vi.fn() }),
    });

    (mountRootParcel as ReturnType<typeof vi.fn>).mockReturnValue({
      unmount: unmountSpy,
    });
  });

  it('calling close() twice in the same task tears down the modal once', async () => {
    const onClose = vi.fn();
    const close = showModal('some-registered-modal', {}, onClose);

    await flushMicrotasks();

    close();
    close();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(unmountSpy).toHaveBeenCalledTimes(1);
  });

  it('single unmount rejection is routed through reportError, not left unhandled', async () => {
    const rejectionError = new Error("Cannot unmount parcel '...' -- it is in a NOT_MOUNTED status");
    unmountSpy.mockRejectedValueOnce(rejectionError);

    const onClose = vi.fn();
    const close = showModal('some-registered-modal', {}, onClose);
    await flushMicrotasks();

    close();

    await flushMicrotasks();

    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(rejectionError);
  });

  it('calling close() after the deferred modalStack removal is a no-op', async () => {
    const onClose = vi.fn();
    const close = showModal('some-registered-modal', {}, onClose);
    await flushMicrotasks();

    close();
    await flushMicrotasks();
    close();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape then calling the disposer tears down the modal once', async () => {
    const onClose = vi.fn();
    const close = showModal('some-registered-modal', {}, onClose);
    await flushMicrotasks();

    pressEscape();
    close();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(unmountSpy).toHaveBeenCalledTimes(1);
  });

  it('calling the disposer then pressing Escape tears down the modal once', async () => {
    const onClose = vi.fn();
    const close = showModal('some-registered-modal', {}, onClose);
    await flushMicrotasks();

    close();
    pressEscape();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(unmountSpy).toHaveBeenCalledTimes(1);
  });

  it('the injected close prop and the returned disposer are the same function', async () => {
    const onClose = vi.fn();
    const disposerClose = showModal('some-registered-modal', {}, onClose);
    await flushMicrotasks();

    const mountCallArgs = (mountRootParcel as ReturnType<typeof vi.fn>).mock.calls[0];
    const injectedProps = mountCallArgs[1] as { close: () => void };

    expect(injectedProps.close).toBe(disposerClose);
  });

  it('calling the injected close prop then the disposer tears down the modal once', async () => {
    const onClose = vi.fn();
    const disposerClose = showModal('some-registered-modal', {}, onClose);
    await flushMicrotasks();

    const mountCallArgs = (mountRootParcel as ReturnType<typeof vi.fn>).mock.calls[0];
    const injectedProps = mountCallArgs[1] as { close: () => void };

    injectedProps.close();
    disposerClose();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(unmountSpy).toHaveBeenCalledTimes(1);
  });

  it('calling the disposer then the injected close prop tears down the modal once', async () => {
    const onClose = vi.fn();
    const disposerClose = showModal('some-registered-modal', {}, onClose);
    await flushMicrotasks();

    const mountCallArgs = (mountRootParcel as ReturnType<typeof vi.fn>).mock.calls[0];
    const injectedProps = mountCallArgs[1] as { close: () => void };

    disposerClose();
    injectedProps.close();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(unmountSpy).toHaveBeenCalledTimes(1);
  });
});

