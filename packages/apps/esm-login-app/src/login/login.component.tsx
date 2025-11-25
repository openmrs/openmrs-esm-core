import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type To, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, InlineNotification, PasswordInput, TextInput, Tile } from '@carbon/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  getCoreTranslation,
  navigate as openmrsNavigate,
  refetchCurrentUser,
  showModal,
  useConfig,
  useConnectivity,
  useSession,
} from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import Logo from '../logo.component';
import styles from './login.scss';
import BackgroundImage from '../background-image/background-image.component';
import Footer from '../footer/footer.component';
import { getProviderDetails, getRedirectUrl, twoFactorRequired } from '../two-factor/two-factor.resource';

export interface LoginReferrer {
  referrer?: string;
}

const hidden: React.CSSProperties = {
  height: 0,
  width: 0,
  border: 0,
  padding: 0,
};

const Login: React.FC = () => {
  const {
    showPasswordOnSeparateScreen,
    provider: loginProvider,
    links: loginLinks,
    attributeTypes,
  } = useConfig<ConfigSchema>();
  const isLoginEnabled = useConnectivity();
  const { t } = useTranslation();
  const { user } = useSession();
  const location = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };

  const rawNavigate = useNavigate();
  const navigate = useCallback(
    (to: To) => {
      rawNavigate(to, { state: location.state });
    },
    [rawNavigate, location.state],
  );

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const showUsername = location.pathname === '/login';
  const showPassword = !showPasswordOnSeparateScreen || location.pathname === '/login/confirm';

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
    const fieldToFocus =
      showPasswordOnSeparateScreen && showPassword ? passwordInputRef.current : usernameInputRef.current;

    fieldToFocus?.focus();
  }, [showPassword, showPasswordOnSeparateScreen]);

  const continueLogin = useCallback(() => {
    const usernameField = usernameInputRef.current;

    if (usernameField.value && usernameField.value.trim()) {
      navigate('/login/confirm');
    } else {
      usernameField.focus();
    }
  }, [location.state, navigate]);

  const changeUsername = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(evt.target.value || '');
  }, []);

  const changePassword = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value || '');
  }, []);

  const showTwoFactorAuthentication = useCallback(
    (name: string, telephone: string, nationalId: string, onSuccess?: () => Promise<void>) => {
      const dispose = showModal('two-factor-authentication-modal', {
        onClose: () => dispose(),
        name,
        telephone,
        nationalId,
        onSuccess,
      });
    },
    [],
  );

  const handlePostTwoFactorAuthentication = async (username: string, password: string) => {
    const sessionStore = await refetchCurrentUser(username, password);
    const session = sessionStore.session;
    const authenticated = sessionStore?.session?.authenticated;
    if (authenticated) {
      const redirectUrl = getRedirectUrl(session, loginLinks, location);
      openmrsNavigate({ to: redirectUrl });
    } else {
      setErrorMessage(t('invalidCredentials', 'Invalid username or password'));
      setUsername('');
      setPassword('');

      if (showPasswordOnSeparateScreen) {
        navigate('/login');
      }
    }
  };
  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!showPassword) {
        continueLogin();
        return false;
      } else if (!password || !password.trim()) {
        passwordInputRef.current.focus();
        return false;
      }

      try {
        setIsLoggingIn(true);
        const requiresTwoFactor = await twoFactorRequired(t, username, password);

        if (requiresTwoFactor) {
          const providerDetails = await getProviderDetails(username, password, attributeTypes, t, loginLinks, location);
          return showTwoFactorAuthentication(
            providerDetails.name,
            providerDetails.telephone,
            providerDetails.nationalId,
            () => handlePostTwoFactorAuthentication(username, password),
          );
        }
        await handlePostTwoFactorAuthentication(username, password);

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
          navigate('/login');
        }
      } finally {
        setIsLoggingIn(false);
      }

      return false;
    },

    [showPassword, username, password, navigate, showTwoFactorAuthentication],
  );

  if (!loginProvider || loginProvider.type === 'basic') {
    return (
      <div className={styles.container}>
        <div className={styles.formSection}>
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

          {showPasswordOnSeparateScreen && showPassword ? (
            <div className={styles.backButtonDiv}>
              <Button
                className={styles.backButton}
                iconDescription={t('backToUserNameIconLabel', 'Back to username')}
                kind="ghost"
                onClick={() => navigate('/login')}
                renderIcon={(props) => <ArrowLeftIcon {...props} size={24} />}
              >
                <span>{t('back', 'Back')}</span>
              </Button>
            </div>
          ) : null}

          <div className={styles.center}>
            <Logo t={t} />
          </div>

          <form onSubmit={handleSubmit} ref={formRef}>
            {showUsername && (
              <div className={styles.inputGroup}>
                <TextInput
                  id="username"
                  type="text"
                  name="username"
                  labelText={t('username', 'Username')}
                  value={username || ''}
                  onChange={changeUsername}
                  ref={usernameInputRef}
                  autoFocus
                  required
                  className={styles.inputText}
                />
                {showPasswordOnSeparateScreen && (
                  <input
                    id="password"
                    style={hidden}
                    type="password"
                    name="password"
                    className={styles.inputText}
                    value={password || ''}
                    onChange={changePassword}
                  />
                )}
                {showPasswordOnSeparateScreen && (
                  <Button
                    className={styles.continueButton}
                    renderIcon={(props) => <ArrowRightIcon size={24} {...props} />}
                    type="submit"
                    iconDescription="Continue to login"
                    onClick={continueLogin}
                    disabled={!isLoginEnabled}
                  >
                    {t('continue', 'Continue')}
                  </Button>
                )}
              </div>
            )}
            {showPassword && (
              <div className={styles.inputGroup}>
                <PasswordInput
                  id="password"
                  invalidText={t('validValueRequired', 'A valid value is required')}
                  labelText={t('password', 'Password')}
                  name="password"
                  className={styles.inputText}
                  onChange={changePassword}
                  ref={passwordInputRef}
                  required
                  showPasswordLabel={t('showPassword', 'Show password')}
                  value={password || ''}
                />
                {showPasswordOnSeparateScreen && (
                  <input
                    id="username"
                    type="text"
                    name="username"
                    style={hidden}
                    className={styles.inputText}
                    value={username || ''}
                    onChange={changeUsername}
                    required
                  />
                )}
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
                    <span className={styles.signInText}>{t('signIn', 'Sign in')}</span>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>

        <div className={styles.imageSection}>
          <BackgroundImage t={t} />
        </div>
        <Footer />
      </div>
    );
  }

  return null;
};

export default Login;
