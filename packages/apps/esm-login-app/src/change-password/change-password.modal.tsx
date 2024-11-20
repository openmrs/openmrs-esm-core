import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import {
  Button,
  Form,
  InlineLoading,
  InlineNotification,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PasswordInput,
  Stack,
} from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { changeUserPassword } from './change-password.resource';
import styles from './change-password-modal.scss';

interface ChangePasswordModalProps {
  close(): () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ close }) => {
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const oldPasswordValidation = z
    .string({
      required_error: t('oldPasswordRequired', 'Old password is required'),
    })
    .trim()
    .min(1, t('oldPasswordRequired', 'Old password is required'));

  const newPasswordValidation = z
    .string({
      required_error: t('newPasswordRequired', 'New password is required'),
    })
    .trim()
    .min(1, t('newPasswordRequired', 'New password is required'));

  const passwordConfirmationValidation = z
    .string({
      required_error: t('passwordConfirmationRequired', 'Password confirmation is required'),
    })
    .trim()
    .min(1, t('passwordConfirmationRequired', 'Password confirmation is required'));

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

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof changePasswordFormSchema>> = useCallback(
    (data) => {
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
          const errorMessage = error?.responseBody?.message ?? error?.message;
          setErrorMessage(errorMessage);
        })
        .finally(() => {
          setIsChangingPassword(false);
        });
    },
    [close, t],
  );

  const onError = () => setIsChangingPassword(false);

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <ModalHeader closeModal={close} title={t('changePassword', 'Change password')} />
      <ModalBody>
        <Stack gap={5} className={styles.languageOptionsContainer}>
          <Controller
            name="oldPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                id="oldPassword"
                invalid={!!errors?.oldPassword}
                invalidText={errors?.oldPassword?.message}
                labelText={t('oldPassword', 'Old password')}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                id="newPassword"
                invalid={!!errors?.newPassword}
                invalidText={errors?.newPassword?.message}
                labelText={t('newPassword', 'New password')}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Controller
            name="passwordConfirmation"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                id="passwordConfirmation"
                invalid={!!errors?.passwordConfirmation}
                invalidText={errors?.passwordConfirmation?.message}
                labelText={t('confirmPassword', 'Confirm new password')}
                onChange={onChange}
                value={value}
              />
            )}
          />
          {errorMessage && (
            <InlineNotification
              kind="error"
              onClick={() => setErrorMessage('')}
              subtitle={errorMessage}
              title={t('errorChangingPassword', 'Error changing password')}
            />
          )}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button className={styles.submitButton} disabled={isChangingPassword} type="submit">
          {isChangingPassword ? (
            <InlineLoading description={t('changingPassword', 'Changing password') + '...'} />
          ) : (
            <span>{t('change', 'Change')}</span>
          )}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default ChangePasswordModal;
