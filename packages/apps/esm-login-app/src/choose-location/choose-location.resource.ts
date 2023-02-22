import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  openmrsFetch,
  fhirBaseUrl,
  FetchResponse,
  showNotification,
} from "@openmrs/esm-framework";
import useSwrInfinite from "swr/infinite";
import { LocationEntry, LocationResponse } from "../types";

interface LoginLocationData {
  locations: Array<LocationEntry>;
  isLoading: boolean;
  totalResults: number;
  hasMore: boolean;
  loadingNewData: boolean;
  setPage: (
    size: number | ((_size: number) => number)
  ) => Promise<FetchResponse<LocationResponse>[]>;
}

export function useLoginLocations(
  useLoginLocationTag: boolean,
  count: number = 0,
  searchQuery: string = ""
): LoginLocationData {
  const { t } = useTranslation();
  function constructUrl(page, prevPageData: FetchResponse<LocationResponse>) {
    if (
      prevPageData &&
      !prevPageData?.data?.link?.some((link) => link.relation === "next")
    ) {
      return null;
    }

    let url = `${fhirBaseUrl}/Location?_summary=data`;

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
  }

  const { data, isLoading, isValidating, setSize, error } = useSwrInfinite<
    FetchResponse<LocationResponse>,
    Error
  >(constructUrl, openmrsFetch);

  if (error) {
    showNotification({
      title: t("errorLoadingLoginLocations", "Error loading login locations"),
      kind: "error",
      critical: true,
      description: error?.message,
    });
  }

  const memoizedLocations = useMemo(() => {
    return {
      locations: data?.length
        ? data?.flatMap((entries) => entries?.data?.entry ?? [])
        : null,
      isLoading,
      totalResults: data?.[0]?.data?.total ?? null,
      hasMore: data?.length
        ? data?.[data.length - 1]?.data?.link.some(
            (link) => link.relation === "next"
          )
        : false,
      loadingNewData: isValidating,
      setPage: setSize,
    };
  }, [isLoading, data, isValidating, setSize]);

  return memoizedLocations;
}
