import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { getContext, unregisterContext } from '@openmrs/esm-context';
import { useDefineAppContext } from './useDefineAppContext';

const namespace = 'test-context';

afterEach(() => {
  // Clean up any registered context between tests
  unregisterContext(namespace);
});

describe('useDefineAppContext', () => {
  it('registers the namespace on mount and unregisters on unmount', () => {
    const { unmount } = renderHook(() => useDefineAppContext(namespace, { value: 1 }));

    expect(getContext(namespace)).toEqual({ value: 1 });

    unmount();

    expect(getContext(namespace)).toBeNull();
  });

  it('updates the context when the value changes', () => {
    const { rerender } = renderHook(({ value }) => useDefineAppContext(namespace, value), {
      initialProps: { value: { count: 1 } },
    });

    expect(getContext(namespace)).toEqual({ count: 1 });

    rerender({ value: { count: 2 } });

    expect(getContext(namespace)).toEqual({ count: 2 });
  });

  it('recovers when a new instance mounts before the previous cleanup runs', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // First instance registers the context
    const { unmount: unmountFirst } = renderHook(() => useDefineAppContext(namespace, { version: 'old' }));

    expect(getContext(namespace)).toEqual({ version: 'old' });

    // Simulate the race: mount a second instance WITHOUT unmounting the first.
    // This is what happens when a new single-spa lifecycle mounts before the
    // old one's cleanup effect has run.
    const { unmount: unmountSecond } = renderHook(() => useDefineAppContext(namespace, { version: 'new' }));

    // The second instance should have updated the context, not crashed
    expect(getContext(namespace)).toEqual({ version: 'new' });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Namespace ${namespace} is already registered`),
    );

    // The stale cleanup from the old instance must NOT remove the new instance's context
    unmountFirst();

    expect(getContext(namespace)).toEqual({ version: 'new' });

    // Only the current owner's cleanup should unregister the context
    unmountSecond();

    expect(getContext(namespace)).toBeNull();

    consoleWarnSpy.mockRestore();
  });
});
