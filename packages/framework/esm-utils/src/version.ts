/** @module @category Utility */
import * as semver from 'semver';

function normalizeOnlyVersion(version: string) {
  const [major, minor, patch] = version.split('.');
  return `${major}.${minor}.${patch}`;
}

function normalizeFullVersion(version: string) {
  const idx = version.indexOf('-');
  const prerelease = idx >= 0;

  if (prerelease) {
    const ver = normalizeOnlyVersion(version.slice(0, idx));
    const pre = version.slice(idx + 1);
    return `${ver}-${pre}`;
  }

  return normalizeOnlyVersion(version);
}

/**
 * Checks if an installed version satisfies a required version range using
 * semver comparison. Handles prerelease versions and normalizes version strings.
 *
 * @param requiredVersion A semver range string (e.g., "^1.0.0", ">=2.0.0").
 * @param installedVersion The installed version string to check against the range.
 * @returns `true` if the installed version satisfies the required version range.
 *
 */
export function isVersionSatisfied(requiredVersion: string, installedVersion: string) {
  const version = normalizeFullVersion(installedVersion);

  return semver.satisfies(version, requiredVersion, {
    includePrerelease: true,
  } as semver.Options);
}
