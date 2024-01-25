import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './change-passwords.scss';
import { useTranslation } from 'react-i18next';
import { InlineNotification, PasswordInput, Tile, Button } from '@carbon/react';
import { navigate, ExtensionSlot, setUserLanguage, useConfig, showToast } from '@openmrs/esm-framework';
import { ButtonSet } from '@carbon/react';
import { performPasswordChange } from './change-password.resource';
import { performLogout } from '../redirect-logout/logout.resource';

export interface ChangePasswordProps {}

const ChangePassword: React.FC<ChangePasswordProps> = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [newPasswordError, setNewPasswordErr] = useState('');
  const [oldPasswordError, setOldPasswordErr] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isOldPasswordInvalid, setIsOldPasswordInvalid] = useState<boolean>(true);
  const [isNewPasswordInvalid, setIsNewPasswordInvalid] = useState<boolean>(true);
  const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = useState<boolean>(true);

  const [passwordInput, setPasswordInput] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const resetUserNameAndPassword = useCallback(() => {
    setPasswordInput({ oldPassword: '', newPassword: '', confirmPassword: '' });
  }, []);

  useEffect(() => {
    if (passwordInput.oldPassword !== '') {
      handleValidation(passwordInput.oldPassword, 'oldPassword');
    }
    if (passwordInput.newPassword !== '') {
      handleValidation(passwordInput.newPassword, 'newPassword');
    }
    if (passwordInput.confirmPassword !== '') {
      handleValidation(passwordInput.confirmPassword, 'confirmPassword');
    }
  }, [passwordInput]);

  const handlePasswordChange = (event) => {
    const passwordInputValue = event.target.value.trim();
    const passwordInputFieldName = event.target.name;
    const NewPasswordInput = { ...passwordInput, [passwordInputFieldName]: passwordInputValue };
    setPasswordInput(NewPasswordInput);
  };

  const handleValidation = (passwordInputValue, passwordInputFieldName) => {
    // const passwordInputValue = event.target.value.trim();
    // const passwordInputFieldName = event.target.name;
    if (passwordInputFieldName === 'newPassword') {
      const uppercaseRegExp = /(?=.*?[A-Z])/;
      const lowercaseRegExp = /(?=.*?[a-z])/;
      const digitsRegExp = /(?=.*?[0-9])/;
      const minLengthRegExp = /.{8,}/;
      const passwordLength = passwordInputValue.length;
      const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
      const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
      const digitsPassword = digitsRegExp.test(passwordInputValue);
      const minLengthPassword = minLengthRegExp.test(passwordInputValue);
      let errMsg = '';
      if (passwordLength === 0) {
        errMsg = 'Password is empty';
      } else if (!uppercasePassword) {
        errMsg = 'At least one Uppercase';
      } else if (!lowercasePassword) {
        errMsg = 'At least one Lowercase';
      } else if (!digitsPassword) {
        errMsg = 'At least one digit';
      } else if (!minLengthPassword) {
        errMsg = 'At least minimum 8 characters';
      } else if (passwordInput.oldPassword.length > 0 && passwordInput.newPassword === passwordInput.oldPassword) {
        errMsg = 'New password must not be the same as the old password';
      } else {
        errMsg = '';
        setIsNewPasswordInvalid(false);
      }
      setNewPasswordErr(errMsg);
    } else if (
      passwordInputFieldName === 'confirmPassword' ||
      (passwordInputFieldName === 'newPassword' && passwordInput.confirmPassword.length > 0)
    ) {
      if (passwordInput.confirmPassword !== passwordInput.newPassword) {
        setConfirmPasswordError('Confirm password is must be the same as the new password');
      } else {
        setConfirmPasswordError('');
        setIsConfirmPasswordInvalid(false);
      }
    } else {
      if (passwordInput.newPassword.length > 0 && passwordInput.newPassword === passwordInput.oldPassword) {
        setOldPasswordErr('Old password must not be the same as the new password');
      } else {
        setOldPasswordErr('');
        setIsOldPasswordInvalid(false);
      }
    }
  };

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      try {
        setIsSavingPassword(true);
        const response = await performPasswordChange(passwordInput.oldPassword, passwordInput.confirmPassword);
        if (response.ok) {
          performLogout().then(() => {
            const defaultLang = document.documentElement.getAttribute('data-default-lang');
            setUserLanguage({
              locale: defaultLang,
              authenticated: false,
              sessionId: '',
            });
            if (config.provider.type === 'oauth2') {
              navigate({ to: config.provider.logoutUrl });
            } else {
              navigate({ to: '${openmrsSpaBase}/login' });
            }
            showToast({
              title: t('userPassword', 'User password'),
              description: t('userPasswordUpdated', 'User password updated successfully'),
              kind: 'success',
            });
          });
        } else {
          throw new Error('invalidCredentials');
        }
      } catch (error) {
        setIsSavingPassword(false);
        setErrorMessage(error.message);
      }

      return false;
    },

    [passwordInput, resetUserNameAndPassword],
  );
  return (
    <>
      <ExtensionSlot name="breadcrumbs-slot" />
      <div className={classNames('canvas', styles['container'])}>
        <div className={styles['input-group']}>
          {errorMessage && (
            <InlineNotification
              className={styles.errorMessage}
              kind="error"
              /**
               * This comment tells i18n to still keep the following translation keys (used as value for: errorMessage):
               * t('invalidCredentials')
               */
              subtitle={t(errorMessage)}
              title={t('error', 'Error')}
              onClick={() => setErrorMessage('')}
            />
          )}
          <Tile className={styles['login-card']}>
            <form onSubmit={handleSubmit} ref={formRef}>
              <div className={styles['input-group']}>
                <PasswordInput
                  id="oldPassword"
                  invalid={oldPasswordError.length > 0}
                  invalidText={oldPasswordError}
                  labelText={t('oldPassword', 'Old Password')}
                  name="oldPassword"
                  value={passwordInput.oldPassword}
                  onChange={handlePasswordChange}
                  // onKeyUp={handleValidation}
                  ref={oldPasswordInputRef}
                  required
                  showPasswordLabel="Show old password"
                />
                <PasswordInput
                  id="newPassword"
                  invalid={newPasswordError.length > 0}
                  invalidText={newPasswordError}
                  labelText={t('newPassword', 'New Password')}
                  name="newPassword"
                  value={passwordInput.newPassword}
                  onChange={handlePasswordChange}
                  // onKeyUp={handleValidation}
                  ref={newPasswordInputRef}
                  required
                  showPasswordLabel="Show new password"
                />
                <PasswordInput
                  id="confirmPassword"
                  invalid={confirmPasswordError.length > 0}
                  invalidText={confirmPasswordError}
                  labelText={t('confirmPassword', 'Confirm Password')}
                  name="confirmPassword"
                  value={passwordInput.confirmPassword}
                  onChange={handlePasswordChange}
                  // onKeyUp={handleValidation}
                  ref={confirmPasswordInputRef}
                  required
                  showPasswordLabel="Show confirm password"
                />
                <ButtonSet className={styles.buttonSet}>
                  <Button
                    style={{ maxWidth: '50%' }}
                    onClick={() => navigate({ to: `\${openmrsSpaBase}/home` })}
                    disabled={isSavingPassword}
                    kind="secondary"
                  >
                    {t('discard', 'Discard')}
                  </Button>
                  <Button
                    style={{ maxWidth: '50%' }}
                    disabled={
                      isSavingPassword || isNewPasswordInvalid || isConfirmPasswordInvalid || isOldPasswordInvalid
                    }
                    kind="primary"
                    type="submit"
                  >
                    {t('save', 'Save')}
                  </Button>
                </ButtonSet>
              </div>
            </form>
          </Tile>
        </div>
      </div>
    </>
  );
};
export default ChangePassword;
