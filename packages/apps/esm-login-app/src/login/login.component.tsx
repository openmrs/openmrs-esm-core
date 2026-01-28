import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, InlineNotification, PasswordInput, TextInput, Tile } from '@carbon/react';
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
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

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
        if (!passwordInputRef.current?.value) {
          passwordInputRef.current?.focus();
        }
      } else {
        usernameInputRef.current?.focus();
      }
    }
  }, [showPasswordField, showPasswordOnSeparateScreen]);

  const continueLogin = useCallback(() => {
    const currentUsername = usernameInputRef.current?.value?.trim();
    if (currentUsername) {
      // If credentials were autofilled, input onChange might not have been called
      setUsername(currentUsername);
      setShowPasswordField(true);
    } else {
      usernameInputRef.current?.focus();
    }
  }, []);

  const changeUsername = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value), []);
  const changePassword = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value), []);

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      // If credentials were autofilled, input onChange might not have been called
      const currentUsername = usernameInputRef.current?.value?.trim() || username;
      const currentPassword = passwordInputRef.current?.value || password;

      if (showPasswordOnSeparateScreen && !showPasswordField) {
        continueLogin();
        return false;
      }

      if (!currentPassword || !currentPassword.trim()) {
        passwordInputRef.current?.focus();
        return false;
      }

      try {
        setIsLoggingIn(true);
        const sessionStore = await refetchCurrentUser(currentUsername, currentPassword);
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
      loginLinks,
      location,
      t,
      continueLogin,
    ],
  );

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
              />
            </div>
          )}
          <div className={styles.center}>
            <Logo t={t} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <TextInput
                id="username"
                type="text"
                name="username"
                autoComplete="username"
                labelText={t('username', 'Username')}
                value={username}
                onChange={changeUsername}
                ref={usernameInputRef}
                required
                autoFocus
              />
              {showPasswordOnSeparateScreen ? (
                <>
                  <div className={showPasswordField ? undefined : styles.hiddenPasswordField}>
                    <PasswordInput
                      id="password"
                      labelText={t('password', 'Password')}
                      name="password"
                      autoComplete="current-password"
                      onChange={changePassword}
                      ref={passwordInputRef}
                      required
                      value={password}
                      showPasswordLabel={t('showPassword', 'Show password')}
                      invalidText={t('validValueRequired', 'A valid value is required')}
                      aria-hidden={!showPasswordField}
                      tabIndex={showPasswordField ? 0 : -1}
                    />
                  </div>
                  {showPasswordField ? (
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
                  ) : (
                    <Button
                      type="submit"
                      className={styles.continueButton}
                      renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                      iconDescription={t('continueToPassword', 'Continue to password')}
                      onClick={(evt) => {
                        evt.preventDefault();
                        continueLogin();
                      }}
                      disabled={!isLoginEnabled}
                    >
                      {t('continue', 'Continue')}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <PasswordInput
                    id="password"
                    labelText={t('password', 'Password')}
                    name="password"
                    autoComplete="current-password"
                    onChange={changePassword}
                    ref={passwordInputRef}
                    required
                    value={password}
                    showPasswordLabel={t('showPassword', 'Show password')}
                    invalidText={t('validValueRequired', 'A valid value is required')}
                  />
                  <Button
                    type="submit"
                    className={styles.continueButton}
                    renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                    iconDescription={t('login', 'Log in')}
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
          </form>
        </Tile>
        <Footer />
      </div>
    );
  }
  return null;
};

export default Login;
