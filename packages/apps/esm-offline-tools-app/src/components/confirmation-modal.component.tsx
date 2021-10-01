import { ModalBody, ModalFooter, ModalHeader } from "carbon-components-react";
import React, { ReactNode } from "react";

export interface ConfirmationModalProps {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  closeModal: () => void;
  onConfirm?(): void;
  onCancel?(): void;
}

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
      <ModalHeader
        title={title}
        closeModal={closeModal}
        buttonOnClick={onCancel}
      />
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
