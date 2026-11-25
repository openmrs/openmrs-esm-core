import { describe, expect, it, vi } from 'vitest';
import { openmrsFetchAll } from './openmrs-fetch-all';

function page(results: number[], next?: string) {
  return Object.assign(new Response(null, { status: 200, headers: { 'X-Test': 'preserved' } }), {
    data: { results, links: next ? [{ rel: 'next', uri: next }] : [] },
  });
}

describe('openmrsFetchAll', () => {
  it('follows server links through short and empty pages without requiring a total', async () => {
    const first = page([1], 'http://backend:8080/openmrs/ws/rest/v1/example?limit=100&startIndex=1');
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(page([], 'http://backend:8080/openmrs/ws/rest/v1/example?limit=100&startIndex=2'))
      .mockResolvedValueOnce(page([2, 3]));
    const result = await openmrsFetchAll<number>('/ws/rest/v1/example?limit=100', fetcher);
    expect(result.data.results).toEqual([1, 2, 3]);
    expect(result.data.links).toEqual([]);
    expect(result.headers.get('X-Test')).toBe('preserved');
    expect(result.status).toBe(200);
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      '/ws/rest/v1/example?limit=100',
      `${window.location.origin}/openmrs/ws/rest/v1/example?limit=100&startIndex=1`,
      `${window.location.origin}/openmrs/ws/rest/v1/example?limit=100&startIndex=2`,
    ]);
  });

  it('requests later pages from a remote API origin rather than the frontend origin', async () => {
    vi.stubGlobal('openmrsBase', 'https://api.example.test/openmrs');
    try {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce(page([1], 'http://backend:8080/openmrs/ws/rest/v1/example?startIndex=1'))
        .mockResolvedValueOnce(page([2]));
      const result = await openmrsFetchAll<number>('/ws/rest/v1/example', fetcher);
      expect(result.data.results).toEqual([1, 2]);
      expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
        '/ws/rest/v1/example',
        'https://api.example.test/openmrs/ws/rest/v1/example?startIndex=1',
      ]);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('does not make another request without a next link', async () => {
    const fetcher = vi.fn().mockResolvedValue(Object.assign(new Response(), { data: { results: [] } }));
    expect((await openmrsFetchAll<number>('/ws/rest/v1/example', fetcher)).data.results).toEqual([]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('rejects a later failure instead of publishing the first page as complete', async () => {
    const first = page([1], 'http://backend/openmrs/ws/rest/v1/example?startIndex=1');
    const fetcher = vi.fn().mockResolvedValueOnce(first).mockRejectedValueOnce(new Error('Page failed'));
    await expect(openmrsFetchAll<number>('/ws/rest/v1/example', fetcher)).rejects.toThrow('Page failed');
    // Do not modify a response until the collection has been fetched successfully.
    expect(first.data.links).toHaveLength(1);
    expect(first.data.results).toEqual([1]);
  });

  it('rejects cyclic pagination instead of requesting pages indefinitely', async () => {
    const first = page([1], 'http://backend/openmrs/ws/rest/v1/example?startIndex=1');
    const fetcher = vi.fn().mockResolvedValue(first);
    await expect(openmrsFetchAll<number>('/ws/rest/v1/example', fetcher)).rejects.toThrow('repeated next link');
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(first.data.results).toEqual([1]);
  });

  it('propagates cancellation without fetching additional pages', async () => {
    const controller = new AbortController();
    const fetcher = vi.fn(async () => {
      controller.signal.throwIfAborted();
      controller.abort();
      return page([1], 'http://backend/openmrs/ws/rest/v1/example?startIndex=1');
    });
    await expect(openmrsFetchAll<number>('/ws/rest/v1/example', fetcher)).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
