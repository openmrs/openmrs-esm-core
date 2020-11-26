import React from "react";
import _i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import { ExtensionContext, ExtensionContextData } from "./ExtensionContext";

const i18n = (_i18n as any).default || _i18n;

const defaultOpts = {
  strictMode: true,
  throwErrorsToConsole: true,
  disableTranslations: false,
};

interface I18nextLoadNamespaceProps {
  forceUpdate(): void;
  ns: string;
}

const I18nextLoadNamespace: React.FC<I18nextLoadNamespaceProps> = (props) => {
  React.useEffect(() => {
    i18n.on("languageChanged", props.forceUpdate);
    return () => i18n.off("languageChanged", props.forceUpdate);
  }, [props.forceUpdate]);

  const loadNamespaceErrRef = React.useRef(null);

  if (loadNamespaceErrRef.current) {
    throw loadNamespaceErrRef.current;
  }

  if (!i18n.hasLoadedNamespace(props.ns)) {
    const timeoutId = setTimeout(() => {
      console.warn(
        `openmrsExtensionDecorator: the React suspense promise for i18next.loadNamespaces(['${props.ns}']) did not resolve nor reject after three seconds. This could mean you have multiple versions of i18next and haven't made i18next a webpack external in all projects.`
      );
    }, 3000);

    throw i18n
      .loadNamespaces([props.ns])
      .then(() => {
        clearTimeout(timeoutId);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        loadNamespaceErrRef.current = err;
      });
  }

  return <>{props.children}</>;
};

export interface ExtensionDecoratorOptions {
  disableTranslations?: boolean;
  strictMode?: boolean;
}

export function openmrsExtensionDecorator(
  userOpts?: ExtensionDecoratorOptions
) {
  const opts = Object.assign({}, defaultOpts, userOpts);

  return function decorateComponent(Comp: React.ComponentType) {
    return class OpenmrsReactRoot extends React.Component {
      static displayName = "Extension";

      constructor(props) {
        super(props);
        if (!props._extensionContext) {
          throw Error(
            "Extension did not receive _extensionContext prop. Perhaps " +
              "it was not rendered using `renderExtension`?"
          );
        }
        this.state = {
          ...this.state,
          extensionContext: props._extensionContext as ExtensionContextData,
        };
      }

      state = {
        caughtError: null,
        caughtErrorInfo: null,
        extensionContext: {
          actualExtensionSlotName: "",
          attachedExtensionSlotName: "",
          extensionSlotModuleName: "",
          extensionId: "",
          extensionModuleName: "",
        },
      };

      render() {
        if (this.state.caughtError) {
          // TO-DO have a UX designed for when a catastrophic error occurs
          return null;
        } else {
          const content = (
            <ExtensionContext.Provider value={this.state.extensionContext}>
              <React.Suspense fallback={null}>
                {opts.disableTranslations ? (
                  <Comp {...this.props} />
                ) : (
                  <I18nextLoadNamespace
                    ns={this.state.extensionContext.extensionModuleName}
                    forceUpdate={() => this.forceUpdate()}
                  >
                    <I18nextProvider
                      i18n={i18n}
                      defaultNS={
                        this.state.extensionContext.extensionModuleName
                      }
                    >
                      <Comp {...this.props} />
                    </I18nextProvider>
                  </I18nextLoadNamespace>
                )}
              </React.Suspense>
            </ExtensionContext.Provider>
          );

          if (opts.strictMode || !React.StrictMode) {
            return content;
          } else {
            return <React.StrictMode>{content}</React.StrictMode>;
          }
        }
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
          ...this.state,
          caughtError: err,
          caughtErrorInfo: info,
        });
      }
    };
  };
}
