import { distinct } from "../helpers";

export const omrsCachePrefix = "omrs";
export const omrsCacheName = `${omrsCachePrefix}-spa-cache-v1`;

export const indexPath = prefixWithSpaBase("index.html");

export const wbManifest = self.__WB_MANIFEST;
export const absoluteWbManifestUrls = distinct(
  wbManifest.map(({ url }) => prefixWithSpaBase(url))
);

function prefixWithSpaBase(path: string) {
  return new URL(path, self.location.href).href;
}
