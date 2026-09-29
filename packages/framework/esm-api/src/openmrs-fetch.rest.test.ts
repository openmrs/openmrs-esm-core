import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getConfig } from '@openmrs/esm-config';
import { openmrsFetch } from './openmrs-fetch';

vi.mock('@openmrs/esm-navigation', () => ({ clearHistory: vi.fn(), navigate: vi.fn() }));

const mockFetch = vi.fn<typeof fetch>();

beforeEach(() => {
  window.openmrsBase = '/openmrs';
  vi.stubGlobal('location', new URL('https://frontend.example/openmrs/spa/'));
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockResolvedValue(new Response('{}'));
  vi.mocked(getConfig).mockResolvedValue({
    redirectAuthFailure: { enabled: false, url: '', errors: [401], resolvePromise: false },
    followRedirects: true,
  });
});

afterEach(() => vi.unstubAllGlobals());

describe('REST authentication challenge suppression', () => {
  it('leaves malformed URLs to native fetch so callers can catch the rejected promise', async () => {
    const error = new TypeError('Invalid URL');
    mockFetch.mockRejectedValueOnce(error);

    const request = openmrsFetch('http://[');

    expect(request).toBeInstanceOf(Promise);
    await expect(request.catch((reason) => reason)).resolves.toBe(error);
    expect(mockFetch).toHaveBeenCalledWith('http://[', expect.any(Object));
  });

  it.each([
    ['/openmrs', '/ws/rest/v1/patient', '/openmrs/ws/rest/v1/patient'],
    ['/openmrs', 'ws/rest/v1/patient', '/openmrs/ws/rest/v1/patient'],
    [
      '/openmrs',
      'https://frontend.example/openmrs/ws/rest/v1/patient?startIndex=10',
      'https://frontend.example/openmrs/ws/rest/v1/patient?startIndex=10',
    ],
    ['/openmrs', '/ws/rest/v1', '/openmrs/ws/rest/v1'],
    ['/openmrs/', '/ws/rest/v1/patient', '/openmrs//ws/rest/v1/patient'],
    [
      '/openmrs/',
      'https://frontend.example/openmrs/ws/rest/v1/patient',
      'https://frontend.example/openmrs/ws/rest/v1/patient',
    ],
    ['https://api.example/openmrs', '/ws/rest/v1/patient', 'https://api.example/openmrs/ws/rest/v1/patient'],
    [
      'https://api.example/openmrs/',
      'https://api.example/openmrs/ws/rest/v1/patient',
      'https://api.example/openmrs/ws/rest/v1/patient',
    ],
  ])('adds the header for base %s and path %s without rewriting the request URL', async (base, path, expectedUrl) => {
    window.openmrsBase = base;

    await openmrsFetch(path);

    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      headers: { Accept: 'application/json', 'Disable-WWW-Authenticate': 'true' },
    });
  });

  it.each([
    ['/openmrs', 'https://other.example/openmrs/ws/rest/v1/patient'],
    ['https://api.example/openmrs', 'https://frontend.example/openmrs/ws/rest/v1/patient'],
    ['/openmrs', 'http://frontend.example/openmrs/ws/rest/v1/patient'],
    ['/openmrs', 'https://frontend.example:8443/openmrs/ws/rest/v1/patient'],
    ['/openmrs', 'https://frontend.example/another/ws/rest/v1/patient'],
    ['/openmrs', '/ws/rest/v10/patient'],
    ['/openmrs', '/ws/rest/v1relationship'],
    ['/openmrs', '/ws/fhir2/R4/Patient'],
  ])('does not add the header outside the configured REST API: %s, %s', async (base, path) => {
    window.openmrsBase = base;

    await openmrsFetch(path);

    expect(new Headers(mockFetch.mock.calls[0][1]?.headers).has('Disable-WWW-Authenticate')).toBe(false);
  });

  it.each(['Disable-WWW-Authenticate', 'disable-www-authenticate', 'DISABLE-WWW-AUTHENTICATE'])(
    'preserves an explicit %s override, including null',
    async (name) => {
      for (const value of ['true', 'false', null]) {
        // null retains legacy pass-through behavior, unlike Accept: null which removes the header.
        const headers = { [name]: value };
        await openmrsFetch('/ws/rest/v1/patient', { headers });
        expect(mockFetch.mock.lastCall?.[1]?.headers).toEqual({ [name]: value, Accept: 'application/json' });
      }
    },
  );

  it.each([
    { 'Disable-WWW-Authenticate': undefined },
    { 'disable-www-authenticate': undefined },
    { 'DISABLE-WWW-AUTHENTICATE': undefined },
    { 'Disable-WWW-Authenticate': undefined, 'disable-www-authenticate': undefined },
  ])('defaults undefined overrides without combining header values: %j', async (headers) => {
    // @ts-expect-error JavaScript callers can supply undefined despite the FetchHeaders type.
    await openmrsFetch('/ws/rest/v1/patient', { headers });

    expect(mockFetch.mock.lastCall?.[1]?.headers).toEqual({
      Accept: 'application/json',
      'Disable-WWW-Authenticate': 'true',
    });
    expect(new Headers(mockFetch.mock.lastCall?.[1]?.headers).get('Disable-WWW-Authenticate')).toBe('true');
  });

  it('preserves a defined override when another casing has an undefined value', async () => {
    const headers = { 'Disable-WWW-Authenticate': undefined, 'disable-www-authenticate': 'false' };
    // @ts-expect-error JavaScript callers can supply undefined despite the FetchHeaders type.
    await openmrsFetch('/ws/rest/v1/patient', { headers });

    expect(mockFetch.mock.lastCall?.[1]?.headers).toEqual({
      Accept: 'application/json',
      'disable-www-authenticate': 'false',
    });
    expect(new Headers(mockFetch.mock.lastCall?.[1]?.headers).get('Disable-WWW-Authenticate')).toBe('false');
  });
});
