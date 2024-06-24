import React, { type ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, PasswordInput,  InlineLoading, InlineNotification, ModalBody, ModalFooter, ModalHeader, Stack } from '@carbon/react';
import styles from './change-password-modal.scss';
import { changeUserPassword } from './change-password.resource';
import { showSnackbar, type OpenmrsFetchError } from '@openmrs/esm-framework';

interface ChangePasswordModalProps {
  close(): () => void;
}

export default function ChangePasswordModal({ close }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [invalid, setInvalid] = useState(false);
  const [invalidText, setInvalidText] = useState<string>();
  const [showInline, setShowInline] = useState(false);
  const [backEndErrorMessage, setBackEndErrorMessage] = useState('');

  const handleSubmit = useCallback(() => {
    setIsChangingPassword(true);
    if (typeof newPassword === 'string' && !!newPassword.length && newPassword === confirmPassword) {
      changeUserPassword(oldPassword, newPassword)
        .then(() => {
          setIsChangingPassword(false);
          close();
          showSnackbar({
            title: t('passwordSuccessfullyChanged', 'Password successfully changed'),
            kind: 'success',
            isLowContrast: true,
          });
        })
        .catch((response: OpenmrsFetchError) => {
          setShowInline(true);
          setIsChangingPassword(false);
          if (typeof response.responseBody === 'object') {
            setBackEndErrorMessage(response.responseBody?.localizedMessage);
          }
        });
    } else {
      setIsChangingPassword(false);
      setInvalid(true);
      setInvalidText(t('passwordConfirmPasswordNotTheSame', 'New password and comfirm password are not the same'));
    }
  }, [oldPassword, newPassword, confirmPassword]);

  return (
    <>
      <ModalHeader closeModal={close} title={t('changePassword', 'Change password')} />
      <ModalBody>
        <div className={styles.languageOptionsContainer}>
          <Form>
            <Stack gap={5}>
              {showInline && (
                <InlineNotification
                  kind="error"
                  title={t('errorUpdatingPassword', 'Error updating password')}
                  subtitle={backEndErrorMessage}
                />
              )}
              <PasswordInput
                onChange={(event: ChangeEvent<HTMLInputElement>) => setOldPassword(event.target.value)}
                labelText={t('oldPassword', 'Old password')}
              />
              <PasswordInput
                onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
                labelText={t('newPassword', 'New password')}
                invalid={invalid}
                invalidText={invalidText}
              />
              <PasswordInput
                onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
                labelText={t('confirmPassword', 'Confirm new password')}
                invalid={invalid}
                invalidText={invalidText}
              />
            </Stack>
          </Form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button className={styles.submitButton} disabled={isChangingPassword} type="submit" onClick={handleSubmit}>
          {isChangingPassword ? (
            <InlineLoading description={t('changingLanguage', 'Changing password') + '...'} />
          ) : (
            <span>{t('change', 'Change')}</span>
          )}
        </Button>
      </ModalFooter>
    </>
  );
}
