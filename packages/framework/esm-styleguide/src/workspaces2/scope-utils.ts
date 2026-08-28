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

    const oldRelativeMatch = oldPathnames.spaRelative.match(regex);
    const newRelativeMatch = newPathnames.spaRelative.match(regex);
    const useSpaRelativePathnames = Boolean(oldRelativeMatch || newRelativeMatch);

    // scopePattern is defined against the SPA-relative pathname. Fall back to
    // the full pathname when neither relative pathname matches so that existing
    // patterns containing the SPA base path continue to work.
    const oldMatch = useSpaRelativePathnames ? oldRelativeMatch : oldPathnames.full.match(regex);
    const newMatch = useSpaRelativePathnames ? newRelativeMatch : newPathnames.full.match(regex);

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
  const spaBase = new URL(window.getOpenmrsSpaBase(), window.location.origin).pathname.replace(/\/+$/, '');
  const spaRelative =
    !spaBase || spaBase === full ? '/' : full.startsWith(`${spaBase}/`) ? full.slice(spaBase.length) : full;

  return { full, spaRelative };
}
