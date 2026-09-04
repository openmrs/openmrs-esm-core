/** @module @category UI */
import { type Parcel } from 'single-spa';
import { createGlobalStore } from '@openmrs/esm-state';
import { getModalRegistration, renderParcel } from '@openmrs/esm-extensions';
import { reportError } from '@openmrs/esm-error-handling';

type ModalInstanceState = 'NEW' | 'MOUNTING' | 'MOUNTED' | 'TO_BE_DELETED' | 'DELETED';
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
    parcel = await renderParcel(
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

function isClosing(instance: ModalInstance) {
  return instance.state === 'TO_BE_DELETED' || instance.state === 'DELETED';
}

function unmountModalParcel(modalName: string, parcel: Parcel | null | undefined) {
  if (!parcel?.unmount) {
    return;
  }

  // A failed unmount rejects `unmountPromise` as well as the promise the call returns. They are
  // separate promises, so leaving either without a handler is an unhandled rejection, but one
  // failure is worth reporting only once.
  parcel.unmountPromise?.catch(() => {});
  parcel.unmount().catch((err) => {
    console.error(`The modal '${modalName}' failed to unmount`, err);
  });
}

/**
 * The modal the user is looking at: the frontmost one that isn't on its way out. Modals being torn
 * down are skipped rather than counted, since their frames are already gone — counting them would
 * leave the modal underneath hidden behind nothing until they finally left the stack.
 */
function frontmostModal(modalStack: Array<ModalInstance>) {
  return modalStack.find((instance) => !isClosing(instance));
}

/**
 * Only the frontmost modal is shown; the ones it was opened over stay in the DOM behind it. Applied
 * both as the stack changes and as a frame is inserted, since a frame inserted after the last
 * change to the stack would otherwise never be told.
 */
function applyModalVisibility(instance: ModalInstance, isFrontmost: boolean) {
  if (instance.container) {
    instance.container.style.visibility = isFrontmost ? 'unset' : 'hidden';
  }
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

    // Stable across the pass below: the only states it changes are `NEW` to `MOUNTING` and
    // `TO_BE_DELETED` to `DELETED`, neither of which moves a modal in or out of the running.
    const frontmost = frontmostModal(modalStack);

    modalStack.forEach((instance) => {
      switch (instance.state) {
        case 'NEW': {
          const modalFrame = createModalFrame({ size: instance.props?.size ?? 'md' });
          instance.container = modalFrame;
          instance.state = 'MOUNTING';

          renderModalIntoDOM(modalFrame, instance.modalName, instance.props).then(
            (parcel) => {
              // Release the parcel if it's been closed while mounting
              if (isClosing(instance)) {
                unmountModalParcel(instance.modalName, parcel);
                return;
              }

              if (!parcel) {
                // `renderModalIntoDOM` only returns without one when it had nowhere to render it,
                // which it has already reported.
                closeInstance(instance);
                return;
              }

              instance.parcel = parcel;
              modalContainer.prepend(modalFrame);
              // The stack decides which modal is frontmost, not the DOM order this prepend just
              // established: another modal opened while this one loaded belongs on top of it.
              applyModalVisibility(instance, frontmostModal(modalStore.getState().modalStack) === instance);

              // The parcel is handed back before it has mounted, so this is where the modal is
              // really on screen.
              parcel.mountPromise.then(
                () => {
                  if (!isClosing(instance)) {
                    instance.state = 'MOUNTED';
                  }
                },
                (err) => {
                  reportError(err);
                  instance.parcel = null;
                  closeInstance(instance);
                },
              );
            },
            (err) => {
              // Nothing is chained to this, so without a handler a modal that fails to load is
              // only an unhandled rejection — and its instance holds the overlay open over a
              // page the user can no longer reach.
              reportError(err);
              closeInstance(instance);
            },
          );
          break;
        }

        // A frame is inserted as soon as the parcel exists, which is before it has mounted, so a
        // modal opened over one still mounting has to hide it just the same.
        case 'MOUNTING':
        case 'MOUNTED':
          applyModalVisibility(instance, instance === frontmost);
          break;

        case 'TO_BE_DELETED':
          instance.state = 'DELETED';
          instance.onClose();
          unmountModalParcel(instance.modalName, instance.parcel);
          instance.container?.remove();
          setTimeout(() => {
            // Read now rather than closed over: modals opened since this was scheduled are in the
            // store's stack but not in the one this pass saw, and would be dropped with it.
            const current = modalStore.getState();

            modalStore.setState({
              ...current,
              modalStack: current.modalStack.filter((x) => x !== instance),
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
  if (isClosing(instance)) {
    return;
  }

  // Mutated rather than replaced by a copy as an in-flight mount will close over this property
  instance.state = 'TO_BE_DELETED';

  const state = modalStore.getState();

  modalStore.setState({
    ...state,
    modalStack: [...state.modalStack],
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
