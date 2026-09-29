import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
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
});
