/** @module @category UI */
import { renderExtension } from "@openmrs/esm-extensions";
import { createGlobalStore } from "@openmrs/esm-state";
import type { Parcel } from "single-spa";

type ModalInstanceState = "NEW" | "MOUNTED" | "TO_BE_DELETED";

interface ModalInstance {
  container?: HTMLElement;
  state: ModalInstanceState;
  onClose: () => void;
  parcel?: Parcel | null;
  extensionId: string;
  props: Record<string, any>;
}

interface ModalState {
  modalContainer: HTMLElement | null;
  modalStack: Array<ModalInstance>;
}

const modalStore = createGlobalStore<ModalState>("globalModalState", {
  modalContainer: null,
  modalStack: [],
});

function htmlToElement(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstChild as ChildNode;
}

function createModalFrame() {
  const closeButton = htmlToElement(
    `
  <button
    class="cds--modal-close"
    type="button">
    <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:#000000;}.cls-2{fill:none;}</style></defs><title>close</title><polygon class="cls-1" points="24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4"/><rect class="cls-2" width="32" height="32"/></svg>
  </button>`.trim()
  ) as HTMLButtonElement;

  closeButton.addEventListener("click", closeHighestInstance);
  const outer = document.createElement("div");
  outer.className = "cds--modal-container";
  const contentContainer = document.createElement("div");

  outer.append(closeButton);
  outer.append(contentContainer);

  return { outer, contentContainer };
}

const original = window.getComputedStyle(document.body).overflow;

function handleModalStateUpdate({ modalStack, modalContainer }: ModalState) {
  if (!modalContainer) return;

  if (modalStack.length) {
    // spin up the container if it was hidden previously
    if (!modalContainer.style.visibility) {
      addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
      modalContainer.style.visibility = "unset";
    }

    modalStack.forEach((instance, index) => {
      switch (instance.state) {
        case "NEW":
          const { outer, contentContainer } = createModalFrame();
          instance.container = outer;
          renderExtension(
            contentContainer,
            "",
            "",
            instance.extensionId,
            undefined,
            instance.props
          ).then((parcel) => {
            instance.parcel = parcel;
            instance.state = "MOUNTED";
            modalContainer.prepend(outer);
            outer.style.visibility = "unset";
          });
          break;

        case "MOUNTED":
          if (instance.container) {
            instance.container.style.visibility = index ? "hidden" : "unset";
          }
          break;

        case "TO_BE_DELETED":
          instance.onClose();
          instance.parcel?.unmount?.();
          instance.container?.remove();
          setTimeout(() => {
            modalStore.setState({
              modalContainer,
              modalStack: modalStack.filter((x) => x !== instance),
            });
          }, 0);
          break;
      }
    });
  } else {
    modalContainer.style.removeProperty("visibility");
    document.body.style.overflow = original;
    removeEventListener("keydown", handleEscKey);
  }
}

export function renderModals(modalContainer: HTMLElement | null) {
  if (modalContainer) {
    modalStore.subscribe(handleModalStateUpdate);

    modalStore.setState({
      ...modalStore.getState(),
      modalContainer,
    });
  }
}
function openInstance(instance: ModalInstance) {
  const state = modalStore.getState();
  const modalStack = [instance, ...state.modalStack];

  modalStore.setState({
    ...state,
    modalStack,
  });
}

function closeInstance(instance: ModalInstance) {
  const state = modalStore.getState();
  const modalStack = state.modalStack.map(
    (x): ModalInstance =>
      x === instance ? { ...x, state: "TO_BE_DELETED" } : x
  );
  modalStore.setState({
    ...state,
    modalStack,
  });
}

function closeHighestInstance() {
  const state = modalStore.getState();
  const [top] = state.modalStack;

  if (top) {
    closeInstance(top);
  }
}

function handleEscKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeHighestInstance();
  }
}

/**
 * Shows the provided extension component in a modal dialog.
 * @param extensionId The id of the extension to show.
 * @param props The optional props to provide to the extension.
 * @param onClose The optional notification to receive when the modal is closed.
 * @returns The dispose function to force closing the modal dialog.
 */
export function showModal(
  extensionId: string,
  props: Record<string, any> = {},
  onClose: () => void = () => {}
) {
  const close = () => {
    const state = modalStore.getState();
    const item = state.modalStack.find((m) => m.onClose === onClose);

    if (item) {
      closeInstance(item);
    }
  };

  openInstance({
    state: "NEW",
    onClose,
    extensionId,
    props: {
      extensionId,
      close,
      ...props,
    },
  });

  return close;
}
