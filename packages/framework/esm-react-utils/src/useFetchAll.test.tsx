import React from 'react';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';
import { describe, expect, it, vi } from 'vitest';
import { type FetchResponse } from '@openmrs/esm-api';
import { useOpenmrsFetchAll, type UseServerFetchAllOptions } from './useOpenmrsFetchAll';
import { useFhirFetchAll } from './useFhirFetchAll';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig
    value={{
      provider: () => new Map(),
      dedupingInterval: 0,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}
  >
    {children}
  </SWRConfig>
);

function server(kind: 'rest' | 'fhir', total = 5, pageSize = 2) {
  let revision = 1;
  const fetcher = vi.fn(async (url: string) => {
    const parsed = new URL(url, window.location.href);
    const offset = Number(parsed.searchParams.get(kind === 'rest' ? 'startIndex' : '_getpagesoffset') ?? 0);
    // Deliberately return fewer results than the requested size: the next link,
    // not the requested size or total, must determine where to continue.
    const results = Array.from({ length: Math.max(0, Math.min(pageSize, total - offset)) }, (_, i) => ({
      id: `${offset + i}`,
      uuid: `${offset + i}`,
      resourceType: 'Observation',
      revision,
    }));
    parsed.searchParams.set(kind === 'rest' ? 'startIndex' : '_getpagesoffset', String(offset + pageSize));
    const more = offset + pageSize < total;
    return {
      data:
        kind === 'rest'
          ? { results, links: more ? [{ rel: 'next', uri: parsed.href }] : [] }
          : {
              resourceType: 'Bundle',
              entry: results.map((resource) => ({ resource })),
              link: more ? [{ relation: 'next', url: parsed.href }] : [],
            },
    } as FetchResponse<any>;
  });
  return {
    fetcher,
    update: () => {
      revision++;
    },
    resize: (size: number) => {
      total = size;
    },
  };
}

describe.each(['rest', 'fhir'] as const)('%s fetch-all', (kind) => {
  const url =
    kind === 'rest'
      ? '/ws/rest/v1/order?patient=fixture&limit=100'
      : '/ws/fhir2/R4/Observation?subject=fixture&_count=100';
  const useCollection = kind === 'rest' ? useOpenmrsFetchAll<any> : useFhirFetchAll<any>;
  const useFetchAll = (options: UseServerFetchAllOptions<any>, key: string | null = url) => useCollection(key, options);

  it('fetches each page once, follows server links without totals, and preserves the requested page size', async () => {
    const backend = server(kind);
    const { result } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper });
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
    expect(
      backend.fetcher.mock.calls.map(([path]) =>
        new URL(path, window.location.href).searchParams.get(kind === 'rest' ? 'startIndex' : '_getpagesoffset'),
      ),
    ).toEqual([null, '2', '4']);
    expect(
      backend.fetcher.mock.calls.every(
        ([path]) =>
          new URL(path, window.location.href).searchParams.get(kind === 'rest' ? 'limit' : '_count') === '100',
      ),
    ).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(false);
  });

  it('refreshes all pages once for a URL-prefix mutation even with two consumers', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => ({
        first: useFetchAll({ fetcher: backend.fetcher }),
        second: useFetchAll({ fetcher: backend.fetcher }),
        mutate: useSWRConfig().mutate,
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.second.data).toHaveLength(5));
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
    backend.update();
    backend.fetcher.mockClear();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url), undefined, {
        revalidate: true,
      });
    });
    await waitFor(() => expect(result.current.first.data?.every((row) => row.revision === 2)).toBe(true));
    expect(result.current.second.data?.every((row) => row.revision === 2)).toBe(true);
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
  });

  it('keeps the bound page-array mutator and selective revalidation contract', async () => {
    const backend = server(kind);
    const { result } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper });
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    backend.update();
    backend.fetcher.mockClear();
    let pages: FetchResponse<any>[] | undefined;
    await act(async () => {
      pages = await result.current.mutate((current) => current, {
        revalidate: (_page, key) => (key as string).includes(kind === 'rest' ? 'startIndex=2' : '_getpagesoffset=2'),
      });
    });
    expect(pages).toHaveLength(3);
    expect(backend.fetcher).toHaveBeenCalledTimes(1);
    expect(result.current.data?.map((row) => row.revision)).toEqual([1, 1, 2, 2, 1]);
    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.data?.every((row) => row.revision === 2)).toBe(true);
  });

  it('keeps a single-page consumer of the same URL separate from the aggregate', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => ({
        all: useFetchAll({ fetcher: backend.fetcher }),
        page: useSWR(url, backend.fetcher).data,
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    const page = result.current.page?.data;
    expect(kind === 'rest' ? page.results : page.entry).toHaveLength(2);
  });

  it('does not fetch a null URL and resets when the patient changes', async () => {
    const backend = server(kind);
    const { result, rerender } = renderHook(({ key }) => useFetchAll({ fetcher: backend.fetcher }, key), {
      wrapper,
      initialProps: { key: null as string | null },
    });
    expect(backend.fetcher).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    rerender({ key: url });
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    backend.update();
    rerender({ key: url.replace('fixture', 'another-patient') });
    expect(result.current.data).toBeUndefined();
    await waitFor(() => expect(result.current.data?.every((row) => row.revision === 2)).toBe(true));
  });

  it('preserves partial results while hiding incomplete default results and stops loading after failure', async () => {
    const backend = server(kind);
    let rejectLater: (reason: Error) => void = () => {};
    backend.fetcher.mockImplementationOnce(backend.fetcher.getMockImplementation()!).mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectLater = reject;
        }),
    );
    const { result } = renderHook(
      () => ({
        complete: useFetchAll({ fetcher: backend.fetcher }),
        partial: useFetchAll({ fetcher: backend.fetcher, partialData: true }),
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.partial.data).toHaveLength(2));
    await waitFor(() => expect(backend.fetcher).toHaveBeenCalledTimes(2));
    expect(result.current.complete.data).toBeUndefined();
    expect(result.current.complete.isLoading).toBe(true);
    await act(async () => {
      rejectLater(new Error('Later page failed'));
    });
    await waitFor(() => expect(result.current.complete.error?.message).toBe('Later page failed'));
    expect(result.current.complete.data).toBeUndefined();
    expect(result.current.complete.isLoading).toBe(false);
    expect(result.current.partial.data).toHaveLength(2);
    await act(async () => {
      await result.current.complete.mutate();
    });
    await waitFor(() => expect(result.current.complete.data).toHaveLength(5));
    expect(result.current.complete.error).toBeUndefined();
    expect(result.current.partial.data).toHaveLength(5);
  });

  it('recovers from an initial failure through URL invalidation', async () => {
    const backend = server(kind);
    backend.fetcher.mockRejectedValueOnce(new Error('First page failed'));
    const { result } = renderHook(
      () => ({ all: useFetchAll({ fetcher: backend.fetcher }), mutate: useSWRConfig().mutate }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.all.error?.message).toBe('First page failed'));
    expect(result.current.all.isLoading).toBe(false);
    expect(result.current.all.data).toBeUndefined();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    expect(result.current.all.error).toBeUndefined();
    expect(backend.fetcher).toHaveBeenCalledTimes(4);
  });

  it('returns an empty collection with no next link, including a FHIR bundle without entries', async () => {
    const backend = server(kind, 0);
    if (kind === 'fhir') {
      backend.fetcher.mockResolvedValue({ data: { resourceType: 'Bundle', total: 0 } } as FetchResponse<any>);
    }
    const { result } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([]);
    expect(result.current.hasMore).toBe(false);
    expect(backend.fetcher).toHaveBeenCalledTimes(1);
  });

  it('supports a larger initial size without fetching beyond the final page', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => useFetchAll({ fetcher: backend.fetcher, swrInfiniteConfig: { initialSize: 10 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
  });

  it('follows dependent next links sequentially even if parallel fetching is configured', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => useFetchAll({ fetcher: backend.fetcher, swrInfiniteConfig: { parallel: true } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
  });

  it('revalidates a cached remount without an additional bridge request', async () => {
    const backend = server(kind);
    const cache = new Map();
    const cachedWrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={{ provider: () => cache, dedupingInterval: 0 }}>{children}</SWRConfig>
    );
    const { result: first, unmount } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), {
      wrapper: cachedWrapper,
    });
    await waitFor(() => expect(first.current.data).toHaveLength(5));
    unmount();
    backend.update();
    backend.fetcher.mockClear();
    const { result: second } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper: cachedWrapper });
    await waitFor(() => expect(second.current.data?.[0].revision).toBe(2));
    expect(second.current.data).toHaveLength(5);
    expect(backend.fetcher).toHaveBeenCalledTimes(1);
  });

  it('does not duplicate polling inherited from an SWR provider', async () => {
    vi.useFakeTimers();
    const backend = server(kind);
    const pollingWrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={{ provider: () => new Map(), refreshInterval: 1000, dedupingInterval: 0 }}>
        {children}
      </SWRConfig>
    );
    const { result, unmount } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), {
      wrapper: pollingWrapper,
    });
    try {
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await vi.advanceTimersByTimeAsync(1);
        });
      }
      expect(result.current.data).toHaveLength(5);
      backend.update();
      backend.fetcher.mockClear();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
      expect(result.current.data?.[0].revision).toBe(2);
      expect(backend.fetcher).toHaveBeenCalledTimes(1);
    } finally {
      unmount();
      vi.useRealTimers();
    }
  });

  it('continues refreshing after the first of two shared consumers disables its URL', async () => {
    const backend = server(kind);
    const { result, rerender } = renderHook(
      ({ enabled }) => ({
        first: useFetchAll({ fetcher: backend.fetcher }, enabled ? url : null),
        second: useFetchAll({ fetcher: backend.fetcher }),
        mutate: useSWRConfig().mutate,
      }),
      { wrapper, initialProps: { enabled: true } },
    );
    await waitFor(() => expect(result.current.second.data).toHaveLength(5));
    rerender({ enabled: false });
    backend.update();
    backend.fetcher.mockClear();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    expect(result.current.first.data).toBeUndefined();
    expect(result.current.second.data?.every((row) => row.revision === 2)).toBe(true);
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
  });

  it('follows a next link through an empty intermediate page using the frontend origin', async () => {
    const backend = server(kind);
    const implementation = backend.fetcher.getMockImplementation()!;
    backend.fetcher.mockImplementationOnce(async (path) => {
      const response = await implementation(path);
      if (kind === 'rest') {
        response.data.results = [];
        response.data.links[0].uri = response.data.links[0].uri.replace(window.location.origin, 'http://backend:8080');
      } else {
        delete response.data.entry;
        response.data.link[0].url = response.data.link[0].url.replace(window.location.origin, 'http://backend:8080');
      }
      return response;
    });
    const { result } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper });
    await waitFor(() => expect(result.current.data).toHaveLength(3));
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
    expect(new URL(backend.fetcher.mock.calls[1][0]).origin).toBe(window.location.origin);
  });

  it('retains focus revalidation without a second refresh from the bridge', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () =>
        useFetchAll({
          fetcher: backend.fetcher,
          swrInfiniteConfig: {
            revalidateOnFocus: true,
            focusThrottleInterval: 0,
          },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    backend.update();
    backend.fetcher.mockClear();
    await act(async () => {
      window.dispatchEvent(new Event('focus'));
    });
    await waitFor(() => expect(result.current.data?.[0].revision).toBe(2));
    expect(backend.fetcher).toHaveBeenCalledTimes(1);
  });

  it('loads 500 records with one request per server page', async () => {
    const pageSize = kind === 'rest' ? 50 : 10;
    const backend = server(kind, 500, pageSize);
    const { result } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper });
    await waitFor(() => expect(result.current.data).toHaveLength(500));
    expect(backend.fetcher).toHaveBeenCalledTimes(500 / pageSize);
  });

  it('keeps refreshes isolated to their SWR provider', async () => {
    const first = server(kind);
    const second = server(kind);
    const { result: left } = renderHook(
      () => ({ all: useFetchAll({ fetcher: first.fetcher }), mutate: useSWRConfig().mutate }),
      {
        wrapper,
      },
    );
    const { result: right } = renderHook(() => useFetchAll({ fetcher: second.fetcher }), { wrapper });
    await waitFor(() => expect(left.current.all.data).toHaveLength(5));
    await waitFor(() => expect(right.current.data).toHaveLength(5));
    first.update();
    second.fetcher.mockClear();
    await act(async () => {
      await left.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    expect(left.current.all.data?.[0].revision).toBe(2);
    expect(right.current.data?.[0].revision).toBe(1);
    expect(second.fetcher).not.toHaveBeenCalled();
  });

  it('handles overlapping explicit refreshes without recursive requests', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => ({ all: useFetchAll({ fetcher: backend.fetcher }), mutate: useSWRConfig().mutate }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    backend.update();
    backend.fetcher.mockClear();
    await act(async () => {
      const matches = (key: unknown) => typeof key === 'string' && key.startsWith(url);
      await Promise.all([result.current.mutate(matches), result.current.mutate(matches)]);
    });
    await waitFor(() => expect(result.current.all.isValidating).toBe(false));
    expect(result.current.all.data?.every((row) => row.revision === 2)).toBe(true);
    // Each explicit invalidation may perform one refresh. Neither may cause an
    // additional chain through the other cache entry.
    expect(backend.fetcher.mock.calls.length).toBeLessThanOrEqual(6);
  });

  it('discovers added pages and drops removed pages after URL invalidation', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => ({ all: useFetchAll({ fetcher: backend.fetcher }), mutate: useSWRConfig().mutate }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    backend.resize(7);
    backend.fetcher.mockClear();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    await waitFor(() => expect(result.current.all.data).toHaveLength(7));
    expect(backend.fetcher).toHaveBeenCalledTimes(4);
    backend.resize(1);
    backend.fetcher.mockClear();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    await waitFor(() => expect(result.current.all.data).toHaveLength(1));
    expect(backend.fetcher).toHaveBeenCalledTimes(1);
  });

  it('keeps immutable collections idle on focus and reconnect but allows explicit refresh', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => ({
        all: useFetchAll({
          fetcher: backend.fetcher,
          immutable: true,
          swrInfiniteConfig: { focusThrottleInterval: 0 },
        }),
        mutate: useSWRConfig().mutate,
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    backend.update();
    backend.fetcher.mockClear();
    await act(async () => {
      window.dispatchEvent(new Event('focus'));
      window.dispatchEvent(new Event('online'));
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(backend.fetcher).not.toHaveBeenCalled();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    expect(result.current.all.data?.every((row) => row.revision === 2)).toBe(true);
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
  });

  it('ignores an old patient response arriving after the URL changes', async () => {
    const backend = server(kind);
    const oldResponse = await backend.fetcher(url);
    backend.fetcher.mockClear();
    let resolveOld: (response: FetchResponse<any>) => void = () => {};
    backend.fetcher.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    );
    const { result, rerender } = renderHook(({ key }) => useFetchAll({ fetcher: backend.fetcher }, key), {
      wrapper,
      initialProps: { key: url },
    });
    backend.update();
    rerender({ key: url.replace('fixture', 'another-patient') });
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    await act(async () => {
      resolveOld(oldResponse);
    });
    expect(result.current.data?.every((row) => row.revision === 2)).toBe(true);
    expect(backend.fetcher).toHaveBeenCalledTimes(4);
  });

  it('accepts an empty page array from an explicitly zero initial size', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => useFetchAll({ fetcher: backend.fetcher, swrInfiniteConfig: { initialSize: 0 } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([]);
    expect(backend.fetcher).not.toHaveBeenCalled();
  });

  it('refreshes during initial page expansion without publishing the superseded response', async () => {
    const backend = server(kind);
    const implementation = backend.fetcher.getMockImplementation()!;
    const secondUrl = `${window.location.origin}${url}&${kind === 'rest' ? 'startIndex' : '_getpagesoffset'}=2`;
    const oldPage = await implementation(secondUrl);
    let resolveOld: (response: FetchResponse<any>) => void = () => {};
    backend.fetcher.mockImplementationOnce(implementation).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    );
    const { result } = renderHook(
      () => ({ all: useFetchAll({ fetcher: backend.fetcher }), mutate: useSWRConfig().mutate }),
      { wrapper },
    );
    await waitFor(() => expect(backend.fetcher).toHaveBeenCalledTimes(2));
    expect(result.current.all.data).toBeUndefined();
    backend.update();
    backend.fetcher.mockClear();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    await act(async () => {
      resolveOld(oldPage);
    });
    expect(result.current.all.data?.every((row) => row.revision === 2)).toBe(true);
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
  });

  it('honors an explicit first-page revalidation preference', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => useFetchAll({ fetcher: backend.fetcher, swrInfiniteConfig: { revalidateFirstPage: true } }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    expect(backend.fetcher).toHaveBeenCalledTimes(5);
  });

  it('stops cyclic next links with an error and can recover after invalidation', async () => {
    const backend = server(kind);
    const implementation = backend.fetcher.getMockImplementation()!;
    const first = await implementation(url);
    backend.fetcher.mockResolvedValue(first);
    const { result } = renderHook(
      () => ({ all: useFetchAll({ fetcher: backend.fetcher }), mutate: useSWRConfig().mutate }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.all.error?.message).toContain('repeated next link'));
    expect(result.current.all.data).toBeUndefined();
    expect(result.current.all.isLoading).toBe(false);
    expect(backend.fetcher).toHaveBeenCalledTimes(2);
    backend.fetcher.mockImplementation(implementation);
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    expect(result.current.all.error).toBeUndefined();
  });

  it('does not duplicate page expansion under React StrictMode', async () => {
    const backend = server(kind);
    const { result } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper, reactStrictMode: true });
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    expect(backend.fetcher).toHaveBeenCalledTimes(3);
  });

  it.each([true, false])('honors the provider first-page revalidation preference: %s', async (revalidateFirstPage) => {
    const backend = server(kind);
    const config = { provider: () => new Map(), dedupingInterval: 0, revalidateFirstPage };
    const configuredWrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={config}>{children}</SWRConfig>
    );
    const { result } = renderHook(() => useFetchAll({ fetcher: backend.fetcher }), { wrapper: configuredWrapper });
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    expect(backend.fetcher).toHaveBeenCalledTimes(revalidateFirstPage ? 5 : 3);
  });

  it('lets the infinite hook own error retries without retrying through the bridge', async () => {
    const backend = server(kind);
    const onError = vi.fn();
    const retryConfig = {
      provider: () => new Map(),
      dedupingInterval: 0,
      errorRetryInterval: 1,
      errorRetryCount: 1,
      onError,
    };
    const retryWrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={retryConfig}>{children}</SWRConfig>
    );
    const { result } = renderHook(
      () => ({ all: useFetchAll({ fetcher: backend.fetcher }), mutate: useSWRConfig().mutate }),
      { wrapper: retryWrapper },
    );
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    backend.update();
    backend.fetcher.mockClear();
    backend.fetcher
      .mockImplementationOnce(backend.fetcher.getMockImplementation()!)
      .mockRejectedValueOnce(new Error('Retry page two'));
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url));
    });
    await waitFor(() => expect(result.current.all.data?.every((row) => row.revision === 2)).toBe(true));
    expect(backend.fetcher).toHaveBeenCalledTimes(5);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('refreshes a mixed single-page and fetch-all consumer without changing either response shape', async () => {
    const backend = server(kind);
    const { result } = renderHook(
      () => ({
        all: useFetchAll({ fetcher: backend.fetcher }),
        page: useSWR(url, backend.fetcher),
        mutate: useSWRConfig().mutate,
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.all.data).toHaveLength(5));
    backend.update();
    backend.fetcher.mockClear();
    await act(async () => {
      await result.current.mutate((key) => typeof key === 'string' && key.startsWith(url), undefined, {
        revalidate: true,
      });
    });
    expect(result.current.all.data?.every((row) => row.revision === 2)).toBe(true);
    const page = result.current.page.data?.data;
    const rows = kind === 'rest' ? page.results : page.entry.map((entry) => entry.resource);
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.revision === 2)).toBe(true);
    // One three-page collection refresh and one independent single-page refresh.
    expect(backend.fetcher).toHaveBeenCalledTimes(4);
  });

  it.each([
    { immutable: false, revalidate: true },
    { immutable: true, revalidate: true },
    { immutable: false, revalidate: false },
  ])(
    'refreshes every page on remount after URL invalidation while unmounted: %j',
    async ({ immutable, revalidate }) => {
      const backend = server(kind);
      const snapshot = { current: undefined as ReturnType<typeof useFetchAll> | undefined };
      let mutate: ReturnType<typeof useSWRConfig>['mutate'];
      function Collection() {
        snapshot.current = useFetchAll({ fetcher: backend.fetcher, immutable });
        return null;
      }
      function App({ visible }: { visible: boolean }) {
        mutate = useSWRConfig().mutate;
        return visible ? <Collection /> : null;
      }
      const { rerender } = render(<App visible />, { wrapper });
      await waitFor(() => expect(snapshot.current?.data).toHaveLength(5));
      rerender(<App visible={false} />);
      backend.update();
      backend.fetcher.mockClear();
      await act(async () => {
        await mutate((key) => typeof key === 'string' && key.startsWith(url), undefined, { revalidate });
      });
      expect(backend.fetcher).not.toHaveBeenCalled();
      rerender(<App visible />);
      await waitFor(() => expect(snapshot.current?.data?.every((row) => row.revision === 2)).toBe(true));
      expect(backend.fetcher).toHaveBeenCalledTimes(3);
    },
  );

  it('expands partial fallback data even when mount revalidation is disabled', async () => {
    const backend = server(kind);
    const first = await backend.fetcher(url);
    backend.fetcher.mockClear();
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () =>
        useFetchAll({
          fetcher: backend.fetcher,
          swrInfiniteConfig: { fallbackData: [first], revalidateOnMount: false, revalidateFirstPage: false, onSuccess },
        }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.data).toHaveLength(5));
    expect(onSuccess).toHaveBeenCalled();
    expect(onSuccess.mock.calls.at(-1)?.[0]).toHaveLength(3);
  });
});
