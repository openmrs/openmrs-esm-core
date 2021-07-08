import { renderExtension } from "@openmrs/esm-extensions";
import { createGlobalStore } from "@openmrs/esm-state";

interface ModalInstance {
  container?: HTMLElement;
  state: "NEW" | "MOUNTED" | "TO_BE_DELETED";
  onClose: () => void;
  cleanup?: Function;
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

function handleModalStateUpdate({ modalStack, modalContainer }: ModalState) {
  if (!modalContainer) return;

  if (modalStack.length) {
    // spin up the container if it was hidden previously
    if (!modalContainer.style.visibility) {
      addEventListener("keydown", handleEscKey);
      modalContainer.style.visibility = "unset";
    }

    modalStack.forEach((instance, index) => {
      switch (instance.state) {
        case "NEW":
          instance.container = document.createElement("div");
          instance.cleanup = renderExtension(
            instance.container,
            "",
            "",
            instance.extensionId,
            undefined,
            instance.props
          );
          instance.state = "MOUNTED";

          modalContainer.prepend(instance.container);
          instance.container.style.visibility = "unset";
          break;
        case "MOUNTED":
          if (instance.container) {
            instance.container.style.visibility = index ? "hidden" : "unset";
          }
          break;

        case "TO_BE_DELETED":
          instance.onClose();
          instance.container?.remove();
          setTimeout(() => {
            modalStore.setState({
              modalContainer,
              modalStack: modalStack.filter((x) => x !== instance),
            });
          }, 0);
          return;
      }
    });
  } else {
    modalContainer.style.removeProperty("visibility");
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

function handleEscKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    const state = modalStore.getState();
    modalStore.setState({
      ...state,
      modalStack: state.modalStack.map((instance, i) =>
        i === 0 ? { ...instance, state: "TO_BE_DELETED" } : instance
      ),
    });
  }
}

/**
 *
 * @param extensionId
 * @param props
 * @param onClose
 * @returns
 */
export function showModal(
  extensionId: string,
  props: Record<string, any> = {},
  onClose: () => void = () => {}
) {
  const instance: ModalInstance = {
    state: "NEW",
    onClose,
    extensionId,
    props,
  };

  const state = modalStore.getState();
  modalStore.setState({
    ...state,
    modalStack: [instance, ...state.modalStack],
  });

  return () => {
    const state = modalStore.getState();
    modalStore.setState({
      ...state,
      modalStack: state.modalStack.map((x) =>
        x.onClose === instance.onClose ? { ...x, state: "TO_BE_DELETED" } : x
      ),
    });
  };
}

globalThis.showModal = showModal;
globalThis.modalStore = modalStore;
