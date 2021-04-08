import uniq from "lodash-es/uniq";

export const omrsCachePrefix = "omrs";
export const omrsCacheName = `${omrsCachePrefix}-spa-cache-v1`;

export const indexPath = prefixWithSpaBase("index.html");

export const wbManifest = self.__WB_MANIFEST;
export const absoluteWbManifestUrls = uniq(
  wbManifest.map(({ url }) => prefixWithSpaBase(url))
);

export const buildManifestSuffix = ".buildmanifest.json";

function prefixWithSpaBase(path: string) {
  return new URL(path, self.location.href).href;
}
