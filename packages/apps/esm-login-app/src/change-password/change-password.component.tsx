import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { Button, Form, PasswordInput, InlineLoading, Tile } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { changeUserPassword } from './change-password.resource';
import Logo from '../logo.component';
import styles from './change-password.scss';

const ChangePassword: React.FC = () => {
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

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof changePasswordFormSchema>> = useCallback(
    (data) => {
      setIsChangingPassword(true);

      const { oldPassword, newPassword } = data;

      changeUserPassword(oldPassword, newPassword)
        .then(() => {
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
    },
    [t],
  );

  const onError = useCallback(() => setIsChangingPassword(false), []);

  return (
    <div className={styles.container}>
      <Tile className={styles.changePasswordCard}>
        <div className={styles.alignCenter}>
          <Logo t={t} />
        </div>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
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
          <Button className={styles.submitButton} disabled={isChangingPassword} type="submit">
            {isChangingPassword ? (
              <InlineLoading description={t('changingPassword', 'Changing password') + '...'} />
            ) : (
              <span>{t('change', 'Change Password')}</span>
            )}
          </Button>
        </Form>
      </Tile>
    </div>
  );
};

export default ChangePassword;
