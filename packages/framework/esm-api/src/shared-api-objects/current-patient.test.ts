import { renderHook, waitFor } from '@testing-library/react';
import { getSynchronizationItems } from '@openmrs/esm-offline';
import { type FetchResponse } from '../types';
import { useCurrentPatient } from './current-patient';
import { openmrsFetch } from '../openmrs-fetch';

const mockOpenmrsFetch = jest.mocked(openmrsFetch);
const mockGetSynchronizationItems = jest.mocked(getSynchronizationItems);

jest.mock('../openmrs-fetch', () => ({
  openmrsFetch: jest.fn(),
  fhirBaseUrl: '/ws/fhir2/R4',
}));

jest.mock('@openmrs/esm-offline', () => ({
  getSynchronizationItems: jest.fn(),
}));

describe('useCurrentPatient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when the patient is not found', async () => {
    mockGetSynchronizationItems.mockResolvedValue([]);
    mockOpenmrsFetch.mockResolvedValue({
      data: null,
      ok: false,
      status: 404,
    } as Partial<FetchResponse> as FetchResponse);

    const { result } = renderHook(() => useCurrentPatient('234'));

    await waitFor(() => {
      expect(result.current.data).toEqual(null);
    });
  });

  it('fetches and returns the current patient when online', async () => {
    mockOpenmrsFetch.mockResolvedValue({
      data: {
        id: '123',
        gender: 'male',
        name: [
          {
            id: '456',
            text: 'James K John',
            family: 'John',
            given: ['James', 'K'],
          },
        ],
        birthDate: '2003',
        deceasedBoolean: false,
      },
      ok: true,
    } as Partial<FetchResponse> as FetchResponse);

    const { result } = renderHook(() => useCurrentPatient('123'));

    await waitFor(() => {
      expect(result.current.data).toEqual({
        id: '123',
        gender: 'male',
        name: [
          {
            id: '456',
            text: 'James K John',
            family: 'John',
            given: ['James', 'K'],
          },
        ],
        birthDate: '2003',
        deceasedBoolean: false,
      });

      expect(mockOpenmrsFetch).toHaveBeenCalledWith(`/ws/fhir2/R4/Patient/123`, undefined);
    });
  });

  it('fetches offline patient data when online fetch fails', async () => {
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));
    mockGetSynchronizationItems.mockResolvedValue([{ fhirPatient: { id: '567', name: [{ family: 'Doe' }] } }]);

    const { result } = renderHook(() => useCurrentPatient('567'));

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: '567', name: [{ family: 'Doe' }] });
    });
  });

  it('returns null when patient is not found online or offline', async () => {
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));
    mockGetSynchronizationItems.mockResolvedValue([]);

    const { result } = renderHook(() => useCurrentPatient('789'));

    await waitFor(() => {
      expect(result.current.data).toBeNull();
    });
  });
});
