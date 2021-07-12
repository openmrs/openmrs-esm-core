import React from "react";
import { subscribeToasts, ToastNotificationMeta } from "./state";
import { Toast } from "./toast.component";

interface ActiveToastsProps {}

const ActiveToasts: React.FC<ActiveToastsProps> = ({}) => {
  const [toasts, setToasts] = React.useState<Array<ToastNotificationMeta>>([]);

  React.useEffect(
    () =>
      subscribeToasts((state) => {
        setToasts(state.toasts);
      }),
    []
  );

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </>
  );
};

export default ActiveToasts;
