import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  InlineLoading,
  InlineNotification,
  PasswordInput,
  TextInput,
  Tile,
  Checkbox,
  Form,
  FormGroup,
  PasswordStrengthMeter,
} from '@carbon/react';
import {
  ArrowRightIcon,
  getCoreTranslation,
  refetchCurrentUser,
  navigate as openmrsNavigate,
  useConfig,
  useConnectivity,
  useSession,
} from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import Logo from '../logo.component';
import Footer from '../footer.component';
import styles from './login.scss';

export interface LoginReferrer {
  referrer?: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const { showPasswordOnSeparateScreen, provider: loginProvider, links: loginLinks } = useConfig<ConfigSchema>();
  const isLoginEnabled = useConnectivity();
  const { t } = useTranslation();
  const { user } = useSession();
  const location = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Memoize validation functions
  const validateUsername = useCallback(
    (value: string) => {
      if (!value.trim()) {
        return t('usernameRequired', 'Username is required');
      }
      return '';
    },
    [t],
  );

  const validatePassword = useCallback(
    (value: string) => {
      if (!value.trim()) {
        return t('passwordRequired', 'Password is required');
      }
      if (value.length < 8) {
        return t('passwordTooShort', 'Password must be at least 8 characters');
      }
      return '';
    },
    [t],
  );

  // Handle form validation
  const validateForm = useCallback(() => {
    const errors: FormErrors = {};
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) errors.username = usernameError;
    if (passwordError) errors.password = passwordError;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [username, password, validateUsername, validatePassword]);

  useEffect(() => {
    if (!user) {
      if (loginProvider.type === 'oauth2') {
        openmrsNavigate({ to: loginProvider.loginUrl });
      } else if (!username && location.pathname === '/login/confirm') {
        navigate('/login');
      }
    }
  }, [username, navigate, location, user, loginProvider]);

  useEffect(() => {
    if (showPasswordOnSeparateScreen) {
      if (showPasswordField) {
        passwordInputRef.current?.focus();
      } else {
        usernameInputRef.current?.focus();
      }
    }
  }, [showPasswordField, showPasswordOnSeparateScreen]);

  const continueLogin = useCallback(() => {
    const usernameError = validateUsername(username);
    if (usernameError) {
      setFormErrors({ username: usernameError });
      usernameInputRef.current?.focus();
      return;
    }
    setShowPasswordField(true);
  }, [username, validateUsername]);

  const changeUsername = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
      setUsername(value);
      if (formErrors.username) {
        setFormErrors((prev) => ({ ...prev, username: validateUsername(value) }));
      }
    },
    [formErrors, validateUsername],
  );

  const changePassword = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
      setPassword(value);
      if (formErrors.password) {
        setFormErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      }
    },
    [formErrors, validatePassword],
  );

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (showPasswordOnSeparateScreen && !showPasswordField) {
        continueLogin();
        return false;
      }

      if (!validateForm()) {
        return false;
      }

      try {
        setIsLoggingIn(true);
        const sessionStore = await refetchCurrentUser(username, password);
        const session = sessionStore.session;
        const authenticated = sessionStore?.session?.authenticated;

        if (authenticated) {
          if (session.sessionLocation) {
            let to = loginLinks?.loginSuccess || '/home';
            if (location?.state?.referrer) {
              if (location.state.referrer.startsWith('/')) {
                to = `\${openmrsSpaBase}${location.state.referrer}`;
              } else {
                to = location.state.referrer;
              }
            }

            if (rememberMe) {
              localStorage.setItem('rememberedUsername', username);
            } else {
              localStorage.removeItem('rememberedUsername');
            }

            openmrsNavigate({ to });
          } else {
            navigate('/login/location');
          }
        } else {
          setErrorMessage(t('invalidCredentials', 'Invalid username or password'));
          setUsername('');
          setPassword('');
          if (showPasswordOnSeparateScreen) {
            setShowPasswordField(false);
          }
        }

        return true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(t('invalidCredentials', 'Invalid username or password'));
        }
        setUsername('');
        setPassword('');
        if (showPasswordOnSeparateScreen) {
          setShowPasswordField(false);
        }
      } finally {
        setIsLoggingIn(false);
      }
    },
    [
      username,
      password,
      navigate,
      showPasswordOnSeparateScreen,
      showPasswordField,
      validateForm,
      rememberMe,
      location,
      loginLinks,
      continueLogin,
      t,
    ],
  );

  // Load remembered username on mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  if (!loginProvider || loginProvider.type === 'basic') {
    return (
      <div className={styles.container}>
        <Tile className={styles.loginCard}>
          {errorMessage && (
            <div className={styles.errorMessage}>
              <InlineNotification
                kind="error"
                subtitle={t(errorMessage)}
                title={getCoreTranslation('error')}
                onClick={() => setErrorMessage('')}
                lowContrast
              />
            </div>
          )}
          <div className={styles.center}>
            <Logo t={t} />
          </div>
          <Form onSubmit={handleSubmit}>
            <FormGroup legendText="">
              <div className={styles.inputGroup}>
                <TextInput
                  id="username"
                  type="text"
                  labelText={t('username', 'Username')}
                  value={username}
                  onChange={changeUsername}
                  ref={usernameInputRef}
                  required
                  autoFocus
                  invalid={!!formErrors.username}
                  invalidText={formErrors.username}
                  disabled={isLoggingIn}
                />
                {showPasswordOnSeparateScreen ? (
                  showPasswordField ? (
                    <>
                      <PasswordInput
                        id="password"
                        labelText={t('password', 'Password')}
                        name="password"
                        onChange={changePassword}
                        ref={passwordInputRef}
                        required
                        value={password}
                        showPasswordLabel={t('showPassword', 'Show password')}
                        invalidText={formErrors.password}
                        invalid={!!formErrors.password}
                        disabled={isLoggingIn}
                      />
                      <PasswordStrengthMeter password={password} className={styles.passwordStrength} />
                      <Checkbox
                        id="rememberMe"
                        labelText={t('rememberMe', 'Remember me')}
                        checked={rememberMe}
                        onChange={(_, { checked }) => setRememberMe(checked)}
                        disabled={isLoggingIn}
                      />
                      <Button
                        type="submit"
                        className={styles.continueButton}
                        renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                        iconDescription={t('loginButtonIconDescription', 'Log in button')}
                        disabled={!isLoginEnabled || isLoggingIn}
                      >
                        {isLoggingIn ? (
                          <InlineLoading className={styles.loader} description={t('loggingIn', 'Logging in') + '...'} />
                        ) : (
                          t('login', 'Log in')
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      className={styles.continueButton}
                      renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                      iconDescription="Continue to password"
                      onClick={continueLogin}
                      disabled={!isLoginEnabled || isLoggingIn}
                    >
                      {t('continue', 'Continue')}
                    </Button>
                  )
                ) : (
                  <>
                    <PasswordInput
                      id="password"
                      labelText={t('password', 'Password')}
                      name="password"
                      onChange={changePassword}
                      ref={passwordInputRef}
                      required
                      value={password}
                      showPasswordLabel={t('showPassword', 'Show password')}
                      invalidText={formErrors.password}
                      invalid={!!formErrors.password}
                      disabled={isLoggingIn}
                    />
                    <PasswordStrengthMeter password={password} className={styles.passwordStrength} />
                    <Checkbox
                      id="rememberMe"
                      labelText={t('rememberMe', 'Remember me')}
                      checked={rememberMe}
                      onChange={(_, { checked }) => setRememberMe(checked)}
                      disabled={isLoggingIn}
                    />
                    <Button
                      type="submit"
                      className={styles.continueButton}
                      renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                      iconDescription="Log in"
                      disabled={!isLoginEnabled || isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <InlineLoading className={styles.loader} description={t('loggingIn', 'Logging in') + '...'} />
                      ) : (
                        t('login', 'Log in')
                      )}
                    </Button>
                  </>
                )}
              </div>
            </FormGroup>
          </Form>
        </Tile>
        <Footer />
      </div>
    );
  }
  return null;
};

export default Login;
