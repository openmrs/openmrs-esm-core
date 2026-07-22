import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  InlineLoading,
  InlineNotification,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Form,
} from '@carbon/react';
import { openmrsFetch, refetchCurrentUser, showSnackbar } from '@openmrs/esm-framework';
import styles from './totp-enrollment.modal.scss';

interface TotpEnrollmentProps {
  close(): () => void;
}

const TotpEnrollment: React.FC<TotpEnrollmentProps> = ({ close }) => {
  const { t } = useTranslation();
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const [submittingVerificationCode, setSubmittingVerificationCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    const initiateEnrollment = async () => {
      try {
        setLoadingEnrollment(true);
        setErrorMessage('');

        const response = await openmrsFetch('/ws/rest/v1/auth/totp/enrollment', {
          method: 'POST',
        });

        if (active && response.data) {
          setQrCodeUri(response.data.qrCodeUri || '');
        }
      } catch (error) {
        console.error('Failed to initiate TOTP enrollment:', error);
        if (active) {
          setErrorMessage('Failed to initiate TOTP enrollment. Please try again.');
        }
      } finally {
        if (active) {
          setLoadingEnrollment(false);
        }
      }
    };

    initiateEnrollment();

    return () => {
      active = false;
    };
  }, []);

  const handleVerificationCodeSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (verificationCode.length !== 6) {
        setErrorMessage('Verification code must be 6 digits.');
        return;
      }

      try {
        setSubmittingVerificationCode(true);
        setErrorMessage('');

        const response = await openmrsFetch('/ws/rest/v1/auth/totp/enrollment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            code: verificationCode,
          },
        });

        if (response.data && response.data.isValidCode) {
          await refetchCurrentUser();

          showSnackbar({
            title: t('totpEnabledSuccessfully', 'Two-Factor Authentication Enabled'),
            subtitle: t(
              'totpEnabledSuccessfullyMessage',
              'Your account is now protected with a TOTP authenticator app.',
            ),
            kind: 'success',
          });
          close();
        } else {
          setErrorMessage('Invalid verification code. Please try again.');
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An error occurred while verifying the code. Please try again.');
        }
      } finally {
        setSubmittingVerificationCode(false);
      }
    },
    [verificationCode, close],
  );

  return (
    <Form onSubmit={handleVerificationCodeSubmit}>
      <ModalHeader closeModal={close} title={t('setupAuthenticatorApp', 'Setup Authenticator App')} />
      <ModalBody>
        <div>
          <p className={styles.banner}>
            {t(
              'useAuthenticatorApp',
              'Use a phone app like Microsoft Authenticator, Google Authenticator or Authy etc to get two factor authentication codes.',
            )}
          </p>
          <h4 className={styles.scanInstruction}>Scan the QR Code using an authenticator app from your phone</h4>
          {loadingEnrollment ? (
            <div className={styles.center}>
              <InlineLoading description={t('generatingQrCode', 'Generating QR Code...')} />
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className={styles.errorMessage}>
                  <InlineNotification kind="error" subtitle={errorMessage} hideCloseButton />
                </div>
              )}
              <div className={styles.qrContainer}>
                {qrCodeUri && (
                  <img className={styles.qrImage} src={qrCodeUri} alt={t('scanQrCode', 'Scan the QR Code')} />
                )}
              </div>
              <div className={styles.inputCode}>
                <TextInput
                  id="verification-code"
                  ref={codeInputRef}
                  labelText={t('enterVerificationCode', 'Enter Verification Code')}
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={submittingVerificationCode}
                  autoComplete="off"
                  required
                />
              </div>
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loadingEnrollment || submittingVerificationCode || verificationCode.length !== 6}
        >
          {submittingVerificationCode ? <InlineLoading description={t('verifying', 'Verifying...')} /> : 'Enable 2FA'}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default TotpEnrollment;
