import { beforeEach, describe, it, expect, vi } from 'vitest';
import { dispatchToastShown } from '@openmrs/esm-globals';
import { reportError } from './index';

vi.mock('@openmrs/esm-globals', () => ({
  dispatchToastShown: vi.fn(),
}));

vi.useFakeTimers();

const mockDispatchToastShown = vi.mocked(dispatchToastShown);

/**
 * Importing `./index` installs the global handlers as a side effect, so they can be invoked
 * directly. The casts sidestep the DOM signatures, which don't allow the non-`Error` shapes
 * these tests deliberately exercise.
 */
function triggerOnError(error: unknown) {
  (window.onerror as (error: unknown) => void)(error);
}

function triggerOnUnhandledRejection(reason: unknown) {
  (window.onunhandledrejection as (event: PromiseRejectionEvent) => void)({ reason } as PromiseRejectionEvent);
}

/**
 * The shapes that can reach `window.onunhandledrejection` as `event.reason`.
 * For normal browser-reported script errors, `window.onerror` receives a message string;
 * the other shapes exercise defensive handling. `null` in `expected` means the handler's
 * fallback text is expected.
 */
const errorShapes: Array<{ label: string; reason: unknown; expected: string | null }> = [
  { label: 'an Error instance', reason: new Error('something exploded'), expected: 'something exploded' },
  { label: 'an Error with an empty message', reason: new Error(''), expected: null },
  { label: 'a string', reason: 'something failed', expected: 'something failed' },
  { label: 'a plain object', reason: { foo: 'bar' }, expected: 'Object thrown as error: {"foo":"bar"}' },
  { label: 'null', reason: null, expected: "'null' was thrown as an error" },
  { label: 'undefined', reason: undefined, expected: "'undefined' was thrown as an error" },
  // `Error#message` is writable, so an Error can reach the handlers carrying a non-string message.
  // `ensureErrorObject()` passes such an Error through untouched, so the guard has to be downstream.
  { label: 'an Error whose message is not a string', reason: errorWithObjectMessage(), expected: null },
];

function errorWithObjectMessage() {
  const error = new Error('replaced below');
  (error as unknown as { message: unknown }).message = { nested: 'value' };
  return error;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('error handler', () => {
  it('transforms non-Error inputs into valid Error objects', () => {
    expect(() => {
      reportError('error');
      vi.runAllTimers();
    }).toThrow('error');

    expect(() => {
      reportError({ error: 'error' });
      vi.runAllTimers();
    }).toThrow('Object thrown as error: {"error":"error"}');

    expect(() => {
      reportError(null);
      vi.runAllTimers();
    }).toThrow("'null' was thrown as an error");

    expect(() => {
      reportError(undefined);
      vi.runAllTimers();
    }).toThrow("'undefined' was thrown as an error");
  });
});

describe('window.onerror', () => {
  const fallback = 'Oops! An unexpected error occurred.';

  it.each(errorShapes)('shows a string description for $label', ({ reason, expected }) => {
    triggerOnError(reason);

    expect(mockDispatchToastShown).toHaveBeenCalledOnce();
    const { description } = mockDispatchToastShown.mock.calls[0][0];
    // The regression itself: an object here is unrenderable as a React child, so the toast never appears.
    expect(typeof description).toBe('string');
    expect(description).toBe(expected ?? fallback);
  });
});

describe('window.onunhandledrejection', () => {
  const fallback = 'Oops! An unhandled promise rejection occurred.';

  it.each(errorShapes)('shows a string description for $label', ({ reason, expected }) => {
    triggerOnUnhandledRejection(reason);

    expect(mockDispatchToastShown).toHaveBeenCalledOnce();
    const { description } = mockDispatchToastShown.mock.calls[0][0];
    expect(typeof description).toBe('string');
    expect(description).toBe(expected ?? fallback);
  });
});
