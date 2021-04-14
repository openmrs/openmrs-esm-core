import uniq from "lodash-es/uniq";

export const omrsCachePrefix = "omrs";
export const omrsCacheName = `${omrsCachePrefix}-spa-cache-v1`;

export const omrsApiUrl = process.env.OMRS_API_URL;
export const sessionPath = `${omrsApiUrl}/ws/rest/v1/session`;
export const indexPath = prefixWithServiceWorkerLocation("index.html");

export const wbManifest = self.__WB_MANIFEST;
export const absoluteWbManifestUrls = uniq(
  wbManifest.map(({ url }) => prefixWithServiceWorkerLocation(url))
);

export const buildManifestSuffix = ".buildmanifest.json";

function prefixWithServiceWorkerLocation(path: string) {
  return new URL(path, self.location.href).href;
}
