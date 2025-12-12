/** @module @category UI */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Subject } from 'rxjs';

import type { SnackbarDescriptor, SnackbarMeta } from './snackbar.component';
import ActiveSnackbars from './active-snackbar.component';

export { type SnackbarDescriptor, type SnackbarType, type SnackbarMeta } from './snackbar.component';

const snackbarsSubject = new Subject<SnackbarMeta>();
let snackbarId = 0;

/**
 * Starts a rendering host for snack bar notifications. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the snack bar notifications.
 */
export function renderSnackbars(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActiveSnackbars subject={snackbarsSubject} />);
  }
}

function isNotEmpty(title: string) {
  return typeof title === 'string' ? title.trim().length > 0 : false;
}

/**
 * Displays a snack bar notification in the UI.
 * @param snackbar The description of the snack bar to display.
 */
export function showSnackbar(snackbar: SnackbarDescriptor) {
  if (snackbar && isNotEmpty(snackbar.title)) {
    setTimeout(() => {
      snackbarsSubject.next({
        ...snackbar,
        id: snackbarId++,
      });
    }, 0);
  } else {
    console.error(`showSnackbar must be called with an object having a 'title' property that is a non-empty string`);
  }
}
