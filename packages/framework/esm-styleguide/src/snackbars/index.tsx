/** @module @category UI */
import React from "react";
import { createRoot } from "react-dom/client";
import { Subject } from "rxjs";

import { SnackBarDescriptor, SnackBarMeta } from "./snack-bar.component";
import ActiveSnackBars from "./active-snack-bar.component";

const snackBarsSubject = new Subject<SnackBarMeta>();
let snackBarId = 0;

/**
 * Starts a rendering host for snack bar notifications. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the snack bar notifications.
 */
export function renderSnackBars(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActiveSnackBars subject={snackBarsSubject} />);
  }
}

function isNotEmpty(title: string) {
  return typeof title === "string" ? title.trim().length > 0 : false;
}

/**
 * Displays a snack bar notification in the UI.
 * @param snackbar The description of the snack bar to display.
 */
export function showSnackBar(snackBar: SnackBarDescriptor) {
  if (snackBar && isNotEmpty(snackBar.title)) {
    setTimeout(() => {
      snackBarsSubject.next({
        ...snackBar,
        id: snackBarId++,
      });
    }, 0);
  } else {
    console.error(
      `showSnackBar must be called with an object having a 'title' property that is a non-empty string`
    );
  }
}
