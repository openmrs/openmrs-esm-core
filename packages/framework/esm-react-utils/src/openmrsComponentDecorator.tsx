import React, { type ComponentType, type ErrorInfo, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { SWRConfig, type SWRConfiguration } from 'swr';
import type {} from '@openmrs/esm-globals';
import { openmrsFetch, OpenmrsFetchError } from '@openmrs/esm-api';
import { type ComponentConfig, type ExtensionData } from '@openmrs/esm-extensions';
import { ComponentContext } from './ComponentContext';

const defaultOpts = {
  strictMode: true,
  throwErrorsToConsole: true,
  disableTranslations: false,
};

// Read more about the available config options here: https://swr.vercel.app/docs/api#configuration
const defaultSwrConfig: SWRConfiguration = {
  // max number of retries after requests have failed
  errorRetryCount: 3,
  // default fetcher function
  fetcher: openmrsFetch,
  // only revalidate once every 30 minutes
  focusThrottleInterval: 1800000,
  revalidateIfStale: true,
  // disable automatic revalidations by default
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
  // NOTE: deliberately no `provider`. SWR's default cache is already a single
  // shared instance per swr module, which (because swr is a module-federation
  // singleton) is shared across every app and extension — so we get one global
  // cache for free. Do NOT reintroduce a custom `provider: () => sharedMap`
  // here: SWR ties a provider cache's global state to the lifecycle of the
  // first `<SWRConfig>` boundary that initializes it (its unmount runs
  // `SWRGlobalState.delete(cache)`). Since every decorated component mounts its
  // own `<SWRConfig>`, the first to mount would own that deleter; when it
  // unmounts while others are still mounted (e.g. navigating the patient chart
  // or closing a workspace) it wipes the shared state and the survivors crash
  // on their next render with "undefined is not iterable". The default cache
  // has no per-boundary owner, so it is never torn down.
  shouldRetryOnError: (error) => {
    if (error instanceof OpenmrsFetchError) {
      const status = error.response.status;
      // retry all server-side errors
      if (status >= 500) {
        return true;
      }

      // retry on authentication failure or rate-limited requests
      if (status === 401 || status === 403 || status === 429) {
        return true;
      }

      // do not retry on other client-side errors
      return false;
    }

    return true;
  },
};

export interface ComponentDecoratorOptions {
  moduleName: string;
  featureName: string;
  disableTranslations?: boolean;
  strictMode?: boolean;
  // `provider` is intentionally omitted: a custom cache provider must not be set
  // per decorated component (see the note on `defaultSwrConfig` above). `fetcher`
  // is fixed to `openmrsFetch`.
  swrConfig?: Partial<Omit<SWRConfiguration, 'fetcher' | 'provider'>>;
}

export interface OpenmrsReactComponentProps {
  _extensionContext?: ExtensionData;
}

export interface OpenmrsReactComponentState {
  caughtError: any;
  caughtErrorInfo: ErrorInfo | null;
  config: ComponentConfig;
}

export function openmrsComponentDecorator<T>(userOpts: ComponentDecoratorOptions) {
  if (
    typeof userOpts !== 'object' ||
    typeof userOpts.featureName !== 'string' ||
    typeof userOpts.moduleName !== 'string'
  ) {
    throw new Error('Invalid options');
  }

  const opts = Object.assign({}, defaultOpts, userOpts);
  const swrConfig = { ...defaultSwrConfig, ...opts.swrConfig };

  return function decorateComponent(Comp: ComponentType<T>): ComponentType<T> {
    return class OpenmrsReactComponent extends React.Component<
      OpenmrsReactComponentProps & T,
      OpenmrsReactComponentState
    > {
      static displayName = `OpenmrsReactComponent(${opts.featureName})`;

      constructor(props: OpenmrsReactComponentProps & T) {
        super(props);
        this.state = {
          caughtError: null,
          caughtErrorInfo: null,
          config: {
            moduleName: opts.moduleName,
            featureName: opts.featureName,
            extension: props._extensionContext,
          },
        };
      }

      componentDidCatch(err: any, info: ErrorInfo) {
        if (info && info.componentStack) {
          err.extra = Object.assign(err.extra || {}, {
            componentStack: info.componentStack,
          });
        }

        if (opts.throwErrorsToConsole) {
          setTimeout(() => {
            throw err;
          });
        }

        this.setState({
          caughtError: err,
          caughtErrorInfo: info,
        });
      }

      render() {
        if (this.state.caughtError) {
          // TO-DO have a UX designed for when a catastrophic error occurs
          return <div>An error has occurred. Please try reloading the page.</div>;
        } else {
          const content = (
            <Suspense fallback={null}>
              <SWRConfig value={swrConfig}>
                <ComponentContext.Provider value={this.state.config}>
                  {opts.disableTranslations ? (
                    <Comp {...this.props} />
                  ) : (
                    <I18nextProvider
                      i18n={window.i18next}
                      defaultNS={
                        this.state.config.extension
                          ? `${this.state.config.moduleName}___${this.state.config.extension.extensionSlotName}___${this.state.config.extension.extensionId}`
                          : this.state.config.moduleName
                      }
                    >
                      <Comp {...this.props} />
                    </I18nextProvider>
                  )}
                </ComponentContext.Provider>
              </SWRConfig>
            </Suspense>
          );

          if (!opts.strictMode || !React.StrictMode) {
            return content;
          } else {
            return <React.StrictMode>{content}</React.StrictMode>;
          }
        }
      }
    };
  };
}
