import React from "react";
import { always } from "kremling";

const defaultOptions = {
  millis: 4000,
};

export default function Toast({ toast, closeToastRef, isClosing }) {
  const { millis, description } = Object.assign({}, toast, defaultOptions);

  const [waitingForTime, setWaitingForTime] = React.useState(true);
  const [isMounting, setIsMounting] = React.useState(true);

  React.useEffect(() => {
    if (waitingForTime) {
      const timeoutId = setTimeout(() => {
        closeToastRef.current(toast);
      }, millis);

      return () => {
        clearTimeout(timeoutId);
      };
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
    <span
      className={always("omrs-toast omrs-type-body-regular")
        .maybe("omrs-toast-closing", isClosing)
        .maybe("omrs-toast-mounting", isMounting)}
      onMouseEnter={() => setWaitingForTime(false)}
      onMouseLeave={() => setWaitingForTime(true)}
    >
      <span>{description}</span>
      <span>
        <button
          className="omrs-btn-icon-medium"
          onClick={() => closeToastRef.current(toast)}
        >
          <svg className="omrs-icon" fill="var(--omrs-color-ink-white)">
            <use xlinkHref="#omrs-icon-close" />
          </svg>
        </button>
      </span>
    </span>
  );
}
