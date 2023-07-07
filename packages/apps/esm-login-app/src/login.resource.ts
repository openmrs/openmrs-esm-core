import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useSwrInfinite from "swr/infinite";
import {
  FetchResponse,
  fhirBaseUrl,
  openmrsFetch,
  refetchCurrentUser,
  Session,
  showNotification,
} from "@openmrs/esm-framework";
import { LocationEntry, LocationResponse } from "./types";

export async function performLogin(
  username: string,
  password: string
): Promise<{ data: Session }> {
  const abortController = new AbortController();
  const token = window.btoa(`${username}:${password}`);
  const url = `/ws/rest/v1/session`;

  return openmrsFetch(url, {
    headers: {
      Authorization: `Basic ${token}`,
    },
    signal: abortController.signal,
  }).then((res) => {
    refetchCurrentUser();
    return res;
  });
}

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

    let url = `${fhirBaseUrl}/Location?`;
    let urlSearchParameters = new URLSearchParams();
    urlSearchParameters.append("_summary", "data");

    if (count) {
      urlSearchParameters.append("_count", "" + count);
    }

    if (page) {
      urlSearchParameters.append("_getpagesoffset", "" + page * count);
    }

    if (useLoginLocationTag) {
      urlSearchParameters.append("_tag", "Login Location");
    }

    if (typeof searchQuery === "string" && searchQuery != "") {
      urlSearchParameters.append("name:contains", searchQuery);
    }

    return url + urlSearchParameters.toString();
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
