import React, { useEffect, useRef } from "react";
import _i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import {
  ComponentConfig,
  ComponentContext,
  ExtensionData,
} from "./ComponentContext";

const i18n = (_i18n as any).default || _i18n;

const defaultOpts = {
  strictMode: true,
  throwErrorsToConsole: true,
  disableTranslations: false,
};

interface I18nextLoadNamespaceProps {
  forceUpdate(): void;
  ns: string;
  children?: React.ReactNode;
}

const I18nextLoadNamespace: React.FC<I18nextLoadNamespaceProps> = (props) => {
  useEffect(() => {
    i18n.on("languageChanged", props.forceUpdate);
    return () => i18n.off("languageChanged", props.forceUpdate);
  }, [props.forceUpdate]);

  const loadNamespaceErrRef = useRef(null);

  if (loadNamespaceErrRef.current) {
    throw loadNamespaceErrRef.current;
  }

  if (!i18n.hasLoadedNamespace(props.ns)) {
    const timeoutId = setTimeout(() => {
      console.warn(
        `openmrsComponentDecorator: the React suspense promise for i18next.loadNamespaces(['${props.ns}']) did not resolve nor reject after three seconds. This could mean you have multiple versions of i18next and haven't made i18next a webpack external in all projects.`
      );
    }, 3000);

    throw i18n
      .loadNamespaces([props.ns])
      .then(() => clearTimeout(timeoutId))
      .catch((err) => {
        clearTimeout(timeoutId);
        loadNamespaceErrRef.current = err;
      });
  }

  return <>{props.children}</>;
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
    Comp: React.ComponentType<any>
  ): React.ComponentType<any> {
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
            <ComponentContext.Provider value={this.state.config}>
              <React.Suspense fallback={null}>
                {opts.disableTranslations ? (
                  <Comp {...this.props} />
                ) : (
                  <I18nextLoadNamespace
                    ns={opts.moduleName}
                    forceUpdate={() => this.forceUpdate()}
                  >
                    <I18nextProvider i18n={i18n} defaultNS={opts.moduleName}>
                      <Comp {...this.props} />
                    </I18nextProvider>
                  </I18nextLoadNamespace>
                )}
              </React.Suspense>
            </ComponentContext.Provider>
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
