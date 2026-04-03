import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openmrsFetch, type FetchResponse } from '@openmrs/esm-framework';
import { mockLoginLocations, mockSoleLoginLocation } from '../../__mocks__/locations.mock';
import { useLocationCount } from './location-picker.resource';
import { SWRConfig } from 'swr';
import React from 'react';

const mockOpenmrsFetch = vi.mocked(openmrsFetch);
const wrapper = ({ children }) => React.createElement(SWRConfig, { value: { provider: () => new Map() } }, children);
describe('useLocationCount', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockImplementation(async (url) => {
      const urlStr = url ?? '';
      if (urlStr.includes('_tag=Login+Location')) {
        return mockSoleLoginLocation as FetchResponse<any>;
      }
      return mockLoginLocations as FetchResponse<any>;
    });
  });

  it('builds the URL without a tag filter when useLoginLocationTag is false', async () => {
    const { result } = renderHook(() => useLocationCount(false));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const calledUrl = mockOpenmrsFetch.mock.calls[0][0] as string;

    expect(calledUrl).toBe('/ws/fhir2/R4/Location?_count=1');
    expect(calledUrl).not.toContain('_tag');
  });

  it('appends the _tag parameter when useLoginLocationTag is true', async () => {
    const { result } = renderHook(() => useLocationCount(true));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const calledUrl = mockOpenmrsFetch.mock.calls[0][0] as string;

    expect(calledUrl).toContain('_tag=Login+Location');
    expect(calledUrl).toContain('_count=1');
  });

  it('returns the total location count and first entry from the response', async () => {
    const { result } = renderHook(() => useLocationCount(false));

    await waitFor(() => {
      expect(result.current.locationCount).toBe(4);
    });

    expect(result.current.firstLocation).toEqual(mockLoginLocations.data.entry[0]);
  });

  it('returns the correct count when tag filter is active', async () => {
    const { result } = renderHook(() => useLocationCount(true));

    await waitFor(() => {
      expect(result.current.locationCount).toBe(1);
    });

    expect(result.current.firstLocation).toEqual(mockSoleLoginLocation.data.entry[0]);
  });

  it('returns null for firstLocation when the response has no entries', async () => {
    mockOpenmrsFetch.mockResolvedValue({
      data: { total: 0, entry: undefined },
    } as FetchResponse<any>);

    const { result } = renderHook(() => useLocationCount(false), { wrapper });

    await waitFor(() => {
      expect(result.current.firstLocation).toBeNull();
    });
  });
});
