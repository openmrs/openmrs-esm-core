import { isObservable } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getConfig } from '@openmrs/esm-config';
import { navigate } from '@openmrs/esm-navigation';
import { openmrsFetch, openmrsObservableFetch } from './openmrs-fetch';

vi.mock('@openmrs/esm-navigation', () => ({
  clearHistory: vi.fn(),
  navigate: vi.fn(),
}));

const mockGetConfig = vi.mocked(getConfig);
const mockNavigate = vi.mocked(navigate);

describe('openmrsFetch', () => {
  beforeEach(() => {
    mockGetConfig.mockReturnValue(
      Promise.resolve({
        redirectAuthFailure: {
          enabled: true,
          url: '${openmrsSpaBase}/login',
          errors: [401],
          resolvePromise: false,
        },
      }),
    );
    window.openmrsBase = '/openmrs';
    window.getOpenmrsSpaBase = () => '/openmrs/spa/';
    window.fetch = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: vi.fn() },
    });
  });

  afterEach(() => {
    // @ts-expect-error Not normally deletable
    delete window.openmrsBase;
    // @ts-expect-error Not normally deletable
    delete window.getOpenmrsSpaBase;
  });

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
    // @ts-expect-error
    window.fetch.mockReturnValue(new Promise(() => {}));
    openmrsFetch('/ws/rest/v1/session');
    expect(window.fetch).toHaveBeenCalledWith('/openmrs/ws/rest/v1/session', {
      headers: {
        Accept: 'application/json',
        'Disable-WWW-Authenticate': 'true',
      },
    });
  });

  it('calls window.fetch correctly for requests that have a request body', () => {
    // @ts-expect-error
    window.fetch.mockReturnValue(new Promise(() => {}));
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
    // @ts-expect-error mockReturnValue only exists on the mock, not on the raw type
    window.fetch.mockReturnValue(new Promise(() => {}));
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
    // @ts-expect-error
    window.fetch.mockReturnValue(new Promise(() => {}));
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
    // @ts-expect-error
    window.fetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        clone: () => ({
          text: () => Promise.resolve('{ "value": "hi" }'),
        }),
      }),
    );

    const response = await openmrsFetch('/ws/rest/v1/session');
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ value: 'hi' });
  });

  it('returns a promise that resolves with null when the request succeeds with HTTP 204', async () => {
    // @ts-expect-error
    window.fetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        status: 204,
        json: () => Promise.reject(Error("No json for HTTP 204's!!")),
      }),
    );

    const response = await openmrsFetch('/ws/rest/v1/session');
    expect(response.status).toBe(204);
    expect(response.data).toEqual(null);
  });

  it('gives you an amazing error when the server responds with a 500 that has json', async () => {
    // @ts-expect-error
    window.fetch.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        clone: () => ({
          text: () =>
            Promise.resolve(
              JSON.stringify({
                error: 'The server is dead',
              }),
            ),
        }),
      }),
    );

    try {
      await openmrsFetch('/ws/rest/v1/session');
      fail("Promise shouldn't resolve when server responds with 500");
    } catch (err) {
      expect(err.message).toMatch(/Server responded with 500 \(Internal Server Error\)/);
      expect(err.message).toMatch(/\/ws\/rest\/v1\/session/);
      expect(err.responseBody).toEqual({ error: 'The server is dead' });
      expect(err.response.status).toBe(500);
    }
  });

  it("gives you an amazing error when the server responds with a 400 that doesn't have json", async () => {
    // @ts-expect-error
    window.fetch.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'You goofed up',
        clone: () => ({
          text: () => Promise.resolve('a string response body'),
        }),
      }),
    );

    try {
      await openmrsFetch('/ws/rest/v1/session');
      fail("Promise shouldn't resolve when server responds with 400");
    } catch (err) {
      expect(err.message).toMatch(/Server responded with 400 \(You goofed up\)/);
      expect(err.message).toMatch(/\/ws\/rest\/v1\/session/);
      expect(err.responseBody).toEqual('a string response body');
      expect(err.response.status).toBe(400);
    }
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

    // @ts-ignore
    window.fetch.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: 'You are not authorized',
        text: () => Promise.resolve('a string response body'),
      }),
    );

    await openmrsFetch('/ws/rest/v1/session');

    expect(mockNavigate.mock.calls[0][0]).toStrictEqual({
      to: '/openmrs/spa/login',
    });
  });
});

describe('openmrsObservableFetch', () => {
  beforeEach(() => {
    window.openmrsBase = '/openmrs';
    window.fetch = vi.fn();
  });

  it('calls window.fetch with the correct arguments for a basic GET request', async () => {
    // @ts-ignore
    window.fetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        clone: () => ({
          text: () => Promise.resolve('{"value": "hi"}'),
        }),
      }),
    );

    const observable = openmrsObservableFetch('/ws/rest/v1/session');
    expect(isObservable(observable)).toBe(true);

    await new Promise<void>((resolve, reject) =>
      observable.subscribe(
        (response) => {
          expect(response.data).toEqual({ value: 'hi' });
          resolve();
        },
        (err) => {
          reject(err);
        },
      ),
    );

    expect(window.fetch).toHaveBeenCalled();
    // @ts-expect-error
    expect(window.fetch.mock.calls[0][0]).toEqual('/openmrs/ws/rest/v1/session');
    // @ts-expect-error
    expect(window.fetch.mock.calls[0][1].headers.Accept).toEqual('application/json');
  });

  it('aborts the fetch request when subscription is unsubscribed', () => {
    // @ts-expect-error
    window.fetch.mockReturnValue(new Promise(() => {}));

    const subscription = openmrsObservableFetch('/ws/rest/v1/session').subscribe();
    // @ts-expect-error
    const abortSignal: AbortSignal = window.fetch.mock.calls[0][1].signal;
    expect(abortSignal.aborted).toBe(false);

    subscription.unsubscribe();
    expect(abortSignal.aborted).toBe(true);
  });
});
