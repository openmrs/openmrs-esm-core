import { getLoggedInUser, userHasAccess } from "@openmrs/esm-api";

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
  requiredPrivilege: string
): () => Promise<any> {
  return async () => {
    const user = await getLoggedInUser();
    if (user && userHasAccess(requiredPrivilege, user)) {
      return load();
    }

    return emptyLifecycle;
  };
}
