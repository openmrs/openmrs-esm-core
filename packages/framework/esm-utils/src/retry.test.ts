import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { retry } from './retry';

describe('retry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the result immediately on first successful attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const promise = retry(fn, { getDelay: () => 0 });
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries when the function throws and succeeds on a subsequent attempt', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('failure 1'))
      .mockRejectedValueOnce(new Error('failure 2'))
      .mockResolvedValue('recovered');

    const promise = retry(fn, { getDelay: () => 100 });
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('invokes onError callback on each failure with the error and attempt number', async () => {
    const onError = vi.fn();
    const err1 = new Error('err 1');
    const err2 = new Error('err 2');
    const fn = vi.fn().mockRejectedValueOnce(err1).mockRejectedValueOnce(err2).mockResolvedValue('done');

    const promise = retry(fn, { getDelay: () => 0, onError });
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('done');
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenNthCalledWith(1, err1, 0);
    expect(onError).toHaveBeenNthCalledWith(2, err2, 1);
  });

  it('rethrows the final error when maximum retry attempts are exceeded', async () => {
    const error = new Error('persistent failure');
    const fn = vi.fn().mockRejectedValue(error);

    const promise = retry(fn, {
      shouldRetry: (attempt) => attempt < 2,
      getDelay: () => 10,
    });

    const expectPromise = expect(promise).rejects.toThrow('persistent failure');
    await vi.runAllTimersAsync();
    await expectPromise;

    // attempt 0 (fails) -> shouldRetry(0) -> true -> attempt 1 (fails) -> shouldRetry(1) -> true -> attempt 2 (fails) -> shouldRetry(2) -> false
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('uses custom shouldRetry to stop immediately on specific error conditions', async () => {
    const fatalError = new Error('fatal');
    const fn = vi.fn().mockRejectedValue(fatalError);

    const promise = retry(fn, {
      shouldRetry: () => false,
      getDelay: () => 0,
    });

    const expectPromise = expect(promise).rejects.toThrow('fatal');
    await vi.runAllTimersAsync();
    await expectPromise;

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('applies custom getDelay per attempt', async () => {
    const getDelay = vi.fn().mockReturnValue(500);
    const fn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('ok');

    const promise = retry(fn, { getDelay });
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('ok');
    expect(getDelay).toHaveBeenCalledWith(0);
    expect(getDelay).toHaveBeenCalledWith(1);
  });
});
