/** @module @category Error Handling */
import { dispatchToastShown } from '@openmrs/esm-globals';

window.onerror = function (error) {
  console.error('Unexpected error: ', error);
  dispatchToastShown({
    description: error ?? 'Oops! An unexpected error occurred.',
    kind: 'error',
    title: 'Error',
  });
  return false;
};

window.onunhandledrejection = function (event: PromiseRejectionEvent) {
  console.error('Unhandled rejection: ', event.reason);
  dispatchToastShown({
    description: event.reason ?? 'Oops! An unhandled promise rejection occurred.',
    kind: 'error',
    title: 'Error',
  });
};

/**
 * Reports an error to the global error handler. The error will be displayed
 * to the user as a toast notification. This function ensures the error is
 * converted to an Error object if it isn't already one.
 *
 * The error is thrown asynchronously (via setTimeout) to ensure it's caught
 * by the global window.onerror handler.
 *
 * @param err The error to report. Can be an Error object, string, or any other value.
 *
 * @example
 * ```ts
 * import { reportError } from '@openmrs/esm-framework';
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   reportError(error);
 * }
 * ```
 */
export function reportError(err: unknown) {
  const error = ensureErrorObject(err);
  setTimeout(() => {
    throw error;
  });
}

/**
 * Creates an error handler function that captures the current stack trace at
 * the time of creation. When the returned handler is invoked with an error,
 * it appends the captured stack trace to provide better debugging information
 * for asynchronous operations.
 *
 * This is particularly useful for handling errors in Promise chains or
 * callback-based APIs where the original call site would otherwise be lost.
 *
 * @returns A function that accepts an error and reports it with an enhanced stack trace.
 *
 * @example
 * ```ts
 * import { createErrorHandler } from '@openmrs/esm-framework';
 * const handleError = createErrorHandler();
 * someAsyncOperation()
 *   .then(processResult)
 *   .catch(handleError);
 * ```
 */
export function createErrorHandler() {
  const outgoingErr = Error();
  return (incomingErr: unknown) => {
    const finalErr = ensureErrorObject(incomingErr);
    finalErr.stack += `\nAsync stacktrace:\n${outgoingErr.stack}`;
    reportError(incomingErr);
  };
}

function ensureErrorObject(thing: unknown) {
  let message: string;

  if (thing instanceof Error) {
    return thing;
  }

  if (thing === null) {
    return new Error(`Received null instead of a valid error object.`);
  }

  if (thing === undefined) {
    return new Error(`Received undefined instead of a valid error object.`);
  }

  if (typeof thing === 'object') {
    try {
      message = `Invalid error object received: ${JSON.stringify(thing)}`;
    } catch {
      message = `Invalid error object with keys: ${Object.keys(thing as object).join(', ')}`;
    }
    return new Error(message);
  }

  // string / number / boolean
  return new Error(`Error: ${String(thing)}`);
}