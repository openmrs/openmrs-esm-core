import { ImportMap } from "@openmrs/esm-globals";
import { addToOmrsCache } from "./caching";

export function onMessage(e: ExtendableMessageEvent) {
  switch (e.data?.type?.toString() ?? "") {
    case "importMap":
      onImportMap(e.data.importMap);
      break;
    default:
      console.warn("Service Worker received unexpected message.", e);
      break;
  }
}

async function onImportMap(importMap: ImportMap) {
  console.info("Received an importmap.", importMap);
  const imports = importMap.imports ?? {};
  const promises = Object.entries(imports).map(([key, path]) =>
    cacheImportMapEntry(key, path)
  );
  await Promise.all(promises);
}

async function cacheImportMapEntry(key: string, path: string) {
  console.info(`Attempting to cache import map entry ${key}: ${path}.`);

  const metadataPath = getMetadataPath(path);
  console.info(`Resolved metadata path is ${metadataPath}.`);

  const metadata = await tryFetchMetadata(metadataPath);
  if (!metadata) {
    return;
  }

  console.info(`Fetched metadata for ${path}: `, metadata);
  const urlsToCache = getUrlsToCacheFromMetadata(metadata);

  console.info(`Found the following URLs to cache: `, urlsToCache);
  await addToOmrsCache(urlsToCache);

  console.info(`Cached the following URLs: `, urlsToCache);
}

function getMetadataPath(referencePath: string) {
  const segments = referencePath.split("/");
  segments[segments.length - 1] = "stats.json";
  return segments.join("/");
}

async function tryFetchMetadata(path: string) {
  return fetch(path)
    .then((res) => res.json())
    .catch((e) => {
      console.warn(`Fetching the metadata at ${path} failed.`, e);
      return null;
    });
}

function getUrlsToCacheFromMetadata(metadata) {
  const urls: Array<string> = [];

  for (const chunk of metadata.chunks) {
    for (const file of chunk.files) {
      urls.push(file);
    }
  }

  return urls;
}
