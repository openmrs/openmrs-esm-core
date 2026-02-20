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

export function reportError(err: unknown) {
  const error = ensureErrorObject(err);
  setTimeout(() => {
    throw error;
  });
}

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
 * Extracts human-readable error messages from an OpenMRS REST error response.
 *
 * Handles the two main REST exception shapes:
 * - **ValidationException**: `{ error: { fieldErrors, globalErrors } }`
 * - **Other exceptions**: `{ error: { message, translatedMessage } }`
 *
 * The function inspects the `responseBody` property of an {@link OpenmrsFetchError}
 * (or any object with a compatible shape) and returns a flat array of message strings.
 *
 * @param error — An error caught from {@link openmrsFetch}. Typically an `OpenmrsFetchError`
 *   whose `responseBody` contains the REST error JSON, but any shape is handled gracefully.
 * @returns An array of human-readable error message strings, never empty.
 *
 * @example
 * ```ts
 * import { openmrsFetch, showSnackbar } from '@openmrs/esm-framework';
 * import { extractErrorMessagesFromResponse } from '@openmrs/esm-framework';
 *
 * try {
 *   await openmrsFetch(`${restBaseUrl}/order`, { method: 'POST', body });
 * } catch (error) {
 *   const messages = extractErrorMessagesFromResponse(error);
 *   showSnackbar({
 *     title: t('orderError', 'Error placing order'),
 *     subtitle: messages.join(', '),
 *     kind: 'error',
 *   });
 * }
 * ```
 *
 * @category Error Handling
 */
export function extractErrorMessagesFromResponse(error: unknown): Array<string> {
  const restError = getRestErrorBody(error);

  if (!restError?.error) {
    return [getFallbackMessage(error)];
  }

  const { fieldErrors, globalErrors, message, translatedMessage } = restError.error;
  const messages: Array<string> = [];

  if (fieldErrors) {
    for (const fieldName of Object.keys(fieldErrors)) {
      for (const entry of fieldErrors[fieldName]) {
        if (entry.message) {
          messages.push(entry.message);
        }
      }
    }
  }

  if (globalErrors) {
    for (const entry of globalErrors) {
      if (entry.message) {
        messages.push(entry.message);
      }
    }
  }

  if (messages.length > 0) {
    return messages;
  }

  if (translatedMessage) {
    return [translatedMessage];
  }

  if (message) {
    return [message];
  }

  return [getFallbackMessage(error)];
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
    const body = err.responseBody as Record<string, unknown>;
    // If responseBody itself has an `error` key, it's the REST error envelope
    if ('error' in body) {
      return body as unknown as RestErrorResponse;
    }
  }

  return null;
}

/** Produces a reasonable fallback message string from any error shape. */
function getFallbackMessage(error: unknown): string {
  if (error == null) {
    return 'Unknown error';
  }

  if (error instanceof Error) {
    return error.message || 'Unknown error';
  }

  if (typeof error === 'object') {
    const err = error as Record<string, unknown>;
    if (typeof err.message === 'string' && err.message) {
      return err.message;
    }
    if (typeof err.statusText === 'string' && err.statusText) {
      return err.statusText;
    }
  }

  return String(error) || 'Unknown error';
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
