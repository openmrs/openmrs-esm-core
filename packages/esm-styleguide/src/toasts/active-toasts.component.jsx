import React from "react";
import { toastsSubject } from "./toasts";
import Toast from "./toast.component";

export default function ActiveToasts() {
  const [toasts, setToasts] = React.useState([]);
  const [toastsClosing, setToastsClosing] = React.useState([]);
  const closeToastRef = React.useRef();
  closeToastRef.current = closeToast;

  React.useEffect(() => {
    const subscription = toastsSubject.subscribe((toast) =>
      setToasts([...toasts, toast])
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toastsSubject, toasts]);

  React.useEffect(() => {
    if (toastsClosing.length > 0) {
      const timeoutId = setTimeout(() => {
        setToasts(
          toasts.filter(
            (toast) =>
              !toastsClosing.some((toastClosing) => toastClosing === toast)
          )
        );
        setToastsClosing([]);
      }, 200);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [toastsClosing, toasts]);

  return toasts.map((toast) => (
    <Toast
      key={toast.id}
      toast={toast}
      isClosing={toastsClosing.some((t) => t === toast)}
      closeToastRef={closeToastRef}
    />
  ));

  function closeToast(toast) {
    if (!toastsClosing.some((t) => t === toast)) {
      setToastsClosing(toastsClosing.concat(toast));
    }
  }
}
