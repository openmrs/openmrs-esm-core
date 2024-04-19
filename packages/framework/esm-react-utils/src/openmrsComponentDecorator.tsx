import React, { type ComponentType, type ErrorInfo, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { SWRConfig } from 'swr';
import type {} from '@openmrs/esm-globals';
import { openmrsFetch } from '@openmrs/esm-api';
import { ComponentContext, type ComponentConfig, type ExtensionData } from './ComponentContext';

const defaultOpts = {
  strictMode: true,
  throwErrorsToConsole: true,
  disableTranslations: false,
};

// Read more about the available config options here: https://swr.vercel.app/docs/api#configuration
const defaultSwrConfig = {
  // max number of retries after requests have failed
  errorRetryCount: 3,
  // default fetcher function
  fetcher: openmrsFetch,
  // only revalidate once every 30 seconds
  focusThrottleInterval: 30000,
};

export interface ComponentDecoratorOptions {
  moduleName: string;
  featureName: string;
  disableTranslations?: boolean;
  strictMode?: boolean;
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
              <SWRConfig value={defaultSwrConfig}>
                <ComponentContext.Provider value={this.state.config}>
                  {opts.disableTranslations ? (
                    <Comp {...this.props} />
                  ) : (
                    <I18nextProvider i18n={window.i18next} defaultNS={opts.moduleName}>
                      <Comp {...this.props} />
                    </I18nextProvider>
                  )}
                </ComponentContext.Provider>
              </SWRConfig>
            </Suspense>
          );

          if (opts.strictMode || !React.StrictMode) {
            return content;
          } else {
            return <React.StrictMode>{content}</React.StrictMode>;
          }
        }
      }
    };
  };
}
