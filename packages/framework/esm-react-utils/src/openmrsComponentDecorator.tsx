import React, { type ComponentType, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import type {} from "@openmrs/esm-globals";
import {
  ComponentConfig,
  ComponentContext,
  ExtensionData,
} from "./ComponentContext";

const defaultOpts = {
  strictMode: true,
  throwErrorsToConsole: true,
  disableTranslations: false,
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
  caughtErrorInfo: any;
  config: ComponentConfig;
}

export function openmrsComponentDecorator(userOpts: ComponentDecoratorOptions) {
  if (
    typeof userOpts !== "object" ||
    typeof userOpts.featureName !== "string" ||
    typeof userOpts.moduleName !== "string"
  ) {
    throw new Error("Invalid options");
  }

  const opts = Object.assign({}, defaultOpts, userOpts);

  return function decorateComponent(
    Comp: ComponentType<any>
  ): ComponentType<any> {
    return class OpenmrsReactComponent extends React.Component<
      OpenmrsReactComponentProps,
      OpenmrsReactComponentState
    > {
      static displayName = `OpenmrsReactComponent(${opts.featureName})`;

      constructor(props: OpenmrsReactComponentProps) {
        super(props);
        this.state = {
          caughtError: null,
          caughtErrorInfo: null,
          config: {
            moduleName: opts.moduleName,
            extension: props._extensionContext,
          },
        };
      }

      componentDidCatch(err: any, info: any) {
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
          return (
            <div>An error has occurred. Please try reloading the page.</div>
          );
        } else {
          const content = (
            <Suspense fallback={null}>
              <ComponentContext.Provider value={this.state.config}>
                {opts.disableTranslations ? (
                  <Comp {...this.props} />
                ) : (
                  <I18nextProvider
                    i18n={window.i18next}
                    defaultNS={opts.moduleName}
                  >
                    <Comp {...this.props} />
                  </I18nextProvider>
                )}
              </ComponentContext.Provider>
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
