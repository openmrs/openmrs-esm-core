import React from "react";
import { render } from "react-dom";
import { Subject } from "rxjs";
import ActiveToasts from "./active-toasts.component";
import { ToastDescriptor } from "./toast.component";
import { isEmpty } from "lodash";

export const toastsSubject = new Subject();
let toastId = 0;

const toastsContainer = document.createElement("div");

const renderToasts = () => {
  document.body.appendChild(toastsContainer);
  // @ts-ignore
  render(<ActiveToasts subject={toastsSubject} />, toastsContainer);
};

toastsContainer.className = "omrs-toasts-container";

if (document.readyState === "complete") {
  renderToasts();
} else {
  window.addEventListener("load", renderToasts);
}

export function showToast(toast: ToastDescriptor) {
  if (toast && isNotEmpty(toast.description)) {
    toast.id = toastId++;
    toastsSubject.next(toast);
  } else {
    throw Error(
      `showToast must be called with an object that has a 'description' property that is a non-empty string or object`
    );
  }
}

function isNotEmpty(description) {
  return typeof description === "string"
    ? description.trim().length > 0
    : typeof description === "object"
    ? !isEmpty(description)
    : false;
}
