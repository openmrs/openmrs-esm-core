import {
  getCurrentUser,
  userHasAccess,
  CurrentUserWithoutResponseOption,
} from "@openmrs/esm-api";

const emptyLifecycle = {
  bootstrap() {
    return Promise.resolve();
  },
  mount() {
    return Promise.resolve();
  },
  unmount() {
    return Promise.resolve();
  },
};

const userOpts: CurrentUserWithoutResponseOption = {
  includeAuthStatus: false,
};

export function routePrefix(prefix: string, location: Location) {
  return location.pathname.startsWith(window.getOpenmrsSpaBase() + prefix);
}

export function routeRegex(regex: RegExp, location: Location) {
  const result = regex.test(
    location.pathname.replace(window.getOpenmrsSpaBase(), "")
  );
  return result;
}

export function wrapLifecycle(
  load: () => Promise<any>,
  role: string
): () => Promise<any> {
  return async () => {
    const user = await getCurrentUser(userOpts).toPromise();

    if (user && userHasAccess(role, user)) {
      return await load();
    }

    return emptyLifecycle;
  };
}
