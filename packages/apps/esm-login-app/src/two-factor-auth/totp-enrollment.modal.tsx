import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Form,
  CodeSnippet,
  ActionableNotification,
} from '@carbon/react';
import { openmrsFetch, refetchCurrentUser, showSnackbar } from '@openmrs/esm-framework';
import styles from './totp-enrollment.modal.scss';

interface TotpEnrollmentProps {
  close(): void;
}

interface OpenmrsFetchError extends Error {
  responseBody: { error: { translatedMessage: string } };
}

const TotpEnrollment: React.FC<TotpEnrollmentProps> = ({ close }) => {
  const { t } = useTranslation();
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const [submittingVerificationCode, setSubmittingVerificationCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const initiateEnrollment = useCallback(async () => {
    try {
      setLoadingEnrollment(true);
      setErrorMessage('');

      const response = await openmrsFetch('/ws/rest/v1/auth/totp/enrollment', {
        method: 'POST',
      });

      if (response.data) {
        setQrCodeUri(response.data.qrCodeUri || '');
        setSecret(response.data.secret || '');
      }
    } catch (error) {
      console.error('Failed to initiate TOTP enrollment:', error);
      setErrorMessage(t('failToInitiate', 'Failed to initiate TOTP enrollment. Please try again.'));
    } finally {
      setLoadingEnrollment(false);
    }
  }, [t]);

  useEffect(() => {
    initiateEnrollment();
  }, [initiateEnrollment]);

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

        await openmrsFetch('/ws/rest/v1/auth/totp/enrollment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            code: verificationCode,
          },
        });

        showSnackbar({
          title: t('totpEnabledSuccessfully', 'Two-Factor Authentication Enabled'),
          subtitle: t('totpEnabledSuccessfullyMessage', 'Your account is now protected with a TOTP authenticator app.'),
          kind: 'success',
        });
        close();

        refetchCurrentUser().catch((error) => {
          console.warn('Failed to refresh current user after TOTP enrollment:', error);
        });
      } catch (error: unknown) {
        const fetchError = error as OpenmrsFetchError;

        setErrorMessage(
          fetchError.responseBody.error.translatedMessage ??
            t('totpVerificationFailed', 'We could not verify that code. Please try again.'),
        );
      } finally {
        setSubmittingVerificationCode(false);
      }
    },
    [verificationCode, close],
  );

  return (
    <Form onSubmit={handleVerificationCodeSubmit}>
      <ModalHeader closeModal={close} title={t('setupAuthenticatorApp', 'Set up Authenticator App')} />
      <ModalBody>
        <div>
          <p className={styles.banner}>
            {t(
              'useAuthenticatorApp',
              'Use a phone app like Microsoft Authenticator, Google Authenticator or Authy etc to get two factor authentication codes.',
            )}
          </p>
          <h4 className={styles.scanInstruction}>
            {showSecret
              ? t('manualKeyInstruction', 'Enter this manual setup key into your authenticator app')
              : t('scanQrCodeInstruction', 'Scan the QR Code using an authenticator app from your phone')}
          </h4>
          {loadingEnrollment ? (
            <div className={styles.center}>
              <InlineLoading description={t('generatingQrCode', 'Generating QR Code...')} />
            </div>
          ) : !qrCodeUri && errorMessage ? (
            <ActionableNotification
              kind="error"
              inline
              hideCloseButton
              title={errorMessage}
              actionButtonLabel={t('tryAgain', 'Try Again')}
              onActionButtonClick={initiateEnrollment}
            />
          ) : (
            <>
              <div>
                {showSecret ? (
                  <div className={styles.manualSetupContainer}>
                    <p className={styles.manualSetupLabel}>{t('manualSetupKey', 'Set up the key manually:')}</p>
                    <CodeSnippet type="single" className={styles.secretSnippet}>
                      {secret}
                    </CodeSnippet>
                    <div className={styles.center}>
                      <Button
                        kind="ghost"
                        size="sm"
                        onClick={() => setShowSecret(false)}
                        className={styles.toggleButton}
                      >
                        {t('scanQrCodeInstead', 'Scan QR Code Instead')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.qrContainer}>
                    {qrCodeUri && (
                      <>
                        <img className={styles.qrImage} src={qrCodeUri} alt={t('scanQrCode', 'Scan the QR Code')} />
                        <Button
                          kind="ghost"
                          size="sm"
                          onClick={() => setShowSecret(true)}
                          className={styles.toggleButton}
                        >
                          {t('cantScanQrCode', "Can't scan the QR code?")}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.inputCode}>
                <TextInput
                  id="verification-code"
                  labelText={t('enterVerificationCode', 'Enter Verification Code')}
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  invalidText={errorMessage}
                  invalid={!!errorMessage}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={submittingVerificationCode}
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button
          type="submit"
          disabled={loadingEnrollment || submittingVerificationCode || verificationCode.length !== 6}
        >
          {submittingVerificationCode ? (
            <InlineLoading description={t('verifying', 'Verifying...')} />
          ) : (
            t('enable2fa', 'Enable 2FA')
          )}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default TotpEnrollment;
