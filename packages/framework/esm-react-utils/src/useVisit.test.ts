import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type useSWR from 'swr';
import type { BareFetcher, Key } from 'swr';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useVisit } from './useVisit';
import type { Visit } from '@openmrs/esm-emr-api';

// Mock openmrsFetch
const mockOpenmrsFetch = vi.fn();
vi.mock('@openmrs/esm-api', () => ({
  openmrsFetch: (...args: any[]) => mockOpenmrsFetch(...args),
  restBaseUrl: '/ws/rest/v1',
}));

// SWR mock state - will be inspected by mockUseSWR to return appropriate values
let activeVisitMockState: {
  data?: { data: { results: Array<Visit> } };
  error?: Error | null;
  mutate: () => void;
  isValidating: boolean;
};

let retroVisitMockState: {
  data?: { data: Visit };
  error?: Error | null;
  mutate: () => void;
  isValidating: boolean;
};

// Mock SWR - inspects the key to determine which state to return
// Accepts both key and fetcher to match SWR's signature, but only uses key for logic
const mockUseSWR = vi.fn(<T = unknown>(key: Key, fetcher?: BareFetcher<T> | null) => {
  if (key === null) {
    return {
      data: undefined,
      error: null,
      mutate: vi.fn(),
      isValidating: false,
    };
  }

  // Check if this is a retrospective visit call (has UUID in path like /visit/uuid-here)
  if (typeof key === 'string' && key.includes('/visit/') && !key.includes('?patient=')) {
    return retroVisitMockState;
  }

  // Otherwise it's an active visit call
  return activeVisitMockState;
});

vi.mock('swr', () => ({
  default: (...args: Parameters<typeof useSWR>) => mockUseSWR(args[0], args[1]),
}));

// Mock useVisitContextStore
const mockSetVisitContext = vi.fn();
const mockMutateVisit = vi.fn();
let mockVisitStoreState = {
  patientUuid: null as string | null,
  manuallySetVisitUuid: null as string | null,
};

vi.mock('./useVisitContextStore', () => ({
  useVisitContextStore: vi.fn((callback?: () => void) => {
    return {
      ...mockVisitStoreState,
      setVisitContext: mockSetVisitContext,
      mutateVisit: mockMutateVisit,
    };
  }),
}));

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs: any = vi.fn(() => ({
    isToday: vi.fn(() => false),
  }));
  mockDayjs.extend = vi.fn();
  return {
    default: mockDayjs,
  };
});

// Helper to create a mock visit
function createMockVisit(uuid: string, overrides: Partial<Visit> = {}): Visit {
  return {
    uuid,
    display: `Visit ${uuid}`,
    startDatetime: '2025-11-03T10:00:00.000Z',
    stopDatetime: null,
    visitType: {
      uuid: 'visit-type-1',
      display: 'Facility Visit',
    },
    patient: {
      uuid: 'patient-123',
      display: 'John Doe',
    },
    ...overrides,
  };
}

describe('useVisit', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock states
    mockVisitStoreState = {
      patientUuid: null,
      manuallySetVisitUuid: null,
    };

    activeVisitMockState = {
      data: undefined,
      error: null,
      mutate: vi.fn(),
      isValidating: false,
    };

    retroVisitMockState = {
      data: undefined,
      error: null,
      mutate: vi.fn(),
      isValidating: false,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('without patientUuid', () => {
    it('should not fetch visits when patientUuid is empty string', () => {
      const { result } = renderHook(() => useVisit(''));

      expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
      expect(result.current.activeVisit).toBeNull();
      expect(result.current.currentVisit).toBeNull();
      // isLoading is true because there's no data when patientUuid is empty
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('with patientUuid - active visit', () => {
    it('should use custom representation when provided', () => {
      const customRep = 'custom:(uuid,display)';
      const activeVisit = createMockVisit('visit-1', { stopDatetime: null });

      activeVisitMockState.data = { data: { results: [activeVisit] } };

      const { result } = renderHook(() => useVisit('patient-123', customRep));

      // Verify the custom representation is used in the SWR call
      expect(mockUseSWR).toHaveBeenCalledWith(expect.stringContaining(`v=${customRep}`), expect.any(Function));
      // Verify the hook still returns the correct data
      expect(result.current.activeVisit).toEqual(activeVisit);
      expect(result.current.isLoading).toBe(false);
    });

    it('should return active visit when found', () => {
      const activeVisit = createMockVisit('visit-1', { stopDatetime: null });
      const endedVisit = createMockVisit('visit-2', { stopDatetime: '2025-11-02T18:00:00.000Z' });

      activeVisitMockState.data = { data: { results: [activeVisit, endedVisit] } };

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.activeVisit).toEqual(activeVisit);
      expect(result.current.currentVisit).toBeNull();
      expect(result.current.currentVisitIsRetrospective).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return null when no active visit exists', () => {
      const endedVisit = createMockVisit('visit-1', { stopDatetime: '2025-11-02T18:00:00.000Z' });

      activeVisitMockState.data = { data: { results: [endedVisit] } };

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.activeVisit).toBeNull();
      expect(result.current.currentVisit).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should return null when visits array is empty', () => {
      activeVisitMockState.data = { data: { results: [] } };

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.activeVisit).toBeNull();
      expect(result.current.currentVisit).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('with retrospective visit', () => {
    it('should not fetch retrospective visit for different patient', () => {
      // Visit store has a retrospective visit set for a different patient
      mockVisitStoreState.patientUuid = 'other-patient';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      activeVisitMockState.data = { data: { results: [] } };

      const { result } = renderHook(() => useVisit('patient-123'));

      // Should not fetch the retrospective visit (SWR called with null for retro)
      expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function));
      // Should not have a current visit
      expect(result.current.currentVisit).toBeNull();
      expect(result.current.currentVisitIsRetrospective).toBe(false);
    });

    it('should return retrospective visit as currentVisit', () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      const retroVisit = createMockVisit('retro-visit-456', {
        stopDatetime: '2025-10-30T18:00:00.000Z',
      });

      activeVisitMockState.data = { data: { results: [] } };
      retroVisitMockState.data = { data: retroVisit };

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.activeVisit).toBeNull();
      expect(result.current.currentVisit).toEqual(retroVisit);
      expect(result.current.currentVisitIsRetrospective).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return null currentVisit when no retrospective visit set', () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = null;

      activeVisitMockState.data = { data: { results: [] } };

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.currentVisit).toBeNull();
      expect(result.current.currentVisitIsRetrospective).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should return error from active visit fetch', () => {
      const mockError = new Error('Failed to fetch active visits');

      activeVisitMockState.data = { data: { results: [] } };
      activeVisitMockState.error = mockError;

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.error).toBe(mockError);
      expect(result.current.activeVisit).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should return error from retrospective visit fetch', () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      const mockError = new Error('Failed to fetch retrospective visit');

      activeVisitMockState.data = { data: { results: [] } };
      retroVisitMockState.data = { data: createMockVisit('retro-visit-456') };
      retroVisitMockState.error = mockError;

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.error).toBe(mockError);
      expect(result.current.isLoading).toBe(false);
    });

    it('should prioritize active visit error over retrospective error', () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      const activeError = new Error('Active visit error');
      const retroError = new Error('Retro visit error');

      activeVisitMockState.error = activeError;
      retroVisitMockState.error = retroError;

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.error).toBe(activeError);
    });
  });

  describe('loading and validation states', () => {
    it('should show isValidating when active visit is loading', () => {
      activeVisitMockState.isValidating = true;

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.isValidating).toBe(true);
    });

    it('should show isValidating when retrospective visit is loading', () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      activeVisitMockState.data = { data: { results: [] } };
      retroVisitMockState.isValidating = true;

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.isValidating).toBe(true);
    });

    it('should show isLoading when no active data and no error', () => {
      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.activeVisit).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should not show isLoading when active data is loaded', () => {
      activeVisitMockState.data = { data: { results: [] } };

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.isLoading).toBe(false);
    });

    it('should not show isLoading when active error exists and no retrospective visit', () => {
      // When not viewing a retrospective visit, activeError should stop loading
      const mockError = new Error('Network error');
      activeVisitMockState.error = mockError;
      // No data needed - error alone should stop loading

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });

    it('should not show isLoading when retro error exists and retrospective visit is set', () => {
      // When viewing a retrospective visit, retroError should stop loading
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      const mockError = new Error('Failed to load retrospective visit');
      activeVisitMockState.data = { data: { results: [] } };
      retroVisitMockState.error = mockError;
      // No retro data needed - error alone should stop loading

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });

    it('should show isLoading when retrospective visit expected but not loaded', () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      activeVisitMockState.data = { data: { results: [] } };
      // retroVisitMockState.data is undefined

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('mutate functionality', () => {
    it('should call both mutate functions when mutate is invoked', () => {
      // Set up retrospective visit so both SWR calls are made
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      // Create stable mutate functions BEFORE setting up the hook
      const activeMutate = vi.fn();
      const retroMutate = vi.fn();

      activeVisitMockState = {
        data: { data: { results: [] } },
        error: null,
        mutate: activeMutate,
        isValidating: false,
      };

      retroVisitMockState = {
        data: { data: createMockVisit('retro-visit-456') },
        error: null,
        mutate: retroMutate,
        isValidating: false,
      };

      const { result } = renderHook(() => useVisit('patient-123'));

      act(() => {
        result.current.mutate();
      });

      expect(activeMutate).toHaveBeenCalled();
      expect(retroMutate).toHaveBeenCalled();
    });
  });

  describe('visit context side effects', () => {
    it('should set visit context when active visit exists and no manual visit set', async () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = null;

      const activeVisit = createMockVisit('visit-1', { stopDatetime: null });
      activeVisitMockState.data = { data: { results: [activeVisit] } };

      renderHook(() => useVisit('patient-123'));

      await waitFor(() => {
        expect(mockSetVisitContext).toHaveBeenCalledWith(activeVisit);
      });
    });

    it('should not set visit context when manual visit is already set', async () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'manual-visit';

      const activeVisit = createMockVisit('visit-1', { stopDatetime: null });
      activeVisitMockState.data = { data: { results: [activeVisit] } };

      renderHook(() => useVisit('patient-123'));

      await waitFor(() => {
        expect(mockSetVisitContext).not.toHaveBeenCalled();
      });
    });

    it('should not set visit context for different patient', async () => {
      mockVisitStoreState.patientUuid = 'other-patient';
      mockVisitStoreState.manuallySetVisitUuid = null;

      const activeVisit = createMockVisit('visit-1', { stopDatetime: null });
      activeVisitMockState.data = { data: { results: [activeVisit] } };

      renderHook(() => useVisit('patient-123'));

      await waitFor(() => {
        expect(mockSetVisitContext).not.toHaveBeenCalled();
      });
    });

    it('should clear visit context when current visit gets ended', async () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      const activeVisitInitial = createMockVisit('retro-visit-456', { stopDatetime: null });

      activeVisitMockState.data = { data: { results: [] } };
      retroVisitMockState.data = { data: activeVisitInitial };

      const { rerender } = renderHook(() => useVisit('patient-123'));

      await waitFor(() => {
        expect(mockSetVisitContext).not.toHaveBeenCalled();
      });

      // Clear the mock to track new calls
      mockSetVisitContext.mockClear();

      // Update the visit to be ended
      const activeVisitEnded = createMockVisit('retro-visit-456', {
        stopDatetime: '2025-11-03T18:00:00.000Z',
      });
      retroVisitMockState.data = { data: activeVisitEnded };

      rerender();

      await waitFor(() => {
        expect(mockSetVisitContext).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('combined active and retrospective visits', () => {
    it('should return both active and current visit when retrospective is set', () => {
      mockVisitStoreState.patientUuid = 'patient-123';
      mockVisitStoreState.manuallySetVisitUuid = 'retro-visit-456';

      const activeVisit = createMockVisit('visit-1', { stopDatetime: null });
      const retroVisit = createMockVisit('retro-visit-456', {
        stopDatetime: '2025-10-30T18:00:00.000Z',
      });

      activeVisitMockState.data = { data: { results: [activeVisit] } };
      retroVisitMockState.data = { data: retroVisit };

      const { result } = renderHook(() => useVisit('patient-123'));

      expect(result.current.activeVisit).toEqual(activeVisit);
      expect(result.current.currentVisit).toEqual(retroVisit);
      expect(result.current.currentVisitIsRetrospective).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
