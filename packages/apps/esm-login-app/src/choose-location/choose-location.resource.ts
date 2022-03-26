import { useEffect, useMemo } from "react";
import {
  openmrsFetch,
  fhirBaseUrl,
  FetchResponse,
  showNotification,
} from "@openmrs/esm-framework";
import useSwrInfinite from "swr/infinite";
import { LocationEntry, LocationResponse } from "../types";

interface LoginLocationData {
  locationData: Array<LocationEntry>;
  isLoading: boolean;
  totalResults: number;
  hasMore: boolean;
  loadingNewData: boolean;
  setPage: (
    size: number | ((_size: number) => number)
  ) => Promise<FetchResponse<LocationResponse>[]>;
}

const fhirLocationUrl = `${fhirBaseUrl}/Location?_summary=data`;

export function useLoginLocations(
  useLoginLocationTag: boolean,
  count: number = 0,
  searchQuery: string = ""
): LoginLocationData {
  const getUrl = (page, prevPageData: FetchResponse<LocationResponse>) => {
    if (
      prevPageData &&
      !prevPageData?.data?.link?.some((link) => link.relation === "next")
    ) {
      return null;
    }

    let url = fhirLocationUrl;

    if (count) {
      url += `&_count=${count}`;
    }

    if (page) {
      url += `&_getpagesoffset=${page * count}`;
    }

    if (useLoginLocationTag) {
      url += "&_tag=login location";
    }

    if (typeof searchQuery === "string" && searchQuery != "") {
      url += `&name:contains=${searchQuery}`;
    }

    return url;
  };

  const { data, isValidating, size, setSize, error } = useSwrInfinite<
    FetchResponse<LocationResponse>,
    Error
  >(getUrl, openmrsFetch);

  if (error) {
    showNotification({
      title: error.name,
      description: error.message,
      kind: "error",
    });
  }

  useEffect(() => {
    setSize(1);
  }, [searchQuery, setSize]);

  const memoizedLocationData = useMemo(() => {
    return {
      locationData: data
        ? [].concat(...data?.map((resp) => resp?.data?.entry ?? []))
        : null,
      isLoading: !data && !error,
      totalResults: data?.[0]?.data?.total ?? null,
      hasMore: data?.length
        ? data?.[data.length - 1]?.data?.link.some(
            (link) => link.relation === "next"
          )
        : false,
      loadingNewData: isValidating,
      setPage: setSize,
    };
  }, [data, isValidating, setSize]);

  return memoizedLocationData;
}
