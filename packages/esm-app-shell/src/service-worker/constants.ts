import uniq from "lodash-es/uniq";

export const omrsCachePrefix = "omrs";
export const omrsCacheName = `${omrsCachePrefix}-spa-cache-v1`;

export const wbManifest = self.__WB_MANIFEST;
export const omrsApiUrlBase = process.env.OMRS_API_URL;
export const indexUrl = prefixWithServiceWorkerLocationIfRelative("index.html");
export const sessionUrl = prefixWithServiceWorkerLocationIfRelative(
  `${omrsApiUrlBase}/ws/rest/v1/session`
);
export const absoluteWbManifestUrls = uniq(
  wbManifest.map(({ url }) => prefixWithServiceWorkerLocationIfRelative(url))
);
export const allKnownUrls = [...absoluteWbManifestUrls, sessionUrl, indexUrl];

export const buildManifestSuffix = ".buildmanifest.json";

function prefixWithServiceWorkerLocationIfRelative(path: string) {
  return new URL(path, self.location.href).href;
}
