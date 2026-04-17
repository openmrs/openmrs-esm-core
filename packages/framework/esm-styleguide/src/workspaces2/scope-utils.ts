/**
 * Determines whether workspaces should close based on a scope pattern and URL change.
 *
 * @param scopePattern - A regex pattern defining the scope. May include capture groups.
 * @param oldUrl - The URL being navigated away from.
 * @param newUrl - The URL being navigated to.
 * @returns `true` if the workspace should close, `false` if it should stay open.
 */
export function shouldCloseOnUrlChange(scopePattern: string, oldUrl: string, newUrl: string): boolean {
  try {
    const oldPathname = new URL(oldUrl, window.location.origin).pathname;
    const newPathname = new URL(newUrl, window.location.origin).pathname;
    const regex = new RegExp(scopePattern);

    const oldMatch = oldPathname.match(regex);
    const newMatch = newPathname.match(regex);

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
