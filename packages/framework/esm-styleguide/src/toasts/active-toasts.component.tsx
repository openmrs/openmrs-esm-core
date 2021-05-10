import React from "react";
import { Subject } from "rxjs";
import { Toast, ToastNotification } from "./toast.component";

interface ActiveToastsProps {
  subject: Subject<ToastNotification>;
}

const ActiveToasts: React.FC<ActiveToastsProps> = ({ subject }) => {
  const [toasts, setToasts] = React.useState<Array<ToastNotification>>([]);

  const closeToast = React.useCallback((toast) => {
    setToasts((toasts) => toasts.filter((t) => t !== toast));
  }, []);

  React.useEffect(() => {
    const subscription = subject.subscribe((toast) =>
      setToasts((toasts) => [
        ...toasts.filter(
          (t) =>
            t.title !== toast.title ||
            t.kind !== toast.kind ||
            t.description !== toast.description ||
            t.action !== toast.action
        ),
        toast,
      ])
    );

    return () => subscription.unsubscribe();
  }, [subject]);

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          closeToast={() => closeToast(toast)}
        />
      ))}
    </>
  );
};

export default ActiveToasts;
