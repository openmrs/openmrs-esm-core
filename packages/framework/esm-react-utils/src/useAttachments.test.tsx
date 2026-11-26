import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { openmrsFetch, type FetchResponse } from '@openmrs/esm-api';
import { attachmentUrl, type AttachmentResponse } from '@openmrs/esm-emr-api';
import { useAttachments } from './useAttachments';

vi.mock('@openmrs/esm-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@openmrs/esm-api')>()),
  openmrsFetch: vi.fn(),
}));

const mockOpenmrsFetch = vi.mocked(openmrsFetch);

const attachment: AttachmentResponse = {
  uuid: 'attachment-uuid',
  filename: 'photo.png',
  comment: 'Wound photo',
  dateTime: '2026-09-18T10:00:00.000+0000',
  bytesMimeType: 'image/png',
  bytesContentFamily: 'IMAGE',
};

// Each test gets its own SWR cache so keys requested in one test do not satisfy the next.
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
);

describe('useAttachments', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockReset();
    mockOpenmrsFetch.mockResolvedValue({ data: { results: [attachment] } } as FetchResponse<{
      results: Array<AttachmentResponse>;
    }>);
  });

  it('fetches the patient attachments and unwraps the results', async () => {
    const { result } = renderHook(() => useAttachments('patient-uuid', true), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${attachmentUrl}?patient=patient-uuid&includeEncounterless=true`);
    expect(result.current.data).toEqual([attachment]);
  });

  it('fetches only the attachments on an encounter when one is given', async () => {
    const { result } = renderHook(() => useAttachments('patient-uuid', true, 'encounter-uuid'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${attachmentUrl}?patient=patient-uuid&encounter=encounter-uuid`);
    expect(result.current.data).toEqual([attachment]);
  });

  it('does not fetch while the patient UUID is empty', () => {
    const { result } = renderHook(() => useAttachments(null, true), { wrapper });

    expect(mockOpenmrsFetch).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('returns an empty list while loading', () => {
    mockOpenmrsFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useAttachments('patient-uuid', true), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it('loads 51 attachments across pages and preserves the bound response-shaped mutator', async () => {
    const attachments = Array.from({ length: 51 }, (_, i) => ({ ...attachment, uuid: `attachment-${i}` }));
    const next = `http://backend/openmrs${attachmentUrl}?patient=patient-uuid&includeEncounterless=true&startIndex=50`;
    mockOpenmrsFetch.mockImplementation(
      async (url) =>
        ({
          data: {
            results: url.includes('startIndex=50') ? attachments.slice(50) : attachments.slice(0, 50),
            links: url.includes('startIndex=50') ? [] : [{ rel: 'next', uri: next }],
          },
        }) as FetchResponse,
    );
    const { result } = renderHook(() => useAttachments('patient-uuid', true), { wrapper });
    await waitFor(() => expect(result.current.data).toHaveLength(51));
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(2);
    mockOpenmrsFetch.mockClear();
    await act(async () => {
      const response = await result.current.mutate();
      expect(response?.data.results).toHaveLength(51);
    });
    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(2);
  });

  it('reports a later-page failure instead of returning an incomplete collection', async () => {
    mockOpenmrsFetch
      .mockResolvedValueOnce({
        data: {
          results: [attachment],
          links: [{ rel: 'next', uri: `http://backend/openmrs${attachmentUrl}?startIndex=1` }],
        },
      } as FetchResponse)
      .mockRejectedValueOnce(new Error('Later page failed'));
    const { result } = renderHook(() => useAttachments('patient-uuid', true), { wrapper });
    await waitFor(() => expect(result.current.error?.message).toBe('Later page failed'));
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
