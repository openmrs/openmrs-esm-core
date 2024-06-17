import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../help-popup.styles.scss';
import { ComposedModal, Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { Link } from '@carbon/react';
import { navigate } from '@openmrs/esm-framework';
export default function GenericModal({ isOpen, onClose, heading, label, content }) {
  const { t } = useTranslation();
  return (
    <>
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
              secondaryButtonText="Cancel"
            >
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>{heading}</div>{' '}
                <div className={styles.modalBody}>
                  <p className={styles.inputField}>{content}</p>{' '}
                </div>
                <div className={styles.modalFooter}>
                  <Button kind="primary" onClick={onClose} className={styles.modalButton}>
                    {t('home', 'Home')}
                  </Button>
                </div>
              </div>
            </ComposedModal>,
            document.body,
          )}
    </>
  );
}
