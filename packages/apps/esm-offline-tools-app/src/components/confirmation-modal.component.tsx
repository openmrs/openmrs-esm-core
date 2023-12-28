import type { ReactNode } from 'react';
import React from 'react';
import { ModalBody, ModalFooter, ModalHeader } from '@carbon/react';

export interface ConfirmationModalProps {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  closeModal: () => void;
  onConfirm?(): void;
  onCancel?(): void;
}

/**
 * A confirmation modal provided globally by the offline tools.
 * Used by extensions providing offline tools UI elements.
 *
 * The modal can be configured with the above props.
 * Several design aspects (e.g. the color and the general content) are preconfigured to match the
 * design linked below.
 *
 * Designs: https://zpl.io/2GPjjjW
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  confirmText,
  cancelText,
  children,
  closeModal,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <ModalHeader title={title} closeModal={closeModal} buttonOnClick={onCancel} />
      <ModalBody>{children}</ModalBody>
      <ModalFooter
        danger
        primaryButtonText={confirmText}
        secondaryButtonText={cancelText}
        closeModal={closeModal}
        onRequestSubmit={() => {
          closeModal?.();
          onConfirm?.();
        }}
        onRequestClose={onCancel}
      />
    </>
  );
};

export default ConfirmationModal;
