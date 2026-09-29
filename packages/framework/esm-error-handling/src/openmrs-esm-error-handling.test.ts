import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dispatchToastShown } from '@openmrs/esm-globals';
import { reportError } from './index';

vi.mock('@openmrs/esm-globals', () => ({
  dispatchToastShown: vi.fn(),
}));

vi.useFakeTimers();

const mockDispatchToastShown = vi.mocked(dispatchToastShown);

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

describe('window.onunhandledrejection', () => {
  beforeEach(() => {
    mockDispatchToastShown.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  // The handler only reads `event.reason`, so a minimal stand-in avoids
  // constructing a real (and itself-unhandled) PromiseRejectionEvent.
  const fireRejection = (reason: unknown) => window.onunhandledrejection?.({ reason } as PromiseRejectionEvent);

  it('shows a toast with the Error message as a string description', () => {
    fireRejection(new Error('Something broke'));

    expect(mockDispatchToastShown).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Something broke', kind: 'error', title: 'Error' }),
    );
    expect(typeof mockDispatchToastShown.mock.calls[0][0].description).toBe('string');
  });

  it('shows a string reason directly', () => {
    fireRejection('plain string reason');

    expect(mockDispatchToastShown).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'plain string reason' }),
    );
  });

  it('falls back to a friendly message for empty/non-string reasons', () => {
    for (const reason of [undefined, null, new Error(''), { some: 'object' }]) {
      mockDispatchToastShown.mockClear();
      fireRejection(reason);
      expect(mockDispatchToastShown.mock.calls[0][0].description).toBe(
        'Oops! An unhandled promise rejection occurred.',
      );
    }
  });
});
