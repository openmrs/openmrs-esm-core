import { jest, describe, it, expect } from '@jest/globals';
import type { reportError as ReportErrorType } from './index';

jest.mock('./index');

const { reportError } = jest.requireActual('./index') as { reportError: typeof ReportErrorType };

jest.useFakeTimers();

describe('error handler', () => {
  it('transforms non-Error inputs into valid Error objects', () => {
    expect(() => {
      reportError('error');
      jest.runAllTimers();
    }).toThrow('error');

    expect(() => {
      reportError({ error: 'error' });
      jest.runAllTimers();
    }).toThrow('Object thrown as error: {"error":"error"}');

    expect(() => {
      reportError(null);
      jest.runAllTimers();
    }).toThrow("'null' was thrown as an error");

    expect(() => {
      reportError(undefined);
      jest.runAllTimers();
    }).toThrow("'undefined' was thrown as an error");
  });
});
