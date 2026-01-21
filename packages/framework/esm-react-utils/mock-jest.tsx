import React from 'react';
import { openmrsFetch } from '@openmrs/esm-api/mock';
import { configSchema } from '@openmrs/esm-config/mock';
import { getExtensionInternalStore } from '@openmrs/esm-extensions/mock';
import { createGlobalStore } from '@openmrs/esm-state/mock';
import {
  isDesktop as realIsDesktop,
  usePagination as realUsePagination,
  usePaginationInfo as realUsePaginationInfo,
  useOpenmrsPagination as realUseOpenmrsrPagination,
  useOpenmrsInfinite as realUseOpenmrsInfinite,
  useOpenmrsFetchAll as realUseOpenmrsFetchAll,
  useFhirPagination as realUseFhirPagination,
  useFhirInfinite as realUseFhirInfinite,
  useFhirFetchAll as realUseFhirFetchAll,
  useVisitContextStore as realUseVisitContextStore,
} from './src/index';
export { ConfigurableLink } from './src/ConfigurableLink';
export { useStore, useStoreWithActions, createUseStore } from './src/useStore';
import * as utils from '@openmrs/esm-utils';

export const ComponentContext = React.createContext(null);

export const openmrsComponentDecorator = jest.fn().mockImplementation(() => (component) => component);

export const useAttachments = jest.fn(() => ({
  isLoading: true,
  data: [],
  error: null,
  mutate: jest.fn(),
  isValidating: true,
}));

export const useConfig = jest.fn().mockImplementation((options?: { externalModuleName?: string }) => {
  if (options?.externalModuleName) {
    console.warn(`Mock useConfig called with externalModuleName: ${options.externalModuleName}`);
  }
  return utils.getDefaultsFromConfigSchema(configSchema);
});

export const useCurrentPatient = jest.fn(() => []);

export const usePatient = jest.fn(() => ({
  isLoading: true,
  patient: null,
  patientUuid: null,
  error: null,
}));

export const useSession = jest.fn(() => ({
  authenticated: false,
  sessionId: '',
}));

export const useLayoutType = jest.fn(() => 'desktop');

export const useRenderableExtensions = jest.fn(() => []);

export const useAssignedExtensions = jest.fn(() => []);

export const useExtensionSlotMeta = jest.fn(() => ({}));

export const useConnectedExtensions = jest.fn(() => []);

export const UserHasAccess = jest.fn().mockImplementation((props: any) => {
  return props.children;
});

export const useExtensionInternalStore = createGlobalStore('extensionInternal', getExtensionInternalStore());

export const useExtensionStore = jest.fn();

export const ExtensionSlot = jest.fn().mockImplementation(({ children }) => <>{children}</>);

export const Extension = jest.fn().mockImplementation((props: any) => <slot />);

export const useFeatureFlag = jest.fn().mockReturnValue(true);

export const usePagination = jest.fn(realUsePagination);
export const usePaginationInfo = jest.fn(realUsePaginationInfo);

export const useOpenmrsPagination = jest.fn(realUseOpenmrsrPagination);
export const useOpenmrsInfinite = jest.fn(realUseOpenmrsInfinite);
export const useOpenmrsFetchAll = jest.fn(realUseOpenmrsFetchAll);
export const useFhirPagination = jest.fn(realUseFhirPagination);
export const useFhirInfinite = jest.fn(realUseFhirInfinite);
export const useFhirFetchAll = jest.fn(realUseFhirFetchAll);

export const useVisit = jest.fn().mockReturnValue({
  error: null,
  mutate: jest.fn(),
  isValidating: true,
  currentVisit: null,
  activeVisit: null,
  currentVisitIsRetrospective: false,
});

export const useVisitContextStore = jest.fn(realUseVisitContextStore);

export const useVisitTypes = jest.fn(() => []);

export const useAbortController = jest.fn(() => {
  let aborted = false;
  return {
    abort: () => {
      aborted = true;
    },
    signal: {
      aborted,
    },
  } as AbortController;
});

export const useOpenmrsSWR = jest.fn((key: string | Array<any>) => {
  return { data: openmrsFetch(key.toString()) };
});

export const useDebounce = jest.fn().mockImplementation((value) => value);

export const useOnClickOutside = jest.fn(function useOnClickOutside() {
  return React.useRef();
});

export const useOnVisible = jest.fn(function useOnVisible() {
  return React.useRef();
});

export const useBodyScrollLock = jest.fn();

export const isDesktop = jest.fn(realIsDesktop);

export const useLocations = jest.fn().mockReturnValue([]);

export const toOmrsIsoString = jest.fn().mockImplementation((date: Date) => date.toISOString());

export const toDateObjectStrict = jest.fn().mockImplementation((date: string) => new Date(date));

export const getLocale = jest.fn().mockReturnValue('en');

export const useAppContext = jest.fn();

export const useAssignedExtensionIds = jest.fn();

export const useConnectivity = jest.fn();

export const useDefineAppContext = jest.fn();

export const useExtensionSlot = jest.fn();

export const useForceUpdate = jest.fn();

export const useLeftNav = jest.fn();

export const useLeftNavStore = jest.fn();

// TODO: Remove this in favour of usePrimaryIdentifierCode below
export const usePrimaryIdentifierResource = jest.fn();

export const usePrimaryIdentifierCode = jest.fn();

export const useEmrConfiguration = jest.fn().mockReturnValue({
  emrConfiguration: undefined,
  isLoadingEmrConfiguration: false,
  mutateEmrConfiguration: jest.fn(),
  errorFetchingEmrConfiguration: undefined,
});
