import React, { type ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import styles from './change-password-modal.scss';
import { Form, PasswordInput } from '@carbon/react';

interface ChangePasswordModalProps {
  close(): void;
}

export default function ChangeLanguageModal({ close }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();

  const handleSubmit = useCallback(() => {
    setIsChangingPassword(true);
  }, []);

  return (
    <>
      <ModalHeader closeModal={close} title={t('changePassword', 'Change password')} />
      <ModalBody>
        <div className={styles.languageOptionsContainer}>
          <Form>
            <PasswordInput
              onChange={(event: ChangeEvent) => setOldPassword(event.target.nodeValue)}
              labelText={t('oldPassword', 'Old Password')}
            />
            <PasswordInput
              onChange={(event: ChangeEvent) => setNewPassword(event.target.nodeValue)}
              labelText={t('newPassword', 'New Password')}
            />
            <PasswordInput
              onChange={(event: ChangeEvent) => setConfirmPassword(event.target.nodeValue)}
              labelText={t('confirmPassword', 'Confirm New Password')}
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
