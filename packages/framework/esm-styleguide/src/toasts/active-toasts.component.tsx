import React, { useCallback, useEffect, useState } from "react";
import { Subject } from "rxjs";
import { Toast, ToastNotificationMeta } from "./toast.component";

interface ActiveToastsProps {
  subject: Subject<ToastNotificationMeta>;
}

const ActiveToasts: React.FC<ActiveToastsProps> = ({ subject }) => {
  const [toasts, setToasts] = useState<Array<ToastNotificationMeta>>([]);

  const closeToast = useCallback((toast) => {
    setToasts((toasts) => toasts.filter((t) => t !== toast));
  }, []);

  useEffect(() => {
    const subscription = subject.subscribe((toast) =>
      setToasts((toasts) => [
        ...toasts.filter(
          (t) =>
            t.description !== toast.description ||
            t.kind !== toast.kind ||
            t.title !== toast.title
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
