/** @module @category Error Handling */
import { dispatchToastShown, dispatchSnackbarShown } from '@openmrs/esm-globals';

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

/**
 * Shape of an individual REST field/global error entry.
 * @category Error Handling
 */
export interface RestFieldError {
  message: string;
  code?: string;
  [key: string]: unknown;
}

/**
 * The error body shape returned by the OpenMRS REST API.
 *
 * ValidationExceptions contain {@link fieldErrors} and/or {@link globalErrors}.
 * Other exceptions contain {@link message} (and optionally {@link translatedMessage}).
 *
 * @category Error Handling
 */
export interface RestErrorResponse {
  error?: {
    message?: string;
    code?: string;
    detail?: string;
    translatedMessage?: string;
    fieldErrors?: Record<string, Array<RestFieldError>>;
    globalErrors?: Array<RestFieldError>;
  };
}

/**
 * Reports a REST API error to the user via a snackbar notification.
 *
 * This function integrates directly with the existing error handling pipeline.
 * While {@link reportError} handles generic JS errors (via `window.onerror` →
 * toast), `reportRestError` handles structured REST API errors by parsing the
 * OpenMRS REST error response and dispatching a {@link dispatchSnackbarShown}
 * event with the extracted human-readable messages.
 *
 * Handles the two main REST exception shapes:
 * - **ValidationException**: `{ error: { fieldErrors, globalErrors } }`
 * - **Other exceptions**: `{ error: { message, translatedMessage } }`
 *
 * @param error — An error caught from `openmrsFetch`. Typically an `OpenmrsFetchError`
 *   whose `responseBody` contains the REST error JSON, but any shape is handled gracefully.
 * @param title — The snackbar title. Defaults to `'Error'`.
 *
 * @example
 * ```ts
 * import { reportRestError } from '@openmrs/esm-framework';
 *
 * try {
 *   await openmrsFetch(`${restBaseUrl}/order`, { method: 'POST', body });
 * } catch (error) {
 *   reportRestError(error, 'Error placing order');
 * }
 * ```
 *
 * @category Error Handling
 */
export function reportRestError(error: unknown, title = 'Error'): void {
  const messages = extractMessages(error);
  const subtitle = messages.join('; ');

  console.error(`${title}:`, error);

  dispatchSnackbarShown({
    title,
    subtitle,
    kind: 'error',
  });
}

/** Extracts human-readable messages from a REST error response (internal). */
function extractMessages(error: unknown): Array<string> {
  const restError = getRestErrorBody(error);

  if (!restError?.error) {
    return [ensureErrorObject(error).message];
  }

  const { fieldErrors, globalErrors, message, translatedMessage } = restError.error;
  const messages: Array<string> = [
    ...(fieldErrors ? collectFieldErrorMessages(fieldErrors) : []),
    ...(globalErrors ? collectGlobalErrorMessages(globalErrors) : []),
  ];

  if (messages.length > 0) {
    return messages;
  }

  return [translatedMessage || message || ensureErrorObject(error).message];
}

/** Collects human-readable messages from REST field-level validation errors. */
function collectFieldErrorMessages(fieldErrors: Record<string, Array<RestFieldError>>): Array<string> {
  return Object.values(fieldErrors).flatMap((errors) => errors.map((e) => e.message).filter(Boolean));
}

/** Collects human-readable messages from REST global validation errors. */
function collectGlobalErrorMessages(globalErrors: Array<RestFieldError>): Array<string> {
  return globalErrors.map((e) => e.message).filter(Boolean);
}

/**
 * Runtime type guard that validates whether a value conforms to the
 * {@link RestErrorResponse} shape.  Performs field-level narrowing so that
 * no unsafe `as unknown as …` cast is required.
 */
function isRestErrorResponse(value: unknown): value is RestErrorResponse {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  if (!('error' in value)) {
    return false;
  }

  const errorField = (value as Record<string, unknown>).error;

  // `error` may be absent (`error?:`), which still satisfies the interface
  if (errorField == null) {
    return true;
  }

  if (typeof errorField !== 'object') {
    return false;
  }

  const err = errorField as Record<string, unknown>;

  if ('message' in err && err.message != null && typeof err.message !== 'string') {
    return false;
  }
  if ('code' in err && err.code != null && typeof err.code !== 'string') {
    return false;
  }
  if ('detail' in err && err.detail != null && typeof err.detail !== 'string') {
    return false;
  }
  if ('translatedMessage' in err && err.translatedMessage != null && typeof err.translatedMessage !== 'string') {
    return false;
  }
  if ('fieldErrors' in err && err.fieldErrors != null && typeof err.fieldErrors !== 'object') {
    return false;
  }
  if ('globalErrors' in err && err.globalErrors != null && !Array.isArray(err.globalErrors)) {
    return false;
  }

  return true;
}

/**
 * Attempts to locate the REST error JSON from the error object.
 * Handles both `OpenmrsFetchError.responseBody` (which may be the parsed JSON
 * directly) and nested `responseBody.error` structures.
 */
function getRestErrorBody(error: unknown): RestErrorResponse | null {
  if (error == null || typeof error !== 'object') {
    return null;
  }

  const err = error as Record<string, unknown>;

  // OpenmrsFetchError stores the parsed response JSON in `responseBody`
  if (err.responseBody != null && typeof err.responseBody === 'object') {
    const body = err.responseBody;
    // Validate the shape with a proper type guard — no force-cast needed
    if (isRestErrorResponse(body)) {
      return body;
    }
  }

  return null;
}

function ensureErrorObject(thing: any) {
  let message: string;

  if (thing instanceof Error) {
    return thing;
  } else if (thing === null) {
    return Error(`'null' was thrown as an error`);
  } else if (typeof thing === 'object') {
    try {
      message = `Object thrown as error: ${JSON.stringify(thing)}`;
    } catch (e) {
      message = `Object thrown as error with the following properties: ${Object.keys(thing)}`;
    }
    return Error(message);
  } else if (thing === undefined) {
    return Error(`'undefined' was thrown as an error`);
  } else {
    return Error(thing.toString());
  }
}
