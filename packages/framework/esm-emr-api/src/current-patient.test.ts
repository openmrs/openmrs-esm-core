import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openmrsFetch, type FetchResponse } from '@openmrs/esm-api';
import { getSynchronizationItems } from '@openmrs/esm-offline';
import { fetchCurrentPatient } from './current-patient';

vi.mock('@openmrs/esm-api');

const mockOpenmrsFetch = vi.mocked(openmrsFetch);
const mockGetSynchronizationItems = vi.mocked(getSynchronizationItems);

vi.mock('../openmrs-fetch', () => ({
  openmrsFetch: vi.fn(),
  fhirBaseUrl: '/ws/fhir2/R4',
}));

vi.mock('@openmrs/esm-offline', () => ({
  getSynchronizationItems: vi.fn(),
}));

describe('fetchPatientData', () => {
  beforeEach(() => {
    mockGetSynchronizationItems.mockResolvedValue([]);
  });

  it('should return null when patientUuid is falsy', async () => {
    const result = await fetchCurrentPatient('');
    expect(result).toBeNull();
  });

  it('should return online patient data when available', async () => {
    const mockPatient = { id: '123', name: [{ given: ['John'], family: 'Doe' }] };
    mockOpenmrsFetch.mockResolvedValue({ data: mockPatient, ok: true } as Partial<FetchResponse> as FetchResponse);

    const result = await fetchCurrentPatient('123');
    expect(result).toEqual(mockPatient);
  });

  it('should return offline patient data when online fetch fails', async () => {
    const mockOfflinePatient = { id: '123', name: [{ given: ['Jane'], family: 'Doe' }] };
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));
    mockGetSynchronizationItems.mockResolvedValue([{ fhirPatient: mockOfflinePatient }]);

    const result = await fetchCurrentPatient('123');
    expect(result).toEqual(mockOfflinePatient);
  });

  it('should throw an error when both online and offline fetches fail', async () => {
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));
    mockGetSynchronizationItems.mockResolvedValue([]);

    await expect(fetchCurrentPatient('123')).rejects.toThrow('Network error');
  });
});
