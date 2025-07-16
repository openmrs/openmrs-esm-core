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
