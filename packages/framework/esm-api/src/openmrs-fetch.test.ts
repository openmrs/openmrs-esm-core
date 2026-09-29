import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getConfig } from '@openmrs/esm-config';
import { navigate } from '@openmrs/esm-navigation';
import { OpenmrsFetchError, openmrsFetch } from './openmrs-fetch';

vi.mock('@openmrs/esm-navigation', () => ({
  clearHistory: vi.fn(),
  navigate: vi.fn(),
}));

const mockGetConfig = vi.mocked(getConfig);
const mockNavigate = vi.mocked(navigate);
const mockFetch = vi.fn<typeof fetch>();

beforeEach(() => {
  mockGetConfig.mockReturnValue(
    Promise.resolve({
      redirectAuthFailure: {
        enabled: true,
        url: '${openmrsSpaBase}/login',
        errors: [401],
        resolvePromise: false,
      },
      followRedirects: true,
    }),
  );
  window.openmrsBase = '/openmrs';
  window.getOpenmrsSpaBase = () => '/openmrs/spa/';
  vi.stubGlobal('fetch', mockFetch);
  vi.stubGlobal('location', new URL('https://frontend.example/openmrs/spa/'));
});

afterEach(() => {
  vi.unstubAllGlobals();
  // @ts-expect-error Not normally deletable
  delete window.openmrsBase;
  // @ts-expect-error Not normally deletable
  delete window.getOpenmrsSpaBase;
});

describe('openmrsFetch', () => {
  it(`throws an error if you don't pass in a url string`, () => {
    // @ts-expect-error
    expect(() => openmrsFetch()).toThrow(/first argument/);
    // @ts-expect-error
    expect(() => openmrsFetch({})).toThrow(/first argument/);
  });

  it('throws an error if you pass in an invalid fetchInit object', () => {
    // @ts-expect-error
    expect(() => openmrsFetch('/session', 'invalid second arg')).toThrow(/second argument/);

    // @ts-expect-error
    expect(() => openmrsFetch('/session', 123)).toThrow(/second argument/);
  });

  it('throws an Error if there is no openmrsBase', () => {
    // @ts-expect-error
    delete window.openmrsBase;

    expect(() => openmrsFetch('/session')).toThrow(/openmrsBase/);
  });

  it('calls window.fetch with the correct arguments for a basic GET request', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    openmrsFetch('/ws/rest/v1/session');
    expect(window.fetch).toHaveBeenCalledWith('/openmrs/ws/rest/v1/session', {
      headers: {
        Accept: 'application/json',
        'Disable-WWW-Authenticate': 'true',
      },
    });
  });

  it('calls window.fetch correctly for requests that have a request body', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const requestBody = { some: 'json' };
    openmrsFetch('/ws/rest/v1/session', {
      method: 'POST',
      body: requestBody,
    });
    expect(window.fetch).toHaveBeenCalledWith('/openmrs/ws/rest/v1/session', {
      headers: {
        Accept: 'application/json',
        'Disable-WWW-Authenticate': 'true',
      },
      body: JSON.stringify(requestBody),
      method: 'POST',
    });
  });

  it('allows you to specify your own Accept request header', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    openmrsFetch('/ws/rest/v1/session', {
      headers: {
        Accept: 'application/xml',
      },
    });
    expect(window.fetch).toHaveBeenCalledWith('/openmrs/ws/rest/v1/session', {
      headers: {
        Accept: 'application/xml',
        'Disable-WWW-Authenticate': 'true',
      },
    });
  });

  it('allows you to specify no Accept request header to be sent', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    openmrsFetch('/ws/rest/v1/session', {
      headers: {
        // specifically null on purpose
        Accept: null,
      },
    });

    expect(window.fetch).toHaveBeenCalledWith('/openmrs/ws/rest/v1/session', {
      headers: {
        'Disable-WWW-Authenticate': 'true',
      },
    });
  });

  it('returns a promise that resolves with a json object when the request succeeds', async () => {
    mockFetch.mockResolvedValue(new Response('{"value":"hi"}'));

    const response = await openmrsFetch('/ws/rest/v1/session');
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ value: 'hi' });
  });

  it('returns a promise that resolves with null when the request succeeds with HTTP 204', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 204 }));

    const response = await openmrsFetch('/ws/rest/v1/session');
    expect(response.status).toBe(204);
    expect(response.data).toEqual(null);
  });

  it('gives you an amazing error when the server responds with a 500 that has json', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ error: 'The server is dead' }), {
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(openmrsFetch('/ws/rest/v1/session')).rejects.toMatchObject({
      message: expect.stringContaining(
        'Server responded with 500 (Internal Server Error) for url /openmrs/ws/rest/v1/session',
      ),
      responseBody: { error: 'The server is dead' },
      response: expect.objectContaining({ status: 500 }),
    });
  });

  it("gives you an amazing error when the server responds with a 400 that doesn't have json", async () => {
    mockFetch.mockResolvedValue(new Response('a string response body', { status: 400, statusText: 'You goofed up' }));

    await expect(openmrsFetch('/ws/rest/v1/session')).rejects.toMatchObject({
      message: expect.stringContaining('Server responded with 400 (You goofed up) for url /openmrs/ws/rest/v1/session'),
      responseBody: 'a string response body',
      response: expect.objectContaining({ status: 400 }),
    });
  });

  it('redirects to the Location header URL when a 401 response contains a Location header (auth-module challenge)', async () => {
    mockGetConfig.mockResolvedValueOnce({
      redirectAuthFailure: {
        enabled: true,
        url: '',
        errors: [401],
        resolvePromise: true,
      },
    });

    mockFetch.mockResolvedValue(
      new Response(null, { status: 401, headers: { Location: '/module/authentication/login.form' } }),
    );

    await openmrsFetch('/ws/rest/v1/session');

    expect(mockNavigate.mock.calls[0][0]).toStrictEqual({
      to: '/module/authentication/login.form',
    });
  });

  it('redirects to the Location header URL when session endpoint called and it contains a Location header', async () => {
    mockFetch.mockResolvedValue(new Response(null, { status: 200, headers: { Location: '/openmrs/spa/login' } }));

    await openmrsFetch('/ws/rest/v1/session');

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/openmrs/spa/login',
    });
  });

  it('redirects to the default login URL when a 401 response has no Location header (genuine auth failure)', async () => {
    mockGetConfig.mockResolvedValueOnce({
      redirectAuthFailure: {
        enabled: true,
        url: '',
        errors: [401],
        resolvePromise: true,
      },
    });

    mockFetch.mockResolvedValue(new Response(null, { status: 401 }));

    await openmrsFetch('/ws/rest/v1/session');

    expect(mockNavigate.mock.calls[0][0]).toStrictEqual({
      to: '${openmrsSpaBase}/login',
    });
  });

  it('navigates to spa login page when the server responds with a 401', async () => {
    mockGetConfig.mockResolvedValueOnce({
      redirectAuthFailure: {
        enabled: true,
        url: '/openmrs/spa/login',
        errors: [401],
        resolvePromise: true,
      },
    });

    mockFetch.mockResolvedValue(new Response('a string response body', { status: 401 }));

    await openmrsFetch('/ws/rest/v1/session');

    expect(mockNavigate.mock.calls[0][0]).toStrictEqual({
      to: '/openmrs/spa/login',
    });
  });

  it('openmrsFetchRejectingAuthFailures navigates to login and rejects when the server responds with a 401', async () => {
    mockFetch.mockResolvedValue(new Response('', { status: 401, statusText: 'Unauthorized' }));

    const result = openmrsFetch('/ws/rest/v1/session', { rejectAuthFailure: true });

    await expect(result).rejects.toBeInstanceOf(OpenmrsFetchError);
    await expect(result).rejects.toMatchObject({ response: { status: 401 } });
    expect(mockNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
  });
});
