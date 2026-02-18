export function createErrorHandler() {
  return (error: unknown): never => {
    reportError(error);
  };
}

export function reportError(error: unknown): never {
  if (error instanceof Error) {
    throw error;
  }

  if (typeof error === 'string') {
    throw new Error(error);
  }

  if (error === null) {
    throw new Error("'null' was thrown as an error");
  }

  if (error === undefined) {
    throw new Error("'undefined' was thrown as an error");
  }

  try {
    throw new Error(`Object thrown as error: ${JSON.stringify(error)}`);
  } catch {
    throw new Error('Unknown non-Error value thrown');
  }
}
