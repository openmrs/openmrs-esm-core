/** @module @category UI */
import React from "react";
import { createRoot } from "react-dom/client";
import { Subject } from "rxjs";

import {
  ActionableToastDescriptor,
  ActionableToastMeta,
} from "./actionable-toast.component";
import ActiveActionableToasts from "./active-actionable-toast.component";

const actionableToastsSubject = new Subject<ActionableToastMeta>();
let actionableToastId = 0;

/**
 * Starts a rendering host for the actionable toasts. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the actionable toasts.
 */
export function renderActionableToasts(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActiveActionableToasts subject={actionableToastsSubject} />);
  }
}

function isNotEmpty(title: string) {
  return typeof title === "string" ? title.trim().length > 0 : false;
}

/**
 * Displays a snack bar notification in the UI.
 * @param actionableToast The description of the snack bar to display.
 */
export function showActionableToast(
  actionableToast: ActionableToastDescriptor
) {
  if (actionableToast && isNotEmpty(actionableToast.title)) {
    setTimeout(() => {
      actionableToastsSubject.next({
        ...actionableToast,
        id: actionableToastId++,
      });
    }, 0);
  } else {
    console.error(
      `showActionableToast must be called with an object having a 'title' property that is a non-empty string`
    );
  }
}
