import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { Button, Form, PasswordInput, InlineLoading, ModalBody, ModalFooter, ModalHeader, Stack } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { changeUserPassword } from './change-password.resource';
import styles from './change-password-modal.scss';

interface ChangePasswordModalProps {
  close(): () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ close }) => {
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const oldPasswordValidation = z.string({
    required_error: t('oldPasswordRequired', 'Old password is required'),
  });

  const newPasswordValidation = z.string({
    required_error: t('newPasswordRequired', 'New password is required'),
  });

  const passwordConfirmationValidation = z.string({
    required_error: t('passwordConfirmationRequired', 'Password confirmation is required'),
  });

  const changePasswordFormSchema = z
    .object({
      oldPassword: oldPasswordValidation,
      newPassword: newPasswordValidation,
      passwordConfirmation: passwordConfirmationValidation,
    })
    .refine((data) => data.newPassword === data.passwordConfirmation, {
      message: t('passwordsDoNotMatch', 'Passwords do not match'),
      path: ['passwordConfirmation'],
    });

  const methods = useForm<z.infer<typeof changePasswordFormSchema>>({
    mode: 'all',
    resolver: zodResolver(changePasswordFormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof changePasswordFormSchema>> = useCallback((data) => {
    setIsChangingPassword(true);

    const { oldPassword, newPassword } = data;

    changeUserPassword(oldPassword, newPassword)
      .then(() => {
        close();

        showSnackbar({
          title: t('passwordChangedSuccessfully', 'Password changed successfully'),
          kind: 'success',
        });
      })
      .catch((error) => {
        showSnackbar({
          kind: 'error',
          subtitle: error?.message,
          title: t('errorChangingPassword', 'Error changing password'),
        });
      })
      .finally(() => {
        setIsChangingPassword(false);
      });
  }, []);

  const onError = () => setIsChangingPassword(false);

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit, onError)}>
        <ModalHeader closeModal={close} title={t('changePassword', 'Change password')} />
        <ModalBody>
          <Stack gap={5} className={styles.languageOptionsContainer}>
            <Controller
              name="oldPassword"
              control={methods.control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <PasswordInput
                  id="oldPassword"
                  invalid={!!error}
                  invalidText={error?.message}
                  labelText={t('oldPassword', 'Old password')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={methods.control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <PasswordInput
                  id="newPassword"
                  invalid={!!error}
                  invalidText={error?.message}
                  labelText={t('newPassword', 'New password')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              name="passwordConfirmation"
              control={methods.control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <PasswordInput
                  id="passwordConfirmation"
                  invalid={!!error}
                  invalidText={error?.message}
                  labelText={t('confirmPassword', 'Confirm new password')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={close}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button className={styles.submitButton} disabled={isChangingPassword} type="submit">
            {isChangingPassword ? (
              <InlineLoading description={t('changingLanguage', 'Changing password') + '...'} />
            ) : (
              <span>{t('change', 'Change')}</span>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </FormProvider>
  );
};

export default ChangePasswordModal;
