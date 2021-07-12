import { createGlobalStore } from "@openmrs/esm-state";

interface ToastState {
  toasts: Array<ToastNotificationMeta>;
}

const toastStore = createGlobalStore<ToastState>("globalToastState", {
  toasts: [],
});

export function subscribeToasts(handle: (state: ToastState) => void) {
  handle(toastStore.getState());
  return toastStore.subscribe(handle);
}

export function removeToastFromStore(toastId: number) {
  const state = toastStore.getState();
  toastStore.setState({
    ...state,
    toasts: state.toasts.filter((n) => n.id !== toastId),
  });
}

export function addToastToStore(toast: ToastNotificationMeta) {
  const state = toastStore.getState();
  toastStore.setState({
    ...state,
    toasts: [...state.toasts, toast],
  });
}

export interface ToastDescriptor {
  description: React.ReactNode;
  kind?: ToastType;
  critical?: boolean;
  title?: string;
  millis?: number;
}

export interface ToastNotificationMeta extends ToastDescriptor {
  id: number;
}

export type ToastType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";
