import { getSynchronizationItems } from '@openmrs/esm-offline';
import { type FetchResponse } from '../types';
import { fetchPatientData } from './current-patient';
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

describe('fetchPatientData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSynchronizationItems.mockResolvedValue([]);
  });

  it('should return null when patientUuid is falsy', async () => {
    const result = await fetchPatientData('', true);
    expect(result).toBeNull();
  });

  it('should return online patient data when available', async () => {
    const mockPatient = { id: '123', name: [{ given: ['John'], family: 'Doe' }] };
    mockOpenmrsFetch.mockResolvedValue({ data: mockPatient, ok: true } as Partial<FetchResponse> as FetchResponse);

    const result = await fetchPatientData('123', true);
    expect(result).toEqual(mockPatient);
  });

  it('should return offline patient data when online fetch fails', async () => {
    const mockOfflinePatient = { id: '123', name: [{ given: ['Jane'], family: 'Doe' }] };
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));
    mockGetSynchronizationItems.mockResolvedValue([{ fhirPatient: mockOfflinePatient }]);

    const result = await fetchPatientData('123', true);
    expect(result).toEqual(mockOfflinePatient);
  });

  it('should throw an error when both online and offline fetches fail', async () => {
    mockOpenmrsFetch.mockRejectedValue(new Error('Network error'));
    mockGetSynchronizationItems.mockResolvedValue([]);

    await expect(fetchPatientData('123', true)).rejects.toThrow('Network error');
  });
});
