import { ImportMap } from "@openmrs/esm-globals";
import { flatten } from "../helpers";
import { BuildManifest } from "./types";

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
  const segments = importMapAddress.split("/");
  segments[segments.length - 1] = "stats.json";
  return segments.join("/");
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

    for (const chunk of buildManifest.chunks ?? []) {
      for (const file of chunk.files ?? []) {
        results.push(new URL(file, importMapAddress).toString());
      }
    }

    return results;
  } catch (e) {
    return [];
  }
}
