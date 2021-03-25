import React from "react";
import { render } from "react-dom";
import { Subject } from "rxjs";
import { ToastDescriptor, ToastNotification } from "./toast.component";
import ActiveToasts from "./active-toasts.component";
import isEmpty from "lodash-es/isEmpty";

const toastsSubject = new Subject<ToastNotification>();
let toastId = 0;

export function renderToasts(target: HTMLElement | null) {
  if (target) {
    render(<ActiveToasts subject={toastsSubject} />, target);
  }
}

function isNotEmpty(description: React.ReactNode) {
  return typeof description === "string"
    ? description.trim().length > 0
    : typeof description === "object"
    ? !isEmpty(description)
    : false;
}

export function showToast(toast: ToastDescriptor) {
  if (toast && isNotEmpty(toast.description)) {
    setTimeout(() => {
      // always use in subsequent cycle
      toastsSubject.next({
        ...toast,
        id: toastId++,
      });
    }, 0);
  } else {
    console.error(
      `showToast must be called with an object having a 'description' property that is a non-empty string or object`
    );
  }
}
