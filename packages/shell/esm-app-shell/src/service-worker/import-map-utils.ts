import type { ImportMap } from "@openmrs/esm-globals";
import { buildManifestSuffix } from "./constants";
import { BuildManifest } from "./types";
import flatten from "lodash-es/flatten";

/**
 * Given an import map object, resolves the URLs of all cacheable files defined in the import map.
 * Resolving relies on a build manifest file existing in the same location as the file referenced
 * in the import map.
 */
export async function fetchUrlsToCacheFromImportMap({
  imports = {},
}: ImportMap) {
  const importMapUrlAddresses = Object.values(imports);
  const urlsToCache = await Promise.all(
    importMapUrlAddresses.map(async (importMapAddress) => {
      const buildManifestUrl = getBuildManifestUrl(importMapAddress);
      const buildManifest = await tryFetchBuildManifest(buildManifestUrl);
      return buildManifest
        ? getUrlsFromBuildManifests(importMapAddress, buildManifest)
        : [];
    })
  );

  return flatten(urlsToCache);
}

function getBuildManifestUrl(importMapAddress: string) {
  return importMapAddress + buildManifestSuffix;
}

function tryFetchBuildManifest(
  buildManifestUrl: string
): Promise<BuildManifest | null> {
  return fetch(buildManifestUrl)
    .then((res) => res.json())
    .catch(() => null);
}

function getUrlsFromBuildManifests(
  importMapAddress: string,
  buildManifest: BuildManifest
) {
  // The try here guards against malformed JSON responses.
  // While we do expect the build manifest to have the correct format, we cannot *rely* on it.
  // Using a try/catch here seems better to me than doing defensive checks on every field/type in the response.
  try {
    const results: Array<string> = [];
    const baseUrlForFiles = getUrlOfFileParentDir(
      new URL(importMapAddress, self.location.href)
    );

    for (const chunk of buildManifest.chunks ?? []) {
      for (const file of chunk.files ?? []) {
        results.push(new URL(file, baseUrlForFiles).toString());
      }
    }

    return results;
  } catch (e) {
    console.error(
      "[SW] Failed to determine the dependencies of the module with the URL %s. Not precaching any of the module's assets. Error: ",
      importMapAddress,
      e
    );

    return [];
  }
}

function getUrlOfFileParentDir(url: URL) {
  const fullPath = url.origin + url.pathname; // Removes params + hash.
  const parts = fullPath.split("/");
  parts[parts.length - 1] = "";
  return parts.join("/");
}
