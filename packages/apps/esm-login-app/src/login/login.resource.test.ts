import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openmrsFetch, useSession, type FetchResponse, type Session } from '@openmrs/esm-framework';
import { SWRConfig } from 'swr';
import { mockLoginLocations } from '../../__mocks__/locations.mock';
import { useLoginLocations } from '../login.resource';

const mockOpenmrsFetch = vi.mocked(openmrsFetch);
const mockUseSession = vi.mocked(useSession);

const userUuid = '90bd24b3-e700-46b0-a5ef-c85afdfededd';

// Provide a fresh SWR cache for every test so results are never served from a
// previous test's cache. Required because useSwrInfinite caches by URL key.
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(SWRConfig, { value: { provider: () => new Map() } }, children);

describe('useLoginLocations', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      user: { uuid: userUuid, display: 'Test User', userProperties: {} },
      authenticated: true,
      sessionId: 'test-session-id',
    } as Session);

    mockOpenmrsFetch.mockResolvedValue(mockLoginLocations as FetchResponse<any>);
  });

  it('does not fetch until the user UUID is available', async () => {
    mockUseSession.mockReturnValue({ authenticated: false, sessionId: '' } as Session);

    const { result } = renderHook(() => useLoginLocations(50, '', true), { wrapper });

    // isLoading stays false and no fetch is made because constructUrl returns null
    expect(result.current.isLoading).toBe(false);
    expect(mockOpenmrsFetch).not.toHaveBeenCalled();
  });

  it('calls the user-scoped REST endpoint with the correct user UUID', async () => {
    const { result } = renderHook(() => useLoginLocations(50, '', true), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const calledUrl = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(`/ws/rest/v1/user/${userUuid}/location`);
  });

  it('appends the tag parameter when useLoginLocationTag is true', async () => {
    const { result } = renderHook(() => useLoginLocations(50, '', true), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const calledUrl = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('tag=Login+Location');
  });

  it('does not append the tag parameter when useLoginLocationTag is false', async () => {
    const { result } = renderHook(() => useLoginLocations(50, '', false), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const calledUrl = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('tag=');
  });

  it('appends the search query when a search term is provided', async () => {
    const { result } = renderHook(() => useLoginLocations(50, 'outpatient', true), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const calledUrl = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('q=outpatient');
  });

  it('does not append a search query when the search term is empty', async () => {
    const { result } = renderHook(() => useLoginLocations(50, '', true), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const calledUrl = mockOpenmrsFetch.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('q=');
  });

  it('returns the locations from the response', async () => {
    const { result } = renderHook(() => useLoginLocations(50, '', true), { wrapper });

    await waitFor(() => {
      expect(result.current.locations).not.toBeNull();
    });

    expect(result.current.locations).toEqual(mockLoginLocations.data.entry);
    expect(result.current.totalResults).toBe(4);
  });

  it('returns null for locations while the user UUID is unavailable', () => {
    mockUseSession.mockReturnValue({ authenticated: false, sessionId: '' } as Session);

    const { result } = renderHook(() => useLoginLocations(50, '', true), { wrapper });

    expect(result.current.locations).toBeNull();
  });
});
