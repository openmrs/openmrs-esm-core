import React, { type ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import styles from './change-password-modal.scss';
import { Form, PasswordInput } from '@carbon/react';
import { changeUserPassword } from './change-password.resource';

interface ChangePasswordModalProps {
  close(): void;
}

export default function ChangeLanguageModal({ close }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [invalid, setInvalid] = useState(false);
  const [invalidText, setInvalidText] = useState<string>();

  const handleSubmit = useCallback(() => {
    setIsChangingPassword(true);
    if (!newPassword && newPassword === confirmPassword) {
      changeUserPassword(oldPassword, newPassword);
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
            <PasswordInput
              onChange={(event: ChangeEvent<HTMLInputElement>) => setOldPassword(event.target.value)}
              labelText={t('oldPassword', 'Old Password')}
            />
            <PasswordInput
              onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
              labelText={t('newPassword', 'New Password')}
              invalid={invalid}
              invalidText={invalidText}
            />
            <PasswordInput
              onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
              labelText={t('confirmPassword', 'Confirm New Password')}
              invalid={invalid}
              invalidText={invalidText}
            />
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
