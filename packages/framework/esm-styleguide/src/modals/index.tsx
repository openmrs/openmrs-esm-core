/** @module @category UI */
import { mountRootParcel, type Parcel } from 'single-spa';
import { createGlobalStore } from '@openmrs/esm-state';
import { getModalRegistration } from '@openmrs/esm-extensions';
import { reportError } from '@openmrs/esm-error-handling';

type ModalInstanceState = 'NEW' | 'MOUNTED' | 'TO_BE_DELETED';
type ModalSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ModalProps {
  size?: ModalSize;
  [key: string]: unknown;
}

interface ModalInstance {
  container?: HTMLElement;
  state: ModalInstanceState;
  onClose: () => void;
  parcel?: Parcel | null;
  modalName: string;
  props: ModalProps;
}

interface ModalState {
  modalContainer: HTMLElement | null;
  modalStack: Array<ModalInstance>;
}

const modalStore = createGlobalStore<ModalState>('modalState', {
  modalContainer: null,
  modalStack: [],
});

function createModalFrame({ size }: { size: ModalSize }) {
  const modalFrame = document.createElement('div');
  modalFrame.className = `cds--modal-container cds--modal-container--${size}`;
  modalFrame.setAttribute('role', 'dialog');
  modalFrame.setAttribute('tabindex', '-1');
  modalFrame.setAttribute('aria-modal', 'true');

  return modalFrame;
}

let parcelCount = 0;

/**
 * Mounts the named modal into the specified DOM element
 */
async function renderModalIntoDOM(
  domElement: HTMLElement,
  modalName: string,
  additionalProps: Record<string, unknown> = {},
): Promise<Parcel | null> {
  const modalRegistration = getModalRegistration(modalName);
  let parcel: Parcel | null = null;

  if (domElement) {
    if (!modalRegistration) {
      throw Error(`No modal named '${modalName}' has been registered.`);
    }

    const { load } = modalRegistration;

    const lifecycle = await load();
    const id = parcelCount++;
    parcel = mountRootParcel(
      {
        ...lifecycle,
        name: `${modalName}-${id}`,
      },
      {
        ...additionalProps,
        domElement,
      },
    );
  } else {
    reportError(`Failed to launch modal. Please notify your administrator. Modal name: ${modalName}`);
  }

  return parcel;
}

const original = window.getComputedStyle(document.body).overflow;

function handleModalStateUpdate({ modalStack, modalContainer }: ModalState) {
  if (!modalContainer) {
    return;
  }

  if (modalStack.length) {
    // ensure the container is visible
    if (!modalContainer.style.visibility) {
      addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
      modalContainer.style.visibility = 'unset';
    }

    modalStack.forEach((instance, index) => {
      switch (instance.state) {
        case 'NEW': {
          const modalFrame = createModalFrame({ size: instance.props?.size ?? 'md' });
          instance.container = modalFrame;
          renderModalIntoDOM(modalFrame, instance.modalName, instance.props).then((parcel) => {
            instance.parcel = parcel;
            instance.state = 'MOUNTED';
            modalContainer.prepend(modalFrame);
            modalFrame.style.visibility = 'unset';
          });
          break;
        }

        case 'MOUNTED':
          if (instance.container) {
            instance.container.style.visibility = index ? 'hidden' : 'unset';
          }
          break;

        case 'TO_BE_DELETED':
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
    modalContainer.style.removeProperty('visibility');
    document.body.style.overflow = original;
    removeEventListener('keydown', handleEscKey);
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
    (x): ModalInstance => (x === instance ? { ...x, state: 'TO_BE_DELETED' } : x),
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
  if (e.key === 'Escape') {
    closeHighestInstance();
  }
}

/**
 * @internal
 * Sets up the modals system. Should be called in the app shell during initialization.
 */
export function setupModals(modalContainer: HTMLElement | null) {
  modalStore.subscribe(handleModalStateUpdate);

  modalStore.setState({
    ...modalStore.getState(),
    modalContainer,
  });
}

/**
 * Shows a modal dialog.
 *
 * The modal must have been registered by name. This should be done in the `routes.json` file of the
 * app that defines the modal. Note that both the `<ModalHeader>` and `<ModalBody>` should be at the
 * top level of the modal component (wrapped in a React.Fragment), or else the content of the modal
 * body might not vertical-scroll properly.
 *
 * @param modalName The name of the modal to show.
 * @param props The optional props to provide to the modal.
 * @param onClose The optional callback to call when the modal is closed.
 * @returns The dispose function to force closing the modal dialog.
 */
export function showModal(modalName: string, props: ModalProps = {}, onClose: () => void = () => {}) {
  const close = () => {
    const state = modalStore.getState();
    const item = state.modalStack.find((m) => m.onClose === onClose);

    if (item) {
      closeInstance(item);
    }
  };

  const modalRegistration = getModalRegistration(modalName);
  if (!modalRegistration) {
    reportError(`Failed to launch modal. Please notify your administrator. Modal name: "${modalName}"`);
  } else {
    openInstance({
      state: 'NEW',
      onClose,
      modalName,
      props: {
        close,
        ...props,
      },
    });
  }

  return close;
}
