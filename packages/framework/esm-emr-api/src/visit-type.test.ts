import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openmrsFetch } from '@openmrs/esm-api';
import { getVisitTypes, visitTypesUrl } from './visit-type';

vi.mock('@openmrs/esm-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@openmrs/esm-api')>()),
  openmrsFetch: vi.fn(),
}));

const fetcher = vi.mocked(openmrsFetch);
beforeEach(() => {
  fetcher.mockReset();
  vi.stubGlobal('openmrsBase', '/openmrs');
});
afterEach(() => vi.unstubAllGlobals());

describe('getVisitTypes', () => {
  it('returns every visit type while preserving the public mapped shape', async () => {
    const types = Array.from({ length: 51 }, (_, i) => ({
      uuid: `${i}`,
      name: `Type ${i}`,
      display: `Type ${i}`,
      retired: false,
    }));
    fetcher
      .mockResolvedValueOnce({
        data: {
          results: types.slice(0, 50),
          links: [{ rel: 'next', uri: 'http://backend/openmrs/ws/rest/v1/visittype?startIndex=50' }],
        },
      } as never)
      .mockResolvedValueOnce({ data: { results: types.slice(50) } } as never);
    const result = await getVisitTypes();
    expect(result).toHaveLength(51);
    expect(result[50]).toEqual({ uuid: '50', name: 'Type 50', display: 'Type 50' });
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      visitTypesUrl,
      `${window.location.origin}/openmrs/ws/rest/v1/visittype?startIndex=50`,
    ]);
  });

  it('preserves the optional URL argument and propagates a later failure', async () => {
    const url = `${visitTypesUrl}?limit=1`;
    fetcher
      .mockResolvedValueOnce({
        data: {
          results: [{ uuid: '1' }],
          links: [{ rel: 'next', uri: 'http://backend/openmrs/ws/rest/v1/visittype?limit=1&startIndex=1' }],
        },
      } as never)
      .mockRejectedValueOnce(new Error('Later page failed'));
    await expect(getVisitTypes(url)).rejects.toThrow('Later page failed');
    expect(fetcher).toHaveBeenNthCalledWith(1, url);
  });
});
