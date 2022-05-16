/** @module @category UI */
import React from "react";
import { createRoot } from "react-dom/client";
import { Subject } from "rxjs";
import { ToastDescriptor, ToastNotificationMeta } from "./toast.component";
import ActiveToasts from "./active-toasts.component";
import isEmpty from "lodash-es/isEmpty";

const toastsSubject = new Subject<ToastNotificationMeta>();
let toastId = 0;

/**
 * Starts a rendering host for toast notifications. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the toast notifications.
 */
export function renderToasts(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActiveToasts subject={toastsSubject} />);
  }
}

function isNotEmpty(description: React.ReactNode) {
  return typeof description === "string"
    ? description.trim().length > 0
    : typeof description === "object"
    ? !isEmpty(description)
    : false;
}

/**
 * Displays a toast notification in the UI.
 * @param toast The description of the toast to display.
 */
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
