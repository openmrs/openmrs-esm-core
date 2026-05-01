import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import { registerContext, unregisterContext, updateContext } from '@openmrs/esm-context';
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

  it('returns undefined (not {}) after the namespace owner unmounts (O3-4020 scenario)', () => {
    // When the component that owns a namespace via useDefineAppContext
    // unmounts while a consumer is still mounted, the consumer must observe
    // undefined — not a frozen empty object that silently hides the absence.
    const Producer = () => {
      useDefineAppContext<TestContext>(namespace, { value: 'v', count: 1 });
      return null;
    };

    const Consumer = () => {
      const ctx = useAppContext<TestContext>(namespace);
      return <div data-testid="consumer-value">{ctx ? `${ctx.value}:${ctx.count}` : 'UNDEFINED'}</div>;
    };

    const { rerender } = render(
      <>
        <Producer />
        <Consumer />
      </>,
    );

    expect(screen.getByTestId('consumer-value')).toHaveTextContent('v:1');

    rerender(<Consumer />);

    expect(screen.getByTestId('consumer-value')).toHaveTextContent('UNDEFINED');
  });

  it('re-applies the selector when the underlying context updates', () => {
    registerContext<TestContext>(namespace, { value: 'a', count: 1 });

    const { result } = renderHook(() => useAppContext<TestContext, number>(namespace, (state) => state?.count ?? -1));

    expect(result.current).toBe(1);

    act(() => {
      updateContext<TestContext>(namespace, (state) => ({ ...state, count: 7 }));
    });

    expect(result.current).toBe(7);
  });
});
