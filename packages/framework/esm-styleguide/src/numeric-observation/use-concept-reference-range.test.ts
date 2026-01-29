import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useConceptReferenceRange } from './use-concept-reference-range';
import { swrWrapper } from '../test-utils';

const mockOpenmrsFetch = vi.fn();
vi.mock('@openmrs/esm-api', () => ({
  openmrsFetch: (...args: any[]) => mockOpenmrsFetch(...args),
  restBaseUrl: '/ws/rest/v1',
}));

const mockConceptReferenceRange = {
  hiNormal: 100,
  hiCritical: 150,
  hiAbsolute: 200,
  lowNormal: 50,
  lowCritical: 30,
  lowAbsolute: 10,
};

const renderUseConceptReferenceRange = (conceptUuid?: string) => {
  return renderHook(() => useConceptReferenceRange(conceptUuid), {
    wrapper: swrWrapper,
  });
};

describe('useConceptReferenceRange', () => {

  it('does not fetch when conceptUuid is undefined', () => {
    const { result } = renderUseConceptReferenceRange();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.referenceRange).toBeUndefined();
    expect(mockOpenmrsFetch).not.toHaveBeenCalled();
  });

  it('fetches concept data when conceptUuid is provided', async () => {
    const mockResponse = {
      data: {
        results: [
          {
            concept: 'test-concept-uuid',
            display: 'Test Concept',
            ...mockConceptReferenceRange,
          },
        ],
      },
    };

    mockOpenmrsFetch.mockResolvedValue(mockResponse);

    const { result } = renderUseConceptReferenceRange('test-concept-uuid');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.referenceRange).toEqual({
      ...mockConceptReferenceRange,
    });
    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      '/ws/rest/v1/conceptreferencerange/?concept=test-concept-uuid&v=full',
    );
  });

  it('returns loading state correctly', async () => {
    mockOpenmrsFetch.mockImplementation(() => new Promise(() => { }));

    const { result } = renderUseConceptReferenceRange('test-concept-uuid');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('returns error state on fetch failure', async () => {
    const mockError = new Error('Fetch failed');
    mockOpenmrsFetch.mockRejectedValue(mockError);

    const { result } = renderUseConceptReferenceRange('test-concept-uuid');

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.isLoading).toBe(false);
  });
});
