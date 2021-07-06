import { renderExtension } from "@openmrs/esm-extensions";

interface ModalInstance {
  container: HTMLElement;
  close: () => void;
  mounted: boolean;
}

let modalContainer: HTMLElement | null;
const modalStack: Array<ModalInstance> = [];

export function setupModalsContainer() {
  modalContainer = document.querySelector<HTMLElement>(
    ".omrs-modals-container"
  );
  if (modalContainer) {
    renderModals();
  }
}

function handleEscKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    modalStack[0]?.close();
  }
}

function renderModals() {
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
    const index = modalStack.findIndex((x) => x === instance);
    if (~index) {
      modalStack.splice(index, 1);
      renderModals();
    }
  };

  instance.close = () => {
    onClose();
    cleanup();
    instance.container?.remove();
    popFromStack();
  };

  modalStack.push(instance as ModalInstance);
  renderModals();

  return instance.close;
}
