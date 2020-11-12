import React from "react";
import { render } from "react-dom";
import { Subject } from "rxjs";
import ActiveToasts from "./active-toasts.component";

export const toastsSubject = new Subject();
let toastId = 0;

export interface Foo {
 bar: string;
}

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
