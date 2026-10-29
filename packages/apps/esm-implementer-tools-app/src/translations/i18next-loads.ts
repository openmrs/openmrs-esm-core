/**
 * Helpers for reading the outcome of an i18next load. i18next's own reports can't be taken at face
 * value: it resolves its promises and calls back as a success for a language/namespace pair it
 * skipped because an earlier load of it failed, and it hands every waiting request every load error,
 * whichever pair that error came from. What it records per pair in its backend connector is reliable.
 */

const notLoadedState = 0;
const loadingState = 1;

interface BackendConnector {
  /** i18next's record of each `language|namespace` pair: 1 while loading, 2 once loaded, below 0 once failed. */
  state?: Record<string, number>;
  on?(event: 'loaded', listener: () => void): void;
  off?(event: 'loaded', listener: () => void): void;
}

function getConnector(): BackendConnector | undefined {
  return window.i18next?.services?.backendConnector as BackendConnector | undefined;
}

function getConnectorState(): Record<string, number> | undefined {
  return getConnector()?.state;
}

function getPairs(languages: Array<string>, namespaces: Array<string>) {
  return languages.flatMap((language) => namespaces.map((namespace) => ({ language, namespace })));
}

/** The namespaces i18next is reading for a language right now. */
export function getNamespacesLoading(language: string): Array<string> {
  return Object.entries(getConnectorState() ?? {})
    .filter(([pair, state]) => state === loadingState && pair.startsWith(`${language}|`))
    .map(([pair]) => pair.slice(language.length + 1));
}

/**
 * Clears i18next's failed mark from the pairs. Without this it skips them on the next attempt, while
 * still reporting that attempt as a success.
 */
export function clearFailedLoads(languages: Array<string>, namespaces: Array<string>) {
  const state = getConnectorState();

  for (const { language, namespace } of getPairs(languages, namespaces)) {
    if (state && state[`${language}|${namespace}`] < 0) {
      state[`${language}|${namespace}`] = notLoadedState;
    }
  }
}

/**
 * Clears the mark i18next leaves on a pair whose read never finished. i18next attaches any later
 * request for a pair it believes is loading to that read, so without this one hung read would make
 * every later request for the pair hang with it.
 */
export function releaseStalledLoads(languages: Array<string>, namespaces: Array<string>) {
  const state = getConnectorState();

  for (const { language, namespace } of getPairs(languages, namespaces)) {
    if (state?.[`${language}|${namespace}`] === loadingState) {
      delete state[`${language}|${namespace}`];
    }
  }
}

/**
 * Settles once none of the pairs is being read. i18next attaches a request for a pair it is already
 * reading to that read, so a request that needs a fresh read has to wait for it first.
 *
 * @param signal Aborting it stops the wait and rejects, so that a caller that gave up on a stalled
 *   read doesn't carry on whenever some later load finishes.
 */
export function waitForLoadsInFlight(
  languages: Array<string>,
  namespaces: Array<string>,
  signal?: AbortSignal,
): Promise<void> {
  const connector = getConnector();
  const pairs = getPairs(languages, namespaces);
  const isLoading = () =>
    pairs.some(({ language, namespace }) => connector?.state?.[`${language}|${namespace}`] === loadingState);

  if (!connector?.on || !connector.off || !isLoading()) {
    return Promise.resolve();
  }

  const { on, off } = connector;

  return new Promise((resolve, reject) => {
    const stop = () => {
      off.call(connector, 'loaded', check);
      signal?.removeEventListener('abort', abort);
    };
    const check = () => {
      if (!isLoading()) {
        stop();
        resolve();
      }
    };
    const abort = () => {
      stop();
      reject(signal?.reason);
    };

    on.call(connector, 'loaded', check);
    signal?.addEventListener('abort', abort, { once: true });
  });
}

/**
 * Works out whether a load of the given pairs failed, given the error i18next called back with.
 *
 * @returns The failure to report, or `undefined` if every pair loaded.
 */
export function findLoadFailure(
  languages: Array<string>,
  namespaces: Array<string>,
  callbackError: unknown,
): Error | undefined {
  const state = getConnectorState();
  const pairs = getPairs(languages, namespaces);

  // Without the connector's record there is nothing better to go on than the callback.
  if (!state && callbackError) {
    return asError(callbackError);
  }

  const failed = pairs.find(({ language, namespace }) => state && state[`${language}|${namespace}`] < 0);

  if (failed) {
    return callbackError
      ? asError(callbackError)
      : new Error(`Loading ${failed.namespace} for ${failed.language} failed; try again`);
  }

  const missing = pairs.find(({ language, namespace }) => !window.i18next.hasResourceBundle(language, namespace));

  return missing ? new Error(`i18next holds no ${missing.namespace} resources for ${missing.language}`) : undefined;
}

/** i18next hands a load failure to its callback as an array of errors rather than as an `Error`. */
export function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(Array.isArray(error) ? error.map(String).join('; ') : String(error));
}

/**
 * i18next puts no timeout on its backend, so a read that never settles, such as one awaiting a
 * module's config that never loads, would otherwise leave whatever waits on it waiting forever. Pair
 * it with `releaseStalledLoads`, so that the next attempt starts a read of its own.
 */
export function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), loadTimeoutMs);
    }),
  ]).finally(() => clearTimeout(timer)) as Promise<T>;
}

const loadTimeoutMs = 15_000;
