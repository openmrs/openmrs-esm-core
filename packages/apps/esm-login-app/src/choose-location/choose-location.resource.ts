import { useState, useEffect, useMemo } from "react";
import {
  openmrsFetch,
  openmrsObservableFetch,
  fhirBaseUrl,
  FetchResponse,
} from "@openmrs/esm-framework";
import { LocationEntry, LocationResponse } from "../types";
import useSwr from "swr";

const fhirLocationUrl = `${fhirBaseUrl}/Location?_summary=data`;

export function useLocation(
  useLoginLocationTag: boolean,
  count: number = null,
  searchQuery: string = "",
  pagesOffset: number = 0
) {
  const [locationData, setLocationData] = useState<Array<LocationEntry>>(null);
  const [totalResults, setTotalResults] = useState(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // URL fetching
  let url = fhirLocationUrl;
  if (count) {
    url += `&_count=${count}`;
  }
  if (pagesOffset) {
    url += `&_getpagesoffset=${pagesOffset}`;
  }
  if (useLoginLocationTag) {
    url += "&_tag=login location";
  }
  if (searchQuery != "" && searchQuery != null) {
    url += `&name=${searchQuery}`;
  }
  const swrResult = useSwr<FetchResponse<LocationResponse>, Error>(
    url,
    openmrsFetch
  );

  // Creating a set to store all the locations that is already present in the locationData
  // Since SWR triggers multiple requests at different events

  let setOfLocationNames: Set<string> = useMemo(() => {
    if (!locationData) {
      return new Set<string>();
    } else {
      return new Set(locationData.map((entry) => entry.resource.name));
    }
  }, [locationData]);

  useEffect(() => {
    if (swrResult.data) {
      setLocationData((locationData) =>
        locationData
          ? [
              ...locationData,
              ...(swrResult.data?.data?.entry?.filter(
                (entry) => !setOfLocationNames.has(entry.resource.name)
              ) ?? []),
            ]
          : swrResult.data?.data?.entry ?? []
      );
      setTotalResults(swrResult?.data?.data?.total);
      setHasMore(
        swrResult?.data?.data?.link?.find((link) => link.relation === "next")
          ? true
          : false
      );
    }
  }, [swrResult.data]);

  // Reset LocationData when a new search query is triggered
  useEffect(() => {
    setLocationData(null);
    setTotalResults(null);
    setHasMore(null);
  }, [searchQuery]);

  return {
    locationData,
    isLoading: !locationData,
    totalResults,
    hasMore,
    loadingNewData: !swrResult.data,
  };
}
