import { describe, it, expect } from 'vitest';
import { extractErrorMessagesFromResponse } from './index';

describe('extractErrorMessagesFromResponse', () => {
  it('extracts field error messages from a ValidationException', () => {
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

    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['Dose is required', 'Drug is required', 'Drug must be valid']);
  });

  it('extracts global error messages from a ValidationException', () => {
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

    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['Patient must have at least one identifier', 'Encounter date cannot be in the future']);
  });

  it('extracts both field and global errors when both are present', () => {
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

    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['Name is required', 'Global validation failed']);
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

    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['Something went wrong']);
  });

  it('falls back to message when no translatedMessage is present', () => {
    const error = {
      responseBody: {
        error: {
          message: 'An internal error occurred',
        },
      },
    };

    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['An internal error occurred']);
  });

  it('handles an OpenmrsFetchError-like object with a message property', () => {
    const error = new Error('Server responded with 500 (Internal Server Error) for url /ws/rest/v1/order');
    (error as any).responseBody = null;

    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['Server responded with 500 (Internal Server Error) for url /ws/rest/v1/order']);
  });

  it('handles null error gracefully', () => {
    expect(extractErrorMessagesFromResponse(null)).toEqual(['Unknown error']);
  });

  it('handles undefined error gracefully', () => {
    expect(extractErrorMessagesFromResponse(undefined)).toEqual(['Unknown error']);
  });

  it('handles a plain string error', () => {
    expect(extractErrorMessagesFromResponse('something broke')).toEqual(['something broke']);
  });

  it('handles an object with no responseBody', () => {
    const error = { message: 'Network failure' };
    expect(extractErrorMessagesFromResponse(error)).toEqual(['Network failure']);
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

    // No field or global error messages → falls back to the outer error's message
    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['Validation errors found']);
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

    const messages = extractErrorMessagesFromResponse(error);
    expect(messages).toEqual(['Name is required']);
  });

  it('always returns an array (never empty)', () => {
    const messages = extractErrorMessagesFromResponse({});
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThan(0);
  });
});
