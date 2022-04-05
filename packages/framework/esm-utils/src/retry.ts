/** @module @category Utility */

/**
 * Options for configuring the behavior of the {@link retry} function.
 */
export interface RetryOptions {
  /**
   * Determines whether the retry function should retry executing the function after it failed
   * with an error on the current attempt.
   * @param attempt The current (zero-based) retry attempt. `0` indicates the initial attempt.
   */
  shouldRetry?(attempt: number);
  /**
   * Calculates the next delay (in milliseconds) before a retry attempt.
   * Returning a value for the inital attempt (`0`) delays the initial function invocation.
   * @param attempt The current (zero-based) retry attempt. `0` indicates the initial attempt.
   */
  getDelay?(attempt: number): number;
  /**
   * Called when invoking the function resulted in an error.
   * Allows running side-effects on errors, e.g. logging.
   * @param e The error thrown by the function.
   * @param attempt The current (zero-based) retry attempt. `0` indicates the initial attempt.
   */
  onError?(e: any, attempt: number): void;
}

/**
 * Executes the specified function and retries executing on failure with a custom backoff strategy
 * defined by the options.
 *
 * If not configured otherwise, this function uses the following default options:
 * * Retries 5 times beyond the initial attempt.
 * * Uses an exponential backoff starting with an initial delay of 1000ms.
 * @param fn The function to be executed and retried on failure.
 * @param options Additional options which configure the retry behavior.
 * @returns The result of successfully executing `fn`.
 * @throws Rethrows the final error of running `fn` when the function stops retrying.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
) {
  let { shouldRetry, getDelay, onError } = options;
  shouldRetry = shouldRetry ?? ((attempt) => limitAttempts(attempt, 5));
  getDelay = getDelay ?? ((attempt) => getExponentialDelay(attempt, 1000));

  let attempt = 0;
  let lastError: any = undefined;

  do {
    try {
      await delay(getDelay(attempt));
      return await fn();
    } catch (e) {
      onError?.(e, attempt);
      lastError = e;
    }
  } while (shouldRetry(attempt++));

  // If we reach this fn errored and shouldn't retry anymore. Simply rethrow the final error as
  // a means of ending the retry process without a result.
  throw lastError;
}

function limitAttempts(attempt: number, maxAttempts: number) {
  return attempt <= maxAttempts;
}

function getExponentialDelay(
  attempt: number,
  startingDelay: number,
  initialDelay = false
) {
  const exponent = initialDelay ? attempt + 1 : attempt;
  return startingDelay * Math.pow(2, exponent);
}

async function delay(ms: number) {
  if (ms <= 0) {
    return;
  }

  return new Promise<void>((res) => setTimeout(res, ms));
}
