import { useEffect } from "@storybook/client-api";
import { showToast } from "../../src/toasts/toasts.js";

let count = 0;

export const withToast = (storyFn) => {
  useEffect(() => {
    const toastEls = document.querySelectorAll(".toast-clicked");
    toastEls.forEach((toastEl) => {
      toastEl.addEventListener("click", toastClickHandler);
    });

    return () => {
      toastEls.forEach((toastEl) => {
        toastEl.removeEventListener("click", toastClickHandler);
      });
    };
  });

  return storyFn();
};

function toastClickHandler() {
  showToast({ description: `This is a toast ${count++}` });
}
