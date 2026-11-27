/** @module @category API */
import { makeUrl, openmrsFetch, toApiOrigin } from './openmrs-fetch';
import { type FetchResponse } from './types';

interface PaginatedResults<T> {
  results: Array<T>;
  links?: Array<{ rel: string; uri: string }>;
  totalCount?: number;
}

/**
 * Fetches a complete OpenMRS REST collection by following its next links.
 * Preserves the requested page size and the first response's metadata. Rejects
 * if any page fails, rather than returning an incomplete collection as success.
 *
 * @param url The initial REST query, including any filters and page-size limit.
 * @param fetcher The page fetcher. Defaults to openmrsFetch; a custom fetcher can
 * supply request options such as an AbortSignal.
 */
export async function openmrsFetchAll<T>(
  url: string,
  fetcher: (url: string) => Promise<FetchResponse<PaginatedResults<T>>> = openmrsFetch,
): Promise<FetchResponse<PaginatedResults<T>>> {
  const firstResponse = await fetcher(url);
  const results = [...firstResponse.data.results];
  const visited = new Set<string>();
  let page = firstResponse.data;
  // Request later pages from the first page's origin.
  const { origin } = new URL(makeUrl(url), window.location.href);

  while (true) {
    const next = page.links?.find((link) => link.rel === 'next')?.uri;
    if (!next) {
      break;
    }

    const nextUrl = toApiOrigin(next, origin);
    if (visited.has(nextUrl)) {
      throw new Error('Cannot fetch the complete collection: pagination returned a repeated next link.');
    }
    visited.add(nextUrl);
    page = (await fetcher(nextUrl)).data;
    results.push(...page.results);
  }

  firstResponse.data = {
    ...firstResponse.data,
    results,
    ...(firstResponse.data.links ? { links: firstResponse.data.links.filter((link) => link.rel !== 'next') } : {}),
  };
  return firstResponse;
}
