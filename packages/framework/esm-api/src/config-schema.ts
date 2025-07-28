import { type ConfigSchema, Type, validators } from '@openmrs/esm-config';

export const defaultRedirectAuthFailureUrl = '${openmrsSpaBase}/login';

export const configSchema: ConfigSchema = {
  redirectAuthFailure: {
    enabled: {
      _type: Type.Boolean,
      _default: true,
      _description: 'Whether to redirect logged-out users to `redirectAuthFailure.url`',
    },
    url: {
      _type: Type.String,
      _default: defaultRedirectAuthFailureUrl,
      _validators: [validators.isUrl],
      _description:
        'The url to which users will be redirected when they are logged out. If set to blank, the `location` header from the response will be used.',
    },
    errors: {
      _type: Type.Array,
      _default: [401],
      _elements: {
        _type: Type.Number,
        _validators: [validators.inRange(100, 600)],
      },
      _description: 'The HTTP error codes for which users will be redirected',
    },
    resolvePromise: {
      _type: Type.Boolean,
      _default: false,
      _description:
        "Changes how requests that fail authentication are handled. Try messing with this if redirects to the login page aren't working correctly.",
    },
  },
  followRedirects: {
    _type: Type.Boolean,
    _default: true,
    _description: 'Whether openmrsFetch should support redirects returned from the backend',
  },
};

export interface EsmApiConfigObject {
  redirectAuthFailure: {
    enabled: boolean;
    url: string;
    errors: number[];
    resolvePromise: boolean;
  };
  followRedirects: boolean;
}
