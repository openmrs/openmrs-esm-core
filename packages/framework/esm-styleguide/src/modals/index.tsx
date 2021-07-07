import { renderExtension } from "@openmrs/esm-extensions";
import { createGlobalStore } from "@openmrs/esm-state";

interface ModalInstance {
  container: HTMLElement;
  close: () => void;
  mounted: boolean;
}

interface ModalState {
  modalContainer: HTMLElement | null;
  modalStack: Array<ModalInstance>;
}

const modalStore = createGlobalStore<ModalState>("globalModalState", {
  modalContainer: null,
  modalStack: [],
});

export function renderModals(modalContainer: HTMLElement | null) {
  if (modalContainer) {
    // handling any modal state change here, updating the container
    modalStore.subscribe(({ modalStack, modalContainer }) => {
      if (!modalContainer) return;

      if (modalStack.length) {
        if (modalContainer.style.visibility === "hidden") {
          addEventListener("keydown", handleEscKey);
          modalContainer.style.visibility = "";
        }
        modalStack.forEach((instance, index) => {
          instance.container.style.visibility = index ? "hidden" : "";
          if (!instance.mounted) {
            modalContainer?.append(instance.container);
          }
        });
      } else {
        modalContainer.style.visibility = "hidden";
        removeEventListener("keydown", handleEscKey);
      }
    });

    modalStore.setState((s) => ({
      ...s,
      modalContainer,
    }));
  }
}

function handleEscKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    modalStore.getState().modalStack[0]?.close();
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
  const container = document.createElement("div");
  const cleanup = renderExtension(
    container,
    "",
    "",
    extensionId,
    undefined,
    props
  );

  const instance: Partial<ModalInstance> = {
    container,
    mounted: false,
  };

  const popFromStack = () => {
    modalStore.setState((state: ModalState) => ({
      ...state,
      modalStack: state.modalStack.filter((x) => x !== instance),
    }));
  };

  instance.close = () => {
    onClose();
    cleanup();
    instance.container?.remove();
    popFromStack();
  };

  modalStore.setState((state: ModalState) => ({
    ...state,
    modalStack: [instance, ...state.modalStack],
  }));

  return instance.close;
}
