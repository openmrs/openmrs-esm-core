/**
 * Determines whether workspaces should close based on a scope pattern and URL change.
 *
 * @param scopePattern - A regex pattern matched against the SPA-relative pathname. May include capture groups.
 * @param oldUrl - The URL being navigated away from.
 * @param newUrl - The URL being navigated to.
 * @returns `true` if the workspace should close, `false` if it should stay open.
 */
export function shouldCloseOnUrlChange(scopePattern: string, oldUrl: string, newUrl: string): boolean {
  try {
    const regex = new RegExp(scopePattern);
    const oldPathnames = getPathnames(oldUrl);
    const newPathnames = getPathnames(newUrl);

    if (oldPathnames.spaRelative === null || newPathnames.spaRelative === null) {
      return true;
    }

    // scopePattern is defined against the SPA-relative pathname. Fall back to
    // the full pathnames when the relative pathnames don't both match, so that
    // patterns containing the SPA base path also work.
    let oldMatch = regex.exec(oldPathnames.spaRelative);
    let newMatch = regex.exec(newPathnames.spaRelative);
    if (!oldMatch || !newMatch) {
      oldMatch = regex.exec(oldPathnames.full);
      newMatch = regex.exec(newPathnames.full);
    }

    if (!oldMatch || !newMatch) {
      // One or both URLs don't match the pattern - close workspace
      return true;
    }

    if (oldMatch.length > 1) {
      // Has capture groups - compare captured values
      const capturesMatch = oldMatch.slice(1).every((val, i) => val === newMatch[i + 1]);
      return !capturesMatch;
    }

    // Both match with no captures - stay open
    return false;
  } catch {
    // If regex is invalid or URL parsing fails, close as a safety measure
    return true;
  }
}

function getPathnames(url: string) {
  const full = new URL(url, window.location.origin).pathname;
  const spaBasePathname = new URL(window.getOpenmrsSpaBase?.() ?? '/', window.location.origin).pathname;
  const spaBase = spaBasePathname.endsWith('/') ? spaBasePathname.slice(0, -1) : spaBasePathname;
  let spaRelative: string | null = null;

  if (!spaBase) {
    spaRelative = full;
  } else if (spaBase === full) {
    spaRelative = '/';
  } else if (full.startsWith(`${spaBase}/`)) {
    spaRelative = full.slice(spaBase.length);
  }

  return { full, spaRelative };
}
