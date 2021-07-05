import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { showModal } from "@openmrs/esm-styleguide";

const modalContext = React.createContext(() => {});

export function withModalContext<T extends Record<string, any>>(
  WrappedComponent: React.ComponentType<T>
): React.FC<T & { close: () => void }> {
  const close = useContext(modalContext);

  return (props) => <WrappedComponent {...props} close={close} />;
}

export function showReactModal(modal: React.ReactElement) {
  const disposeFunction = showModal((container) => {
    ReactDOM.render(
      <modalContext.Provider value={disposeFunction}>
        {modal}
      </modalContext.Provider>,
      container
    );
  });

  return disposeFunction;
}
