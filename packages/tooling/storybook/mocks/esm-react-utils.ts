// Storybook-compatible mock for @openmrs/esm-react-utils.
// Provides working implementations of the hooks and components that
// styleguide components actually import, without depending on the
// full OpenMRS runtime.
import React, { type PropsWithChildren, useEffect, useMemo, useRef } from 'react';

// --- Layout type (controllable from Storybook toolbar) ---

let currentLayoutType = 'small-desktop';

export function setLayoutType(type: string) {
  currentLayoutType = type;
}

export function useLayoutType() {
  return currentLayoutType;
}

export function isDesktop(layout: string) {
  return layout === 'small-desktop' || layout === 'large-desktop';
}

// --- Config (delegates to esm-config mock) ---

export { useConfig } from '@openmrs/esm-config';

// --- Pagination (pure React hook, no framework dependency) ---

export function usePaginationInfo(pageSize: number, totalItems: number, pageNumber: number, currentItems: number) {
  const pageSizes = useMemo(() => {
    let numberOfPages = Math.ceil(totalItems / pageSize);
    if (isNaN(numberOfPages)) {
      numberOfPages = 0;
    }
    return [...Array(numberOfPages).keys()].map((x) => (x + 1) * pageSize);
  }, [pageSize, totalItems]);

  const pageItemsCount = useMemo(() => {
    if (pageSize > totalItems) {
      return totalItems;
    } else if (pageSize * pageNumber > totalItems) {
      return pageSize * (pageNumber - 1) + currentItems;
    } else {
      return pageSize * pageNumber;
    }
  }, [pageSize, totalItems, pageNumber, currentItems]);

  return { pageSizes, pageItemsCount };
}

export function usePagination<T>(data: T[] = [], resultsPerPage: number = 10) {
  const totalPages = Math.ceil(data.length / resultsPerPage);
  return {
    results: data.slice(0, resultsPerPage),
    goTo: (_page: number) => {},
    currentPage: 1,
    paginated: true,
    showNextButton: totalPages > 1,
    showPreviousButton: false,
    totalPages,
  };
}

// --- ConfigurableLink (simple <a> tag, avoids importing esm-navigation) ---

export function ConfigurableLink({
  to,
  children,
  ...rest
}: PropsWithChildren<
  {
    to: string;
    templateParams?: Record<string, string>;
    onBeforeNavigate?: () => void;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>) {
  return React.createElement('a', { href: to, ...rest }, children);
}

// --- Simple passthrough components ---

export const RenderIfValueIsTruthy: React.FC<PropsWithChildren<{ value: unknown; fallback?: React.ReactNode }>> = ({
  children,
  value,
  fallback,
}) => {
  if (Boolean(value)) {
    return React.createElement(React.Fragment, null, children);
  }
  return fallback ? React.createElement(React.Fragment, null, fallback) : null;
};

export const ComponentContext = React.createContext<any>(null);

export const ExtensionSlot: React.FC<PropsWithChildren<any>> = ({ children }) =>
  React.createElement(React.Fragment, null, children);

export const Extension: React.FC<any> = () => React.createElement('slot');

export const UserHasAccess: React.FC<PropsWithChildren> = ({ children }) =>
  React.createElement(React.Fragment, null, children);

// --- Hooks returning sensible defaults ---

export function useSession() {
  return { authenticated: false, sessionId: '' };
}

export function useFeatureFlag() {
  return true;
}

export function useDebounce<T>(value: T) {
  return value;
}

export function useOnClickOutside<T extends HTMLElement>(handler: (event: MouseEvent) => void, active = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!active || !ref.current || !event.target || !(event.target instanceof Node)) {
        return;
      }
      if (ref.current.contains(event.target)) {
        return;
      }
      handler(event as MouseEvent);
    };

    window.addEventListener('mousedown', listener);
    window.addEventListener('touchstart', listener);
    return () => {
      window.removeEventListener('mousedown', listener);
      window.removeEventListener('touchstart', listener);
    };
  }, [handler, active]);

  return ref;
}

export function useOnVisible() {
  return useRef(null);
}

export function useBodyScrollLock() {}

export function getLocale() {
  return 'en';
}

export function useConnectivity() {
  return true;
}

export function useAppContext() {
  return undefined;
}

export function usePatient() {
  return { isLoading: false, patient: null, patientUuid: null, error: null };
}

export function useVisit() {
  return {
    error: null,
    mutate: () => {},
    isValidating: false,
    currentVisit: null,
    activeVisit: null,
    currentVisitIsRetrospective: false,
  };
}

export function useVisitTypes() {
  return [];
}

export function useLocations() {
  return [];
}

export function useRenderableExtensions() {
  return [];
}

export function useAssignedExtensions() {
  return [];
}

export function useConnectedExtensions() {
  return [];
}

export function useExtensionSlotMeta() {
  return {};
}

export function useStore(store: any) {
  return store?.getState?.() ?? {};
}

export function openmrsComponentDecorator() {
  return (c: any) => c;
}
