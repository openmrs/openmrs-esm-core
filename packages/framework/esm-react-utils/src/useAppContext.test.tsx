import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import { registerContext, unregisterContext } from '@openmrs/esm-context';
import { useAppContext } from './useAppContext';
import { useDefineAppContext } from './useDefineAppContext';

const namespace = 'test-context';

interface TestContext {
  value: string;
  count: number;
}

afterEach(() => {
  unregisterContext(namespace);
});

describe('useAppContext', () => {
  it('returns undefined when the namespace is not registered', () => {
    const { result } = renderHook(() => useAppContext<TestContext>(namespace));

    expect(result.current).toBeUndefined();
  });

  it('returns the currently-registered value on the very first render', () => {
    // Simulates the real-world scenario: one component has already registered
    // the context (e.g. WardView via useDefineAppContext), and a second
    // component mounts later and calls useAppContext. The second component
    // must see the current value on its first render, not undefined.
    registerContext<TestContext>(namespace, { value: 'initial', count: 1 });

    const { result } = renderHook(() => useAppContext<TestContext>(namespace));

    expect(result.current).toEqual({ value: 'initial', count: 1 });
  });

  it('applies the selector on the first render', () => {
    registerContext<TestContext>(namespace, { value: 'initial', count: 5 });

    const { result } = renderHook(() => useAppContext<TestContext, number>(namespace, (state) => state?.count ?? 0));

    expect(result.current).toBe(5);
  });

  it('exposes a sibling useDefineAppContext value to the consumer after effects flush', () => {
    // Note: React Testing Library's render() flushes effects before returning,
    // so this asserts the post-effect steady state — not literally the first
    // render. The useState-initializer path is exercised by the
    // "currently-registered value on the very first render" test above, which
    // pre-registers the namespace before renderHook runs.
    const Producer = () => {
      useDefineAppContext<TestContext>(namespace, { value: 'from-producer', count: 42 });
      return null;
    };

    const Consumer = () => {
      const ctx = useAppContext<TestContext>(namespace);
      return <div data-testid="consumer-value">{ctx ? `${ctx.value}:${ctx.count}` : 'UNDEFINED'}</div>;
    };

    render(
      <>
        <Producer />
        <Consumer />
      </>,
    );

    expect(screen.getByTestId('consumer-value')).toHaveTextContent('from-producer:42');
  });

  it('returns undefined (not {}) after the namespace owner unmounts (O3-4020 scenario)', async () => {
    // This reproduces Ian Bacher's hypothesis from O3-4020: when the component
    // that owns a namespace via useDefineAppContext unmounts while a consumer
    // is still mounted, the consumer must observe undefined — not a frozen
    // empty object that silently hides the absence.
    let currentValue: ReturnType<typeof useAppContext<TestContext>> = undefined;

    const Producer = () => {
      useDefineAppContext<TestContext>(namespace, { value: 'v', count: 1 });
      return null;
    };

    const Consumer = () => {
      currentValue = useAppContext<TestContext>(namespace);
      return null;
    };

    const { rerender } = render(
      <>
        <Producer />
        <Consumer />
      </>,
    );

    expect(currentValue).toEqual({ value: 'v', count: 1 });

    // Owner unmounts; consumer stays mounted
    rerender(
      <>
        <Consumer />
      </>,
    );

    expect(currentValue).toBeUndefined();
  });
});
