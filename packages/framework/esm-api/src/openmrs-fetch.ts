/** @module @category API */
import { Observable } from 'rxjs';
import { isPlainObject } from 'lodash-es';
import { getConfig } from '@openmrs/esm-config';
import { navigate } from '@openmrs/esm-navigation';
import { clearHistory } from '@openmrs/esm-navigation/src/index';
import type { FetchResponse } from './types';

export const restBaseUrl = '/ws/rest/v1';
export const fhirBaseUrl = '/ws/fhir2/R4';
export const sessionEndpoint = `${restBaseUrl}/session`;

/**
 * Append `path` to the OpenMRS SPA base.
 *
 * #### Example
 *
 * ```ts
 * makeUrl('/foo/bar');
 * // => '/openmrs/foo/bar'
 * ```
 */
export function makeUrl(path: string) {
  if (path && path.startsWith('http')) {
    return path;
  } else if (path[0] !== '/') {
    // ensure path starts with /
    path = '/' + path;
  }

  return window.openmrsBase + path;
}

/**
 * The openmrsFetch function is a wrapper around the
 * [browser's built-in fetch function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch),
 * with extra handling for OpenMRS-specific API behaviors, such as
 * request headers, authentication, authorization, and the API urls.
 *
 * @param path A string url to make the request to. Note that the
 *   openmrs base url (by default `/openmrs`) will be automatically
 *   prepended to the URL, so there is no need to include it.
 * @param fetchInit A [fetch init object](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Syntax).
 *   Note that the `body` property does not need to be `JSON.stringify()`ed
 *   because openmrsFetch will do that for you.
 * @returns A [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 *   that resolves with a [Response object](https://developer.mozilla.org/en-US/docs/Web/API/Response).
 *   Note that the openmrs version of the Response object has already
 *   downloaded the HTTP response body as json, and has an additional
 *   `data` property with the HTTP response json as a javascript object.
 *
 * #### Example
 * ```js
 * import { openmrsFetch } from '@openmrs/esm-api'
 * const abortController = new AbortController();
 * openmrsFetch(`${restBaseUrl}/session', {signal: abortController.signal})
 *   .then(response => {
 *     console.log(response.data.authenticated)
 *   })
 *   .catch(err => {
 *     console.error(err.status);
 *   })
 * abortController.abort();
 * openmrsFetch(`${restBaseUrl}/session', {
 *   method: 'POST',
 *   body: {
 *     username: 'hi',
 *     password: 'there',
 *   }
 * })
 * ```
 *
 * #### Cancellation
 *
 * To cancel a network request, use an
 * [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
 * It is best practice to cancel your network requests when the user
 * navigates away from a page while the request is pending request, to
 * free up memory and network resources and to prevent race conditions.
 *
 * @category API
 */
export function openmrsFetch<T = any>(path: string, fetchInit: FetchConfig = {}): Promise<FetchResponse<T>> {
  if (typeof path !== 'string') {
    throw Error("The first argument to @openmrs/api's openmrsFetch function must be a url string");
  }

  if (typeof fetchInit !== 'object') {
    throw Error("The second argument to @openmrs/api's openmrsFetch function must be a plain object.");
  }

  // @ts-ignore
  if (!window.openmrsBase) {
    throw Error(
      "@openmrs/api is running in a browser that doesn't have window.openmrsBase, which is provided by openmrs-module-spa's HTML file.",
    );
  }

  // Prefix the url with the openmrs spa base
  let url: string = makeUrl(path);

  // We're going to need some headers
  if (!fetchInit.headers) {
    fetchInit.headers = {};
  }

  /* Automatically stringify javascript objects being sent in the
   * request body.
   */
  if (isPlainObject(fetchInit.body)) {
    fetchInit.body = JSON.stringify(fetchInit.body);
  }

  /* Add a request header to tell the server to respond with json,
   * since frontend code almost always wants json and the OpenMRS
   * server won't give you json unless you explicitly ask for it.
   * If a different Accept header is preferred, pass it into the fetchInit.
   * If no Accept header is desired, pass it in explicitly as null.
   */
  if (typeof fetchInit.headers.Accept === 'undefined') {
    fetchInit.headers.Accept = 'application/json';
  }

  if (fetchInit.headers.Accept === null) {
    delete fetchInit.headers.Accept;
  }

  /* This tells the OpenMRS REST API not to return a WWW-Authenticate
   * header. Returning that header is useful when using the API, but
   * not from a UI.
   */
  if (path.startsWith(restBaseUrl) && typeof fetchInit.headers['Disable-WWW-Authenticate'] === 'undefined') {
    fetchInit.headers['Disable-WWW-Authenticate'] = 'true';
  }

  if (path.startsWith(fhirBaseUrl)) {
    const urlUrl = new URL(url, window.location.toString());
    if (!urlUrl.searchParams.has('_summary')) {
      urlUrl.searchParams.set('_summary', 'data');
      url = urlUrl.toString();
    }
  }

  /* We capture the stacktrace before making the request, so that if an error occurs we can
   * log a full stacktrace that includes the code that made the request and handled the response
   * Otherwise, we could run into situations where the stacktrace doesn't even show which code
   * called @openmrs/api.
   */
  const requestStacktrace = Error();

  return window.fetch(url, fetchInit as RequestInit).then(async (r) => {
    const response = r as FetchResponse<T>;
    if (response.ok) {
      if (response.status === 204) {
        /* HTTP 204 - No Content
         * We should not try to download the empty response as json. Instead,
         * we return null since there is no response body.
         */
        response.data = null as unknown as T;
        return response;
      } else {
        // HTTP 200s - The request succeeded
        return response
          .clone()
          .text()
          .then((responseText) => {
            try {
              if (responseText) {
                response.data = JSON.parse(responseText);
              }
            } catch (err) {
              // Server didn't respond with json
            }
            return response;
          });
      }
    } else {
      /* HTTP response status is not in 200s. Usually this will mean
       * either HTTP 400s (bad request from browser) or HTTP 500s (server error)
       * Our goal is to come up with best possible stacktrace and error message
       * to help developers understand the problem and debug
       */

      /*
       *Redirect to given url when redirect on auth failure is enabled
       */
      const { redirectAuthFailure } = await getConfig('@openmrs/esm-api');

      if (
        (url === makeUrl(sessionEndpoint) && response.status === 403) ||
        (redirectAuthFailure.enabled && redirectAuthFailure.errors.includes(response.status))
      ) {
        clearHistory();
        navigate({ to: redirectAuthFailure.url });

        /* We sometimes don't really want this promise to resolve since there's no response data,
         * nor do we want it to reject because that would trigger error handling. We instead
         * want it to remain in pending status while the navigation occurs.
         */
        return redirectAuthFailure.resolvePromise
          ? (Promise.resolve() as unknown as Promise<FetchResponse>)
          : new Promise<FetchResponse>(() => {});
      } else {
        // Attempt to download a response body, if it has one
        return response
          .clone()
          .text()
          .then(
            (responseText) => {
              let responseBody = responseText;
              try {
                responseBody = JSON.parse(responseText);
              } catch (err) {
                // Server didn't respond with json, so just go with the response text string
              }

              /* Make the fetch promise go into "rejected" status, with the best
               * possible stacktrace and error message.
               */
              throw new OpenmrsFetchError(url, response, responseBody, requestStacktrace);
            },
            (err) => {
              /* We weren't able to download a response body for this error.
               * Time to just give the best possible stacktrace and error message.
               */
              throw new OpenmrsFetchError(url, response, null, requestStacktrace);
            },
          );
      }
    }
  });
}

/**
 * The openmrsObservableFetch function is a wrapper around openmrsFetch
 * that returns an [Observable](https://rxjs-dev.firebaseapp.com/guide/observable)
 * instead of a promise. It exists in case using an Observable is
 * preferred or more convenient than a promise.
 *
 * @param url See [[openmrsFetch]]
 * @param fetchInit See [[openmrsFetch]]
 * @returns An Observable that produces exactly one Response object.
 * The response object is exactly the same as for [[openmrsFetch]].
 *
 * #### Example
 *
 * ```js
 * import { openmrsObservableFetch } from '@openmrs/esm-api'
 * const subscription = openmrsObservableFetch(`${restBaseUrl}/session').subscribe(
 *   response => console.log(response.data),
 *   err => {throw err},
 *   () => console.log('finished')
 * )
 * subscription.unsubscribe()
 * ```
 *
 * #### Cancellation
 *
 * To cancel the network request, simply call `subscription.unsubscribe();`
 *
 * @category API
 */
export function openmrsObservableFetch<T>(url: string, fetchInit: FetchConfig = {}) {
  if (typeof fetchInit !== 'object') {
    throw Error('The second argument to openmrsObservableFetch must be either omitted or an object');
  }

  const abortController = new AbortController();

  fetchInit.signal = abortController.signal;

  return new Observable<FetchResponse<T>>((observer) => {
    let hasResponse = false;

    openmrsFetch(url, fetchInit).then(
      (response) => {
        hasResponse = true;
        observer.next(response);
        observer.complete();
      },
      (err) => {
        hasResponse = true;
        observer.error(err);
      },
    );

    return () => {
      if (!hasResponse) {
        abortController.abort();
      }
    };
  });
}

export class OpenmrsFetchError extends Error {
  constructor(url: string, response: Response, responseBody: ResponseBody | null, requestStacktrace: Error) {
    super();
    this.message = `Server responded with ${response.status} (${response.statusText}) for url ${url}. Check err.responseBody or network tab in dev tools for more info`;
    requestStacktrace.message = this.message;
    this.responseBody = responseBody;
    this.response = response;
    this.stack = `Stacktrace for outgoing request:\n${requestStacktrace.stack}\nStacktrace for incoming response:\n${this.stack}`;
  }
  response: Response;
  responseBody: string | FetchResponseJson | null;
}

export interface FetchConfig extends Omit<RequestInit, 'body' | 'headers'> {
  headers?: FetchHeaders;
  body?: FetchBody | string;
}

type ResponseBody = string | FetchResponseJson;

export interface FetchHeaders {
  [key: string]: string | null;
}

interface FetchBody {
  [key: string]: any;
}

export interface FetchResponseJson {
  [key: string]: any;
}
