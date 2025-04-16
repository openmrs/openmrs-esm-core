import { describe, it, expect, vi } from 'vitest';
import { reportError } from './index';

vi.useFakeTimers();

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
