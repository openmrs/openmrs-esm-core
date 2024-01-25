import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, InlineLoading, InlineNotification, PasswordInput, TextInput, Tile } from '@carbon/react';
import { ArrowLeft, ArrowRight } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import type { Session } from '@openmrs/esm-framework';
import {
  useConfig,
  interpolateUrl,
  useSession,
  refetchCurrentUser,
  clearCurrentUser,
  getSessionStore,
  useConnectivity,
  navigate as openmrsNavigate,
} from '@openmrs/esm-framework';
import { performLogin } from '../login.resource';
import styles from './login.scss';

const hidden: React.CSSProperties = {
  height: 0,
  width: 0,
  border: 0,
  padding: 0,
};

export interface LoginReferrer {
  referrer?: string;
}

export interface LoginProps extends LoginReferrer {}

const Login: React.FC<LoginProps> = () => {
  const config = useConfig();
  const { showPasswordOnSeparateScreen } = config;
  const isLoginEnabled = useConnectivity();
  const { t } = useTranslation();
  const { user } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const showUsername = location.pathname === '/login';
  const showPassword = !showPasswordOnSeparateScreen || location.pathname === '/login/confirm';

  const handleLogin = useCallback(
    (session: Session) => {
      if (session.sessionLocation) {
        openmrsNavigate({
          to: location?.state?.referrer ? `\${openmrsSpaBase}${location.state.referrer}` : config?.links?.loginSuccess,
        });
      } else {
        navigate('/login/location', { state: location.state });
      }
    },
    [config?.links?.loginSuccess, location.state, navigate],
  );

  const handleUpdateSessionStore = useCallback(() => {
    refetchCurrentUser().then(() => {
      const authenticated = getSessionStore().getState().session.authenticated;
      if (authenticated) {
        handleLogin(getSessionStore().getState().session);
      }
    });
  }, [handleLogin]);

  useEffect(() => {
    if (user) {
      clearCurrentUser();
      handleUpdateSessionStore();
    } else if (!username && location.pathname === '/login/confirm') {
      navigate('/login', { state: location.state });
    }
  }, [username, navigate, location, user, handleLogin, handleUpdateSessionStore]);

  useEffect(() => {
    const fieldToFocus =
      showPasswordOnSeparateScreen && showPassword ? passwordInputRef.current : usernameInputRef.current;

    if (fieldToFocus) {
      fieldToFocus.focus();
    }
  }, [showPassword, showPasswordOnSeparateScreen]);

  useEffect(() => {
    if (!user && config.provider.type === 'oauth2') {
      openmrsNavigate({ to: config.provider.loginUrl });
    }
  }, [config, user]);

  const continueLogin = useCallback(() => {
    const field = usernameInputRef.current;

    if (field.value.length > 0) {
      navigate('/login/confirm', { state: location.state });
    } else {
      field.focus();
    }
  }, [location.state, navigate]);

  const changeUsername = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value), []);

  const changePassword = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value), []);

  const resetUserNameAndPassword = useCallback(() => {
    setUsername('');
    setPassword('');
  }, []);

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!showPassword) {
        continueLogin();
        return false;
      }

      try {
        setIsLoggingIn(true);
        const loginRes = await performLogin(username, password);
        const authData = loginRes.data;
        const valid = authData && authData.authenticated;

        if (valid) {
          handleUpdateSessionStore();
        } else {
          throw new Error('invalidCredentials');
        }
      } catch (error) {
        setIsLoggingIn(false);
        setErrorMessage(error.message);
        resetUserNameAndPassword();
      }

      return false;
    },

    [showPassword, continueLogin, username, password, handleUpdateSessionStore, resetUserNameAndPassword],
  );

  const logo = config.logo.src ? (
    <img src={interpolateUrl(config.logo.src)} alt={config.logo.alt} className={styles['logo-img']} />
  ) : (
    <svg role="img" className={styles['logo']}>
      <title>OpenMRS logo</title>
      <use xlinkHref="#omrs-logo-full-color"></use>
    </svg>
  );

  const partnerLogoImgs = config?.partnerLogos?.map((eachImage: string) => {
    <div className="logo" id="partner_logo_i">
      <img src={interpolateUrl(eachImage)} alt={eachImage} width="40px" />
    </div>;
  });

  if (config.provider.type === 'basic') {
    return (
      <div className={styles.container}>
        <Tile className={styles['login-card']}>
          {errorMessage && (
            <div className={styles.errorMessage}>
              <InlineNotification
                kind="error"
                /**
                 * This comment tells i18n to still keep the following translation keys (used as value for: errorMessage):
                 * t('invalidCredentials')
                 */
                subtitle={t(errorMessage)}
                title={t('error', 'Error')}
                onClick={() => setErrorMessage('')}
              />
            </div>
          )}
          {showPasswordOnSeparateScreen && showPassword ? (
            <div className={styles['back-button-div']}>
              <Button
                className={styles['back-button']}
                iconDescription="Back to username"
                kind="ghost"
                onClick={() => navigate('/login')}
                renderIcon={(props: any) => <ArrowLeft size={24} style={{ marginRight: '0.5rem' }} {...props} />}
              >
                <span>{t('back', 'Back')}</span>
              </Button>
            </div>
          ) : null}
          <div className={styles['center']}>{logo}</div>
          <form onSubmit={handleSubmit} ref={formRef}>
            {showUsername && (
              <div className={styles['input-group']}>
                <TextInput
                  id="username"
                  type="text"
                  name="username"
                  labelText={t('username', 'Username')}
                  value={username}
                  onChange={changeUsername}
                  ref={usernameInputRef}
                  autoFocus
                  required
                />
                {/* For password managers */}
                {showPasswordOnSeparateScreen && (
                  <input
                    id="password"
                    style={hidden}
                    type="password"
                    name="password"
                    value={password}
                    onChange={changePassword}
                  />
                )}
                {showPasswordOnSeparateScreen && (
                  <Button
                    className={styles.continueButton}
                    renderIcon={(props: any) => <ArrowRight size={24} {...props} />}
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
              <div className={styles['input-group']}>
                <PasswordInput
                  id="password"
                  invalidText={t('validValueRequired', 'A valid value is required')}
                  labelText={t('password', 'Password')}
                  name="password"
                  value={password}
                  onChange={changePassword}
                  ref={passwordInputRef}
                  required
                  showPasswordLabel="Show password"
                />
                {/* For password managers */}
                {showPasswordOnSeparateScreen && (
                  <input
                    id="username"
                    type="text"
                    name="username"
                    style={hidden}
                    value={username}
                    onChange={changeUsername}
                    required
                  />
                )}
                <Button
                  type="submit"
                  className={styles.continueButton}
                  renderIcon={(props: any) => <ArrowRight size={24} {...props} />}
                  iconDescription="Log in"
                  disabled={!isLoginEnabled || isLoggingIn}
                >
                  {isLoggingIn ? (
                    <InlineLoading className={styles.loader} description={t('loggingIn', 'Logging in') + '...'} />
                  ) : (
                    <span>{t('login', 'Log in')}</span>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Tile>
        {config.showVersionNumber && <p className={styles['powered-by-txt']}>Version {config.appVersion}</p>}

        <div className={styles['footer']}>
          <p className={styles['powered-by-txt']}>{t('poweredBy', 'Powered by')}</p>
          <div className={styles['logos-container']}>
            <svg
              role="img"
              className={styles['powered-by-logo']}
              style={{ width: '10rem', height: '4rem', marginRight: '2rem' }}
            >
              <use xlinkHref="#omrs-logo-partial-mono"></use>
            </svg>
            <div id="partner_logos_container">
              {config?.partnerLogos?.map((plogo: string, index: React.Key) => (
                <img
                  key={index}
                  src={interpolateUrl(plogo)}
                  alt={plogo}
                  style={{ width: '6rem', height: '4rem', marginLeft: '2rem' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Login;
