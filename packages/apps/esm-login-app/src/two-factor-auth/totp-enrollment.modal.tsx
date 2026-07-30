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
  Link,
} from '@carbon/react';
import { openmrsFetch, refetchCurrentUser, showSnackbar, OpenmrsFetchError } from '@openmrs/esm-framework';
import styles from './totp-enrollment.modal.scss';

interface TotpEnrollmentProps {
  close(): void;
}

const TotpEnrollment: React.FC<TotpEnrollmentProps> = ({ close }) => {
  const { t } = useTranslation();
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const [submittingVerificationCode, setSubmittingVerificationCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [secret, setSecret] = useState('');
  const formattedSecret = secret.match(/.{1,4}/g)?.join(' ') || secret;

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
        let errorMessage = t('totpVerificationFailed', 'We could not verify that code. Please try again.');
        if (
          error instanceof OpenmrsFetchError &&
          typeof error.responseBody === 'object' &&
          error.responseBody !== null
        ) {
          const body = error.responseBody as { error?: { translatedMessage?: string } };
          const translatedMessage = body.error?.translatedMessage;

          if (translatedMessage) {
            errorMessage = translatedMessage;
          }
        }
        setErrorMessage(errorMessage);
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
        <div className={styles.twoColumnLayout}>
          <div className={styles.leftColumn}>
            <p className={styles.banner}>
              {t(
                'useAuthenticatorApp',
                'Your authenticator app will generate a new 6-digit code every 30 seconds. You will be asked for one after your password each time you sign in.',
              )}
            </p>
            <div className={styles.instructionList}>
              <div className={styles.instructionItem}>
                <span className={styles.stepNumber}>1</span>
                <div className={styles.stepText}>
                  <div>
                    {t(
                      'installAppInstruction',
                      "Install an authenticator app if you don't have one — Google Authenticator, Microsoft Authenticator and Authy all work.",
                    )}
                  </div>
                  <div>
                    <Link
                      href="https://openmrs.atlassian.net/wiki/spaces/docs/pages/1236172803/Supported+Two-Factor+Authentication+Apps+and+Setup+Guide"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('whichApps', 'Which apps can I use?')}
                    </Link>
                  </div>
                </div>
              </div>

              <div className={styles.instructionItem}>
                <span className={styles.stepNumber}>2</span>
                <div className={styles.stepText}>
                  {t(
                    'addAccountInstruction',
                    'Add a new account in the app and scan the code on the right, or type the setup key manually.',
                  )}
                </div>
              </div>

              <div className={styles.instructionItem}>
                <span className={styles.stepNumber}>3</span>
                <div className={styles.stepText}>
                  {t('enterCodeInstruction', 'Enter the code the app shows to confirm the setting up.')}
                </div>
              </div>
            </div>
            <div className={styles.inputCode}>
              <TextInput
                id="verification-code"
                labelText={t('enterVerificationCode', 'Enter 6-digit code from your app')}
                helperText={t(
                  'codeExpiryWarning',
                  'Code expires after 30 seconds. If it is rejected, wait for the next one.',
                )}
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
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.qrContainer}>
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
              ) : qrCodeUri ? (
                <>
                  <img className={styles.qrImage} src={qrCodeUri} alt={t('scanQrCode', 'Scan the QR Code')} />
                  <div className={styles.manualSetupContainer}>
                    <p className={styles.cantScanText}>{t('cantScanQrCode', "Can't scan the QR code?")}</p>
                    <p className={styles.manualSetupLabel}>{t('manualSetupKey', 'Enter this setup key in your app')}</p>
                    <CodeSnippet type="single" className={styles.secretSnippet}>
                      {formattedSecret}
                    </CodeSnippet>
                  </div>
                </>
              ) : null}
            </div>
          </div>
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
            t('confirmAndEnable', 'Confirm and Enable authenticator app')
          )}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default TotpEnrollment;
