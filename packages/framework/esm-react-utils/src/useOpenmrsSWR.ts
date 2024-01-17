/** @module @category Utility */
import { useCallback, useMemo } from 'react';
import type { SWRConfiguration } from 'swr';
import useSWR from 'swr';
import { type FetchConfig, openmrsFetch, type FetchResponse } from '@openmrs/esm-api';
import useAbortController from './useAbortController';

export type ArgumentsTuple = [any, ...unknown[]];
export type Key = string | ArgumentsTuple | undefined | null;
export type UseOpenmrsSWROptions = {
  abortController?: AbortController;
  fetchInit?: FetchConfig;
  url?: string | ((key: Key) => string);
  swrConfig?: SWRConfiguration;
};

function getUrl(key: Key, url?: string | ((key: Key) => string)): string {
  if (url) {
    return typeof url === 'function' ? url(key) : url;
  }

  if (typeof key === 'string') {
    return key;
  }

  throw new Error(
    `When using useOpenmrsSWR with a key that is not a string, you must provide a url() function that converts the key to a valid url. The key for this hook is ${key}.`,
  );
}

/**
 * @beta
 *
 * This hook is intended to simplify using openmrsFetch in useSWR, while also ensuring that
 * all useSWR usages properly use an abort controller, so that fetch requests are cancelled
 * if the React component unmounts.
 *
 * @example
 * ```tsx
 * import { useOpenmrsSWR } from "@openmrs/esm-framework";
 *
 * function MyComponent() {
 *  const { data } = useOpenmrsSWR(key);
 *
 *  return (
 *    // render something with data
 *  );
 * }
 * ```
 *
 * Note that if you are using a complex SWR key you must provide a url function to the options parameter,
 * which translates the key into a URL to be sent to `openmrsFetch()`
 *
 * @example
 * ```tsx
 * import { useOpenmrsSWR } from "@openmrs/esm-framework";
 *
 * function MyComponent() {
 *  const { data } = useOpenmrsSWR(['key', 'url'], { url: (key) => key[1] });
 *
 *  return (
 *    // render something with data
 *  );
 * }
 * ```
 * @param key The SWR key to use
 * @param options An object of optional parameters to provide, including a {@link FetchConfig} object
 *   to pass to {@link openmrsFetch} or options to pass to SWR
 */
export function useOpenmrsSWR<DataType = any, ErrorType = any>(key: Key, options: UseOpenmrsSWROptions = {}) {
  const { abortController, fetchInit, url, swrConfig } = options;
  const ac = useAbortController();
  const abortSignal = useMemo<AbortSignal>(
    () => fetchInit?.signal ?? abortController?.signal ?? ac.signal,
    [abortController?.signal, fetchInit?.signal, ac.signal],
  );

  const fetcher = useCallback(
    (key: Key) => {
      const url_ = getUrl(key, url);
      return openmrsFetch(url_, { ...fetchInit, signal: abortSignal });
    },
    [abortSignal, fetchInit, url],
  );

  return useSWR<FetchResponse<DataType>, ErrorType>(key, fetcher, swrConfig);
}
