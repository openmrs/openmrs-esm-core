import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openmrsFetch, type FetchResponse } from '@openmrs/esm-api';
import { fetchCurrentPatient } from './current-patient';

vi.mock('@openmrs/esm-api');

const mockOpenmrsFetch = vi.mocked(openmrsFetch);

vi.mock('../openmrs-fetch', () => ({
  openmrsFetch: vi.fn(),
  fhirBaseUrl: '/ws/fhir2/R4',
}));

describe('fetchCurrentPatient', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockReset();
  });

  it('should return null when patientUuid is falsy', async () => {
    const result = await fetchCurrentPatient('');
    expect(result).toBeNull();
  });

  it('should return patient data when available', async () => {
    const mockPatient = { id: '123', name: [{ given: ['John'], family: 'Doe' }] };
    mockOpenmrsFetch.mockResolvedValue({ data: mockPatient, ok: true } as Partial<FetchResponse> as FetchResponse);

    const result = await fetchCurrentPatient('123');
    expect(result).toEqual(mockPatient);
  });

  it('should throw an error when the fetch fails', async () => {
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));

    await expect(fetchCurrentPatient('123')).rejects.toThrow('Network error');
  });
});
