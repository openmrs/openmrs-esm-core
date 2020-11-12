import React from "react";
import { always } from "kremling";
import {
  ToastNotification,
  InlineNotification,
  NotificationActionButton,
} from "carbon-components-react";

const defaultOptions = {
  millis: 4000,
};

export default function Toast({ toast, closeToast, isClosing }) {
  const { millis = defaultOptions.millis, description } = toast;

  const [waitingForTime, setWaitingForTime] = React.useState(true);
  const [isMounting, setIsMounting] = React.useState(true);
  const onClose = React.useCallback(() => closeToast(toast), []);

  React.useEffect(() => {
    if (waitingForTime) {
      const timeoutId = setTimeout(() => closeToast(toast), millis);
      return () => clearTimeout(timeoutId);
    }
  }, [waitingForTime]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounting(false);
    }, 20);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
<<<<<<< HEAD
    <span
      className={always("omrs-toast omrs-type-body-regular")
        .maybe("omrs-toast-closing", isClosing)
        .maybe("omrs-toast-mounting", isMounting)}
      onMouseEnter={() => setWaitingForTime(false)}
      onMouseLeave={() => setWaitingForTime(true)}
    >
      <span>{description}</span>
      <span>
        <button className="omrs-btn-icon-medium" onClick={onClose}>
          <svg className="omrs-icon" fill="var(--omrs-color-ink-white)">
            <use xlinkHref="#omrs-icon-close" />
          </svg>
        </button>
      </span>
    </span>
=======
    <>
      <InlineNotification
        kind="info"
        iconDescription="describes the close button"
        subtitle={
          <span>
            Subtitle text goes here. <a href="#example">Example link</a>
          </span>
        }
        title=""
      />
    </>
>>>>>>> b6abf73... Add carbon-components-react
  );
}
