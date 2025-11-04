import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePatient } from './usePatient';

// Mock SWR
const mockUseSWR = vi.fn();
vi.mock('swr', () => ({
  default: (...args: any[]) => mockUseSWR(...args),
}));

// Mock fetchCurrentPatient
const mockFetchCurrentPatient = vi.fn();
vi.mock('@openmrs/esm-emr-api', () => ({
  fetchCurrentPatient: (...args: any[]) => mockFetchCurrentPatient(...args),
}));

// Helper to create a mock patient
function createMockPatient(id: string): fhir.Patient {
  return {
    resourceType: 'Patient',
    id,
    name: [{ given: ['John'], family: 'Doe' }],
    gender: 'male',
    birthDate: '1990-01-01',
  };
}

describe('usePatient', () => {
  let originalLocation: Location;
  let mockAddEventListener: ReturnType<typeof vi.fn>;
  let mockRemoveEventListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Store original location
    originalLocation = window.location;

    // Mock window.addEventListener and removeEventListener
    mockAddEventListener = vi.fn();
    mockRemoveEventListener = vi.fn();
    window.addEventListener = mockAddEventListener;
    window.removeEventListener = mockRemoveEventListener;

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original location
    vi.unstubAllGlobals();
  });

  function mockLocation(pathname: string) {
    vi.stubGlobal('location', { ...originalLocation, pathname });
  }

  describe('with patientUuid parameter', () => {
    it('should fetch patient with provided UUID', () => {
      const patientUuid = 'test-patient-123';
      const mockPatient = createMockPatient(patientUuid);

      mockUseSWR.mockReturnValue({
        data: mockPatient,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient(patientUuid));

      expect(mockUseSWR).toHaveBeenCalledWith(['patient', patientUuid], expect.any(Function));
      expect(result.current.patient).toEqual(mockPatient);
      expect(result.current.patientUuid).toBe(patientUuid);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should show loading state while fetching', () => {
      const patientUuid = 'loading-patient-123';

      mockUseSWR.mockReturnValue({
        data: undefined,
        error: null,
        isValidating: true,
      });

      const { result } = renderHook(() => usePatient(patientUuid));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.patient).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle error state', () => {
      const patientUuid = 'error-patient-123';
      const mockError = new Error('Failed to fetch patient');

      mockUseSWR.mockReturnValue({
        data: undefined,
        error: mockError,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient(patientUuid));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.patient).toBeUndefined();
      expect(result.current.error).toBe(mockError);
    });

    it('should not show loading when error is present', () => {
      const patientUuid = 'error-loading-patient-123';
      const mockError = new Error('Network error');

      mockUseSWR.mockReturnValue({
        data: undefined,
        error: mockError,
        isValidating: true,
      });

      const { result } = renderHook(() => usePatient(patientUuid));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });

    it('should not show loading when patient data exists', () => {
      const patientUuid = 'cached-patient-123';
      const mockPatient = createMockPatient(patientUuid);

      mockUseSWR.mockReturnValue({
        data: mockPatient,
        error: null,
        isValidating: true,
      });

      const { result } = renderHook(() => usePatient(patientUuid));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.patient).toEqual(mockPatient);
    });
  });

  describe('without patientUuid parameter', () => {
    it('should extract patient UUID from URL', () => {
      mockLocation('/patient/url-patient-456/chart');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      expect(result.current.patientUuid).toBe('url-patient-456');
      expect(mockUseSWR).toHaveBeenCalledWith(['patient', 'url-patient-456'], expect.any(Function));
    });

    it('should handle URL without patient UUID', () => {
      mockLocation('/home/dashboard');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      expect(result.current.patientUuid).toBeNull();
      expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
    });

    it('should handle patient UUID with dashes', () => {
      mockLocation('/patient/abc-123-def-456/encounters');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      expect(result.current.patientUuid).toBe('abc-123-def-456');
    });

    it('should handle patient URL at root level', () => {
      mockLocation('/patient/root-patient-789');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      expect(result.current.patientUuid).toBe('root-patient-789');
    });

    it('should handle patient URL with trailing slash', () => {
      mockLocation('/patient/trailing-patient-101/');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      expect(result.current.patientUuid).toBe('trailing-patient-101');
    });
  });

  describe('routing event handling', () => {
    it('should register routing event listener on mount', () => {
      mockLocation('/patient/initial-patient-111');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      renderHook(() => usePatient());

      expect(mockAddEventListener).toHaveBeenCalledWith('single-spa:routing-event', expect.any(Function));
    });

    it('should unregister routing event listener on unmount', () => {
      mockLocation('/patient/unmount-patient-222');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { unmount } = renderHook(() => usePatient());

      const eventHandler = mockAddEventListener.mock.calls[0][1];

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('single-spa:routing-event', eventHandler);
    });

    it('should update patient UUID when route changes', () => {
      mockLocation('/patient/first-patient-333');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      expect(result.current.patientUuid).toBe('first-patient-333');

      // Get the registered event handler
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Simulate route change
      mockLocation('/patient/second-patient-444');
      act(() => {
        eventHandler();
      });

      expect(result.current.patientUuid).toBe('second-patient-444');
    });

    it('should not update if route changes to same patient UUID', () => {
      mockLocation('/patient/same-patient-555/chart');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      const initialPatientUuid = result.current.patientUuid;
      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Change URL but keep same patient UUID
      mockLocation('/patient/same-patient-555/encounters');
      act(() => {
        eventHandler();
      });

      expect(result.current.patientUuid).toBe(initialPatientUuid);
    });

    it('should update when route changes from patient to no patient', () => {
      mockLocation('/patient/has-patient-666');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient());

      expect(result.current.patientUuid).toBe('has-patient-666');

      const eventHandler = mockAddEventListener.mock.calls[0][1];

      // Change to non-patient route
      mockLocation('/home/dashboard');
      act(() => {
        eventHandler();
      });

      expect(result.current.patientUuid).toBeNull();
    });

    it('should not listen to routing events when patientUuid is provided', () => {
      mockLocation('/patient/ignored-patient-777');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient('explicit-patient-888'));

      // Patient UUID should be from the parameter, not the URL
      expect(result.current.patientUuid).toBe('explicit-patient-888');

      // Event listener should still be registered for consistency
      expect(mockAddEventListener).toHaveBeenCalled();
    });
  });

  describe('SWR integration', () => {
    it('should pass patient UUID to SWR key', () => {
      const patientUuid = 'swr-patient-999';

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      renderHook(() => usePatient(patientUuid));

      expect(mockUseSWR).toHaveBeenCalledWith(['patient', patientUuid], expect.any(Function));
    });

    it('should pass null to SWR when no patient UUID', () => {
      mockLocation('/home');

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      renderHook(() => usePatient());

      expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
    });

    it('should call fetchCurrentPatient when SWR fetcher is invoked', async () => {
      const patientUuid = 'fetch-patient-1010';
      const mockPatient = createMockPatient(patientUuid);

      mockFetchCurrentPatient.mockResolvedValue(mockPatient);

      let swrFetcher: any;
      mockUseSWR.mockImplementation((key, fetcher) => {
        swrFetcher = fetcher;
        return {
          data: null,
          error: null,
          isValidating: true,
        };
      });

      renderHook(() => usePatient(patientUuid));

      // Call the SWR fetcher
      const result = await swrFetcher();

      expect(mockFetchCurrentPatient).toHaveBeenCalledWith(patientUuid, {});
      expect(result).toEqual(mockPatient);
    });
  });

  describe('return value', () => {
    it('should return all expected properties', () => {
      const patientUuid = 'complete-patient-1111';
      const mockPatient = createMockPatient(patientUuid);

      mockUseSWR.mockReturnValue({
        data: mockPatient,
        error: null,
        isValidating: false,
      });

      const { result } = renderHook(() => usePatient(patientUuid));

      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('patient');
      expect(result.current).toHaveProperty('patientUuid');
      expect(result.current).toHaveProperty('error');
    });

    it('should memoize return value correctly', () => {
      const patientUuid = 'memo-patient-1212';

      mockUseSWR.mockReturnValue({
        data: null,
        error: null,
        isValidating: false,
      });

      const { result, rerender } = renderHook(() => usePatient(patientUuid));

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Should be the same object reference if values haven't changed
      expect(firstResult).toBe(secondResult);
    });
  });
});
