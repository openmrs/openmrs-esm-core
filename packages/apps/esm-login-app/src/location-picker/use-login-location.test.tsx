import { cleanup, renderHook } from '@testing-library/react';
import { useFetchDefaultLocation, usePreviousLoggedInLocations } from './location-picker.resource';
import { useOpenmrsSWR, useSession } from '@openmrs/esm-framework';
import {
  emptyLocationResponse,
  validatingLocationFailureResponse,
  validLocationResponse,
} from '../../__mocks__/locations.mock';

const mockUseOpenmrsSWR = useOpenmrsSWR as jest.Mock;
const mockUseSession = useSession as jest.Mock;

const validLocationUuid = '1ce1b7d4-c865-4178-82b0-5932e51503d6';
const invalidLocationUuid = '2gf1b7d4-c865-4178-82b0-5932e51503d6';

jest.mock('@openmrs/esm-framework', () => ({
  ...jest.requireActual('@openmrs/esm-framework'),
  setSessionLocation: jest.fn().mockResolvedValue({}),
  setUserProperties: jest.fn().mockResolvedValue({}),
  navigate: jest.fn(),
  showSnackbar: jest.fn(),
  useOpenmrsSWR: jest.fn().mockReturnValue({}),
}));

describe('Testing usePreviousLoggedInLocations', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  it('should not fetch anything if there is no defaultLocation present in the userProperties', () => {
    const { result } = renderHook(() => usePreviousLoggedInLocations(true, ''));

    expect(mockUseOpenmrsSWR).toHaveBeenCalledWith(null);

    expect(result.current).toStrictEqual({
      previousLoggedInLocations: undefined,
      error: undefined,
      isLoadingPreviousLoggedInLocations: undefined,
      mutatePreviousLoggedInLocations: undefined,
    });
  });

  it('should fetch previousLoggedInLocations if there is previousLoggedInLocations present in the userProperties', () => {
    mockUseSession.mockReturnValue({
      user: {
        display: 'Testy McTesterface',
        uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
        userProperties: {
          previousLoggedInLocations: `${validLocationUuid}`,
        },
      },
    });
    mockUseOpenmrsSWR.mockReturnValue({
      data: validLocationResponse,
      isLoading: false,
      error: null,
    });
    const { result } = renderHook(() => usePreviousLoggedInLocations(true, ''));

    expect(useOpenmrsSWR).toHaveBeenCalledWith(
      '/ws/fhir2/R4/Location?_summary=data&_id=1ce1b7d4-c865-4178-82b0-5932e51503d6&_tag=Login+Location',
    );

    expect(result.current).toStrictEqual({
      previousLoggedInLocations: validLocationResponse.data.entry,
      error: null,
      isLoadingPreviousLoggedInLocations: false,
      mutatePreviousLoggedInLocations: undefined,
    });
  });

  it('should fetch previousLoggedInLocations if there is previousLoggedInLocations present in the userProperties and a search string is passed', () => {
    mockUseSession.mockReturnValue({
      user: {
        display: 'Testy McTesterface',
        uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
        userProperties: {
          previousLoggedInLocations: `${validLocationUuid},${invalidLocationUuid}`,
        },
      },
    });
    mockUseOpenmrsSWR.mockReturnValue({
      data: emptyLocationResponse,
      isLoading: false,
      error: null,
    });
    const { result } = renderHook(() => usePreviousLoggedInLocations(true, 'site'));

    expect(useOpenmrsSWR).toHaveBeenCalledWith(
      `/ws/fhir2/R4/Location?_summary=data&_id=${validLocationUuid}%2C${invalidLocationUuid}&_tag=Login+Location&name%3Acontains=site`,
    );

    expect(result.current).toStrictEqual({
      previousLoggedInLocations: [],
      error: null,
      isLoadingPreviousLoggedInLocations: false,
      mutatePreviousLoggedInLocations: undefined,
    });
  });
});

describe('Testing useFetchDefaultLocation', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('should fetch defaultLocation data when valid defaultLocation is present', () => {
    mockUseSession.mockReturnValue({
      user: {
        display: 'Testy McTesterface',
        uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
        userProperties: {
          defaultLocation: validLocationUuid,
        },
      },
    });

    mockUseOpenmrsSWR.mockReturnValue({
      data: validLocationResponse,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useFetchDefaultLocation(true, ''));

    expect(useOpenmrsSWR).toHaveBeenCalledWith(`/ws/fhir2/R4/Location?_tag=Login+Location&_id=${validLocationUuid}`);

    expect(result.current).toStrictEqual({
      isDefaultLocationValid: true,
      defaultLocationArr: validLocationResponse?.data?.entry,
      error: null,
      isLoadingDefaultLocation: false,
    });
  });

  it('should get no data when invalid defaultLocation is present in the userProperties', () => {
    mockUseSession.mockReturnValue({
      user: {
        display: 'Testy McTesterface',
        uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
        userProperties: {
          defaultLocation: invalidLocationUuid,
        },
      },
    });

    mockUseOpenmrsSWR.mockReturnValue({
      data: validatingLocationFailureResponse,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useFetchDefaultLocation(true, ''));

    expect(useOpenmrsSWR).toHaveBeenCalledWith(`/ws/fhir2/R4/Location?_tag=Login+Location&_id=${invalidLocationUuid}`);

    expect(result.current).toStrictEqual({
      isDefaultLocationValid: false,
      defaultLocationArr: [],
      error: null,
      isLoadingDefaultLocation: false,
    });
  });

  it('should get data when valid defaultLocation is present in the userProperties, but a mismatched searchQuery is passed', () => {
    mockUseSession.mockReturnValue({
      user: {
        display: 'Testy McTesterface',
        uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
        userProperties: {
          defaultLocation: validLocationUuid,
        },
      },
    });

    mockUseOpenmrsSWR.mockReturnValue({
      data: validLocationResponse,
      isLoading: false,
      error: null,
    });

    const { result, rerender } = renderHook((searchQuery: string = '') => useFetchDefaultLocation(true, searchQuery));

    expect(useOpenmrsSWR).toHaveBeenCalledWith(`/ws/fhir2/R4/Location?_tag=Login+Location&_id=${validLocationUuid}`);

    expect(result.current).toStrictEqual({
      isDefaultLocationValid: true,
      defaultLocationArr: validLocationResponse.data.entry,
      error: null,
      isLoadingDefaultLocation: false,
    });

    mockUseOpenmrsSWR.mockReturnValue({
      data: emptyLocationResponse,
      isLoading: false,
      error: null,
    });

    rerender('site');
    expect(useOpenmrsSWR).toHaveBeenCalledWith(
      `/ws/fhir2/R4/Location?_tag=Login+Location&_id=${validLocationUuid}&name%3Acontains=site`,
    );

    expect(result.current).toStrictEqual({
      isDefaultLocationValid: true,
      defaultLocationArr: [],
      error: null,
      isLoadingDefaultLocation: false,
    });
  });
});
