/** @module @category Navigation */
import { navigate } from '../navigation/navigate';

const historyKey = 'openmrs:history';

function addToHistory(newLocation: string) {
  // Don't add URLs ending with '#' to history as they cause issues with browser back button
  // (they redirect to the non-# version, making back button appear broken)
  if (newLocation.endsWith('#')) {
    return;
  }

  let history = JSON.parse(sessionStorage.getItem(historyKey) ?? '[]') || [];

  if (history.length > 0 && history[history.length - 1] === newLocation) {
    return;
  }

  history.push(newLocation);
  const maxSize = 50;
  if (history.length > maxSize) {
    history = history.slice(-maxSize);
  }
  sessionStorage.setItem(historyKey, JSON.stringify(history));
}

/**
 * Initialize history from sessionStorage. If history  is empty, add
 * document.referrer if available.
 *
 * @internal
 */
export function setupHistory() {
  let history = JSON.parse(sessionStorage.getItem(historyKey) ?? '[]');
  if (history.length === 0 && document.referrer) {
    addToHistory(document.referrer);
  }

  window.addEventListener('single-spa:routing-event', (evt: CustomEvent) => {
    const history = getHistory();
    const currentUrl = window.location.href;

    if (evt.detail.originalEvent?.singleSpaTrigger == 'replaceState') {
      // handle redirect
      history[history.length - 1] = currentUrl;
      sessionStorage.setItem(historyKey, JSON.stringify(history));
    } else if (!evt.detail.originalEvent?.singleSpa && history.includes(currentUrl)) {
      // handle back button (as best we can tell whether it was used or not)
      goBackInHistory({ toUrl: currentUrl, skipNavigation: true });
    } else if (history[history.length - 1] !== currentUrl) {
      // handle normal navigation
      addToHistory(currentUrl);
    }
  });
}

/**
 * Returns a list of URLs representing the history of the current window session.
 */
export function getHistory(): Array<string> {
  return JSON.parse(sessionStorage.getItem(historyKey) ?? '[]');
}

/**
 * Rolls back the history to the specified point in the session history.
 *
 * This function has two use cases:
 * 1. When called programmatically by app code (skipNavigation=false): Trims the history
 *    AND navigates the browser to the specified URL.
 * 2. When called after browser back button is pressed (skipNavigation=true): Only trims
 *    the history since the browser has already navigated.
 *
 * @param toUrl: The URL in the history to navigate to. History after that index
 * will be deleted. If the URL is not found in the history, an error will be
 * thrown.
 * @param skipNavigation: If true, skips the navigation step. Use true when the browser
 * has already navigated (e.g., via back button). Defaults to false for programmatic calls.
 */
export function goBackInHistory({ toUrl, skipNavigation = false }: { toUrl: string; skipNavigation?: boolean }) {
  const history = getHistory();
  const toIndex = history.lastIndexOf(toUrl);
  if (toIndex != -1) {
    const newHistory = history.slice(0, toIndex + 1);
    sessionStorage.setItem(historyKey, JSON.stringify(newHistory));
    if (!skipNavigation) {
      navigate({ to: history[toIndex] });
    }
  } else {
    throw new Error(`URL ${toUrl} not found in history; cannot go back to it.`);
  }
}

/**
 * Clears the history from sessionStorage. This should be done when the user
 * logs out.
 */
export function clearHistory() {
  sessionStorage.removeItem(historyKey);
}
