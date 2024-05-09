const appContext = {};

const nothing = Object();

export function registerContext<T extends {} = {}>(namespace: string, initialValue: T = nothing) {
  appContext[namespace] = initialValue ?? {};
}

export function getContext<T extends {} = {}, U extends {} = T>(
  namespace: string,
  selector: (state: Readonly<T>) => U = (state) => state as unknown as U,
): Readonly<U> | null {
  const value = appContext[namespace];

  if (!value) {
    return null;
  }

  return Object.freeze(Object.assign({}, selector ? selector(value) : value));
}

export function updateContext<T extends {} = {}>(namespace: string, update: (state: T) => T) {
  appContext[namespace] = update(appContext[namespace] ?? {});
}
