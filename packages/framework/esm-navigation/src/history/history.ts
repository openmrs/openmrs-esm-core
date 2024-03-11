/** @module @category Navigation */
import { navigate } from '../navigation/navigate';

const historyKey = 'openmrs:history';

function addToHistory(newLocation: string) {
  let history = JSON.parse(sessionStorage.getItem(historyKey) ?? '[]') || [];
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
    if (evt.detail.originalEvent?.singleSpaTrigger == 'replaceState') {
      // handle redirect
      history[history.length - 1] = window.location.href;
      sessionStorage.setItem(historyKey, JSON.stringify(history));
    } else if (!evt.detail.originalEvent?.singleSpa && history.includes(window.location.href)) {
      // handle back button (as best we can tell whether it was used or not)
      goBackInHistory({ toUrl: window.location.href });
    } else if (history[history.length - 1] !== window.location.href) {
      // handle normal navigation
      addToHistory(window.location.href);
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
 * Rolls back the history to the specified point and navigates to that URL.
 *
 * @param toUrl: The URL in the history to navigate to. History after that index
 * will be deleted. If the URL is not found in the history, an error will be
 * thrown.
 */
export function goBackInHistory({ toUrl }: { toUrl: string }) {
  const history = getHistory();
  const toIndex = history.lastIndexOf(toUrl);
  if (toIndex != -1) {
    const newHistory = history.slice(0, toIndex + 1);
    navigate({ to: history[toIndex] });
    sessionStorage.setItem(historyKey, JSON.stringify(newHistory));
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
