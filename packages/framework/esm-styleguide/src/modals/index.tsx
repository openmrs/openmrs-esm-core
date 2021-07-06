import { renderExtension } from "@openmrs/esm-extensions";

interface ModalInstance {
  container: HTMLElement;
  close: () => void;
  mounted: boolean;
}

let modalContainer: HTMLElement | null;
const modalStack: Array<ModalInstance> = [];

export function setupModalsContainer() {
  if (modalContainer) {
    modalContainer = document.querySelector<HTMLElement>(
      ".omrs-modals-container"
    );
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
      addEventListener("keypress", handleEscKey);
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
    removeEventListener("keypress", handleEscKey);
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
  props: Record<string, any>,
  onClose: () => void
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

  return instance.close;
}

// const Modal = ({ close, ...props }) => <div></div>;

// const Test = () => {
//   const open = React.useCallback(() => {
//     showModal("my-mega-modal-3000", props);
//   }, []);
//   return <div></div>;
// };

// // index.ts

// [
//   {
//     id: "my-mega-modal-3000",
//   },
// ];
