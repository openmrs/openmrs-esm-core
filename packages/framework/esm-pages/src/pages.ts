/** @category Page Registration */
import { type RegisteredPageDefinition } from '@openmrs/esm-globals';
import { createGlobalStore } from '@openmrs/esm-state';
import { type LifeCycles, getMountedApps, registerApplication } from 'single-spa';
import { omit, uniq } from 'lodash-es';

/** Internal store of registered pages */
interface PageRegistry {
  /** Pages indexed by name */
  pages: Record<string, RegisteredPageDefinition>;
}

const pageRegistryStore = createGlobalStore<PageRegistry>('pageRegistry', {
  pages: {},
});

export interface PageRegistration extends RegisteredPageDefinition {
  activityFn: (location: Location) => boolean;
  load: () => Promise<LifeCycles>;
}

/** @internal */
export function getPageRegistration(appName: string, order: number): RegisteredPageDefinition | undefined {
  return pageRegistryStore.getState().pages[`${appName}-${order}`];
}

/** @internal */
export function getActiveAppNames(includeUtilityPages: boolean = false, mountedApps?: Array<string>): Array<string> {
  if (typeof mountedApps === 'undefined') {
    mountedApps = getMountedApps();
  }

  if (!includeUtilityPages) {
    const registeredPages = pageRegistryStore.getState().pages;
    mountedApps = mountedApps.filter((page) => registeredPages[page]?.type !== 'utility');
  }

  return uniq(
    mountedApps.map((page) => {
      let pageName = page;
      pageName = pageName.replace(/^@[^\/]*\/(?:esm-)?(.+)-app-page-.*$/, '$1');
      return pageName;
    }),
  );
}

/** @internal */
export function getActivePageRegistrations(includeUtilityPages: boolean = false): Array<RegisteredPageDefinition> {
  let mountedPages = getMountedApps();
  if (!includeUtilityPages) {
    mountedPages = mountedPages.filter(
      (page) =>
        !page.includes('devtools') &&
        !page.includes('implementer-tools-app') &&
        !page.includes('primary-navigation-app'),
    );
  }

  const pageRegistrations = pageRegistryStore.getState().pages;
  return mountedPages
    .filter((page) => page.includes('-page-'))
    .map((page) => {
      const [appName, order] = page.split('-page-', 1);
      return pageRegistrations[`${appName}-${order}`];
    })
    .filter((page) => typeof page !== 'undefined' && page !== null);
}

/** @internal */
export function registerPage(pageDefinition: PageRegistration) {
  pageRegistryStore.setState((state) => {
    state[`${pageDefinition.appName}-${pageDefinition.order}`] = omit(pageDefinition, 'load', 'activityFn');
    return state;
  });
  registerApplication(pageDefinition.appName, pageDefinition.load, pageDefinition.activityFn);
}

/** @deprecated */
export function setLeftNav() {}

/** @deprecated */
export function unsetLeftNav() {}
