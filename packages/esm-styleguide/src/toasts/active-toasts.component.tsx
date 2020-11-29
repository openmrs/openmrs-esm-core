import React from "react";
import { Toast } from "./toast.component";

export default function ActiveToasts({ subject }) {
  const [toasts, setToasts] = React.useState(new Array());
  const [toastsClosing, setToastsClosing] = React.useState([]);
  const closeToast = React.useCallback(
    (toast) => {
      if (!toastsClosing.some((t) => t === toast)) {
        setToastsClosing(toastsClosing.concat(toast));
      }
    },
    [toastsClosing]
  );

  React.useEffect(() => {
    const subscription = subject.subscribe((toast) =>
      setToasts([...toasts, toast])
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [subject, toasts]);

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

      return () => clearTimeout(timeoutId);
    }
  }, [toastsClosing, toasts]);

  return toasts.map((toast) => (
    <Toast
      key={toast.id}
      toast={toast}
      isClosing={toastsClosing.some((t) => t === toast)}
      closeToast={closeToast}
    />
  ));
}
