import React from "react";
import { I18nextProvider } from "react-i18next";
import _i18n from "i18next";
import { ModuleNameContext } from "./context";

const i18n = (_i18n as any).default || _i18n;

const defaultOpts = {
  strictMode: true,
  throwErrorsToConsole: true,
  disableTranslations: false,
};

export function openmrsRootDecorator(userOpts) {
  if (
    typeof userOpts !== "object" ||
    typeof userOpts.featureName !== "string" ||
    typeof userOpts.moduleName !== "string"
  ) {
    throw new Error(
      "openmrs-react-root-decorator should be called with an opts object that has " +
        "1. a featureName string that will be displayed to users, and 2. a moduleName string. " +
        "The moduleName string will be used to look up configuration. " +
        "e.g. openmrsRootDecorator({featureName: 'nice feature', moduleName: '@openmrs/esm-nice-feature' })"
    );
  }

  const opts = Object.assign({}, defaultOpts, userOpts);

  return function decorateComponent(Comp) {
    return class OpenmrsReactRoot extends React.Component {
      static displayName = `OpenmrsReactRoot(${opts.featureName})`;
      state = {
        caughtError: null,
        caughtErrorInfo: null,
      };
      render() {
        if (this.state.caughtError) {
          // TO-DO have a UX designed for when a catastrophic error occurs
          return null;
        } else {
          const rootComponent = (
            <ModuleNameContext.Provider value={opts.moduleName}>
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
            </ModuleNameContext.Provider>
          );
          if (opts.strictMode || !React.StrictMode) {
            return rootComponent;
          } else {
            return <React.StrictMode>{rootComponent}</React.StrictMode>;
          }
        }
      }
      componentDidCatch(err, info) {
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
    };
  };
}

function I18nextLoadNamespace(props) {
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
        `openmrs-react-root-decorator: the React suspense promise for i18next.loadNamespaces(['${props.ns}']) did not resolve nor reject after three seconds. This could mean you have multiple versions of i18next and haven't made i18next a webpack external in all projects.`
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

  return props.children;
}
