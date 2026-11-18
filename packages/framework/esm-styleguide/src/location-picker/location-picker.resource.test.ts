import { afterEach, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { openmrsFetch } from '@openmrs/esm-api';
import { useDebounce } from '@openmrs/esm-react-utils';
import { swrWrapper } from '../test-utils';
import { useLocations } from './location-picker.resource';

afterEach(() => vi.unstubAllGlobals());

it("requests the next page of locations on the page's own origin", async () => {
  vi.stubGlobal('location', new URL('https://frontend.example/openmrs/spa/'));
  vi.mocked(useDebounce).mockImplementation((value) => value);
  vi.mocked(openmrsFetch).mockResolvedValue({
    data: {
      entry: [],
      link: [
        {
          relation: 'next',
          url: 'http://backend.example:8080/openmrs/ws/fhir2/R4/Location?_getpages=abc&_getpagesoffset=50&_count=50',
        },
      ],
    },
  } as any);

  const { result } = renderHook(() => useLocations(undefined, 50), { wrapper: swrWrapper });
  await waitFor(() => expect(result.current.hasMore).toBe(true));
  await act(() => result.current.setPage(2));

  expect(openmrsFetch).toHaveBeenCalledWith(
    'https://frontend.example/openmrs/ws/fhir2/R4/Location?_getpages=abc&_getpagesoffset=50&_count=50',
  );
});
