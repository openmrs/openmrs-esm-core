import { useState, useEffect } from "react";
import {
  openmrsFetch,
  openmrsObservableFetch,
  fhirBaseUrl,
  FetchResponse,
} from "@openmrs/esm-framework";
import { map } from "rxjs/operators";
import { LocationEntry, LocationResponse } from "../types";
import useSwr from "swr";

export const fhirLocationUrl = `${fhirBaseUrl}/Location?_summary=data`;

export function useLocation(
  useLoginLocationTag: boolean,
  count: number = null,
  location: string = "",
  pagesOffset: number = 0
) {
  const [locationData, setLocationData] = useState<Array<LocationEntry>>(null);
  const [totalResults, setTotalResults] = useState(null);

  // URL fetching
  let url = fhirLocationUrl;
  url = url.concat(`&_count=${count}`);

  if (pagesOffset) {
    url = url.concat(`&_getpagesoffset=${pagesOffset}`);
  }
  if (useLoginLocationTag) {
    url = url.concat("&_tag=login location");
  }
  if (location != "" && location != null) {
    url = url.concat(`&name=${location}`);
  }
  const swrResult = useSwr<FetchResponse<LocationResponse>, Error>(
    url,
    openmrsFetch
  );

  useEffect(() => {
    setLocationData((locationData) =>
      swrResult.data
        ? locationData
          ? [...new Set([...locationData, ...swrResult.data?.data?.entry])]
          : swrResult.data?.data?.entry
        : locationData
    );
    if (swrResult.data) {
      setTotalResults(swrResult?.data?.data?.total);
    }
  }, [swrResult.data]);

  // Reset Location data when a new search query is triggered
  useEffect(() => {
    setLocationData(null);
  }, [location]);

  return {
    locationData,
    isLoading: !locationData,
    totalResults,
    nextPage: swrResult?.data?.data?.link?.find(
      (link) => link.relation === "next"
    )
      ? true
      : false,
    loadingNewData: !swrResult.data,
  };
}
