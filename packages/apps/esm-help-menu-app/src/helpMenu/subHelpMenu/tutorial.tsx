import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../help-popup.styles.scss';
import { ComposedModal, Button } from '@carbon/react';
export default function GenericModal({ isOpen, onClose, heading, label, content }) {
  return (
    <>
      {' '}
      {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
            <ComposedModal
              open={isOpen}
              onRequestClose={onClose}
              hasScrollingContent
              modalHeading={heading}
              modalLabel={label}
              primaryButtonText="Close"
              secondaryButtonText=""
            >
              {' '}
              <div className={styles.modalContent}>
                {' '}
                <div className={styles.modalHeader}>{heading}</div>{' '}
                <div className={styles.modalBody}>
                  {' '}
                  <p className={styles.inputField}>{content}</p>{' '}
                </div>{' '}
                <div className={styles.modalFooter}>
                  {' '}
                  <Button kind="primary" onClick={onClose} className={styles.modalButton}>
                    {' '}
                    Walk Through{' '}
                  </Button>{' '}
                </div>{' '}
              </div>{' '}
            </ComposedModal>,
            document.body,
          )}{' '}
    </>
  );
}
