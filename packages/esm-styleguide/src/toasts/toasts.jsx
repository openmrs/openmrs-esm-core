import React from "react";
import ReactDOM from "react-dom";
import { Subject } from "rxjs";
import ActiveToasts from "./active-toasts.component";

export const toastsSubject = new Subject();
let toastId = 0;

const toastsContainer = document.createElement("div");
toastsContainer.className = "omrs-toasts-container";
document.body.appendChild(toastsContainer);

ReactDOM.render(<ActiveToasts />, toastsContainer);

export function showToast(toast) {
  if (
    toast &&
    typeof toast.description === "string" &&
    toast.description.trim().length > 0
  ) {
    toast.id = toastId++;
    toastsSubject.next(toast);
  } else {
    throw Error(
      `showToast must be called with an object that has a 'description' property that is a non-empty string`
    );
  }
}
