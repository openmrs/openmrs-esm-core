import { LifeCycles } from "single-spa";

export const emptyLifecycle: LifeCycles<never> = {
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

export function routeRegex(regex: RegExp, location: Location) {
  const result = regex.test(
    location.pathname.replace(window.getOpenmrsSpaBase(), "")
  );
  return result;
}
