/** @module @category Utility */
import * as semver from "semver";

function normalizeOnlyVersion(version: string) {
  const [major, minor, patch] = version.split(".");
  return `${major}.${minor}.${patch}`;
}

function normalizeFullVersion(version: string) {
  const idx = version.indexOf("-");
  const prerelease = idx >= 0;

  if (prerelease) {
    const ver = normalizeOnlyVersion(version.slice(0, idx));
    const pre = version.slice(idx + 1);
    return `${ver}-${pre}`;
  }

  return normalizeOnlyVersion(version);
}

export function isVersionSatisfied(
  requiredVersion: string,
  installedVersion: string
) {
  const version = normalizeFullVersion(installedVersion);

  return semver.satisfies(version, requiredVersion, {
    includePrerelease: true,
  } as semver.Options);
}
