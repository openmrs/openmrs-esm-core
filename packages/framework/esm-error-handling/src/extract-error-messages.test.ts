import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reportRestError } from './index';

const mockDispatchSnackbarShown = vi.fn();

vi.mock('@openmrs/esm-globals', () => ({
  dispatchToastShown: vi.fn(),
  dispatchSnackbarShown: (...args: any[]) => mockDispatchSnackbarShown(...args),
}));

describe('reportRestError', () => {
  beforeEach(() => {
    mockDispatchSnackbarShown.mockClear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('dispatches a snackbar with field error messages from a ValidationException', () => {
    const error = {
      responseBody: {
        error: {
          message: 'Validation errors found',
          code: 'webservices.rest.error.invalid.submission',
          fieldErrors: {
            dose: [{ message: 'Dose is required', code: 'error.null' }],
            drug: [
              { message: 'Drug is required', code: 'error.null' },
              { message: 'Drug must be valid', code: 'error.invalid' },
            ],
          },
        },
      },
    };

    reportRestError(error, 'Order Error');

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Order Error',
      subtitle: 'Dose is required; Drug is required; Drug must be valid',
      kind: 'error',
    });
  });

  it('dispatches a snackbar with global error messages from a ValidationException', () => {
    const error = {
      responseBody: {
        error: {
          message: 'Validation errors found',
          globalErrors: [
            { message: 'Patient must have at least one identifier' },
            { message: 'Encounter date cannot be in the future' },
          ],
        },
      },
    };

    reportRestError(error);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: 'Patient must have at least one identifier; Encounter date cannot be in the future',
      kind: 'error',
    });
  });

  it('dispatches a snackbar with both field and global errors when both are present', () => {
    const error = {
      responseBody: {
        error: {
          message: 'Validation errors found',
          fieldErrors: {
            name: [{ message: 'Name is required' }],
          },
          globalErrors: [{ message: 'Global validation failed' }],
        },
      },
    };

    reportRestError(error);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: 'Name is required; Global validation failed',
      kind: 'error',
    });
  });

  it('falls back to translatedMessage for non-validation exceptions', () => {
    const error = {
      responseBody: {
        error: {
          message: 'org.openmrs.SomeException: something went wrong',
          translatedMessage: 'Something went wrong',
        },
      },
    };

    reportRestError(error);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: 'Something went wrong',
      kind: 'error',
    });
  });

  it('falls back to message when no translatedMessage is present', () => {
    const error = {
      responseBody: {
        error: {
          message: 'An internal error occurred',
        },
      },
    };

    reportRestError(error);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: 'An internal error occurred',
      kind: 'error',
    });
  });

  it('handles an OpenmrsFetchError-like object with a message property', () => {
    const error = new Error('Server responded with 500 (Internal Server Error) for url /ws/rest/v1/order');
    (error as any).responseBody = null;

    reportRestError(error);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: 'Server responded with 500 (Internal Server Error) for url /ws/rest/v1/order',
      kind: 'error',
    });
  });

  it('handles null error gracefully via ensureErrorObject', () => {
    reportRestError(null);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: expect.stringContaining('null'),
      kind: 'error',
    });
  });

  it('handles undefined error gracefully via ensureErrorObject', () => {
    reportRestError(undefined);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: expect.stringContaining('undefined'),
      kind: 'error',
    });
  });

  it('handles a plain string error via ensureErrorObject', () => {
    reportRestError('something broke');

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: 'something broke',
      kind: 'error',
    });
  });

  it('handles an object with no responseBody via ensureErrorObject', () => {
    const error = { message: 'Network failure' };

    reportRestError(error);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: expect.stringContaining('Network failure'),
      kind: 'error',
    });
  });

  it('handles empty fieldErrors and globalErrors gracefully', () => {
    const error = {
      message: 'Validation errors found',
      responseBody: {
        error: {
          fieldErrors: {},
          globalErrors: [],
        },
      },
    };

    reportRestError(error);

    // No field or global error messages → falls back via ensureErrorObject
    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: expect.any(String),
      kind: 'error',
    });
  });

  it('skips entries with empty message strings', () => {
    const error = {
      responseBody: {
        error: {
          fieldErrors: {
            name: [{ message: '' }, { message: 'Name is required' }],
          },
        },
      },
    };

    reportRestError(error);

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Error',
      subtitle: 'Name is required',
      kind: 'error',
    });
  });

  it('uses custom title when provided', () => {
    const error = {
      responseBody: {
        error: {
          message: 'Something failed',
        },
      },
    };

    reportRestError(error, 'Custom Title');

    expect(mockDispatchSnackbarShown).toHaveBeenCalledWith({
      title: 'Custom Title',
      subtitle: 'Something failed',
      kind: 'error',
    });
  });

  it('calls console.error for observability', () => {
    const error = new Error('test error');
    (error as any).responseBody = null;

    reportRestError(error, 'Test');

    expect(console.error).toHaveBeenCalledWith('Test:', error);
  });
});
